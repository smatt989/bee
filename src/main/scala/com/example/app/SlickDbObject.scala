package com.example.app

import java.util.UUID

import slick.lifted.TableQuery
import slick.profile.FixedSqlStreamingAction

import scala.concurrent.Future
//import slick.driver.H2Driver.api._
import slick.driver.PostgresDriver.api._
import slick.profile.FixedSqlAction

import scala.concurrent.ExecutionContext.Implicits.global
/**
  * Created by matt on 12/1/16.
  */

trait SlickObject[IDType, ScalaClass <: HasId[ScalaClass, IDType], TupleSignature, SlickTable <: Table[TupleSignature]] {

  def deleteQuery(ids: Seq[IDType]): FixedSqlAction[Int, NoStream, Effect.Write]
  def byIdsQuery(ids: Seq[IDType]): FixedSqlStreamingAction[Seq[TupleSignature], TupleSignature, Effect.Read]


  def table: TableQuery[SlickTable]
  def reify(tuple: TupleSignature): ScalaClass
  def db = AppGlobals.db()

  def unapply(a: ScalaClass): Option[TupleSignature]

  def classToTuple(a: ScalaClass): TupleSignature =
    unapply(a).get

  def createMany(as: Seq[ScalaClass]): Future[Seq[ScalaClass]]

  def byIds(ids: Seq[IDType]): Future[Seq[ScalaClass]] =
    db.run(byIdsQuery(ids)).map(_.map(a => reify(a)))

  def deleteMany(ids: Seq[IDType]): Future[Int] =
    db.run(deleteQuery(ids))

  def getAll =
    db.run(table.result).map(_.map(a => reify(a)))

  def create(a: ScalaClass): Future[ScalaClass] = createMany(Seq(a)).map(_.head)
  def byId(id: IDType): Future[ScalaClass] = byIds(Seq(id)).map(_.head)
  def delete(id: IDType): Future[Int] = deleteMany(Seq(id))
}

trait SlickDbObject[ScalaClass <: HasIntId[ScalaClass], TupleSignature, SlickTable <: Table[TupleSignature] with HasIdColumn[Int]] extends SlickObject[Int, ScalaClass, TupleSignature, SlickTable]{

  //HELPER QUERY STATEMENTS

  def createMany(as: Seq[ScalaClass]): Future[Seq[ScalaClass]] = {
    if(as.size > 0) {
      Future.sequence(as.grouped(1000).map(group => {
        val ids = db.run(createQuery(group.map(_.makeSavingId)))
        ids.map(is => zipWithNewIds(group, is))
      }).toSeq).map(_.flatten)
    } else
      Future.apply(as)
  }

  def createQuery(as: Seq[ScalaClass]) =
    (table returning table.map(_.id)) ++= as.map(classToTuple)

  def zipWithNewIds(as: Seq[ScalaClass], ids: Seq[Int]) =
    ids.zipWithIndex.map{ case (id, index) => as(index).updateId(id)}

  def deleteQuery(ids: Seq[Int]) =
    table.filter(_.id inSet ids).delete

  def byIdsQuery(ids: Seq[Int]) =
    table.filter(_.id inSet ids).result

}

trait SlickUUIDObject[ScalaClass <: HasUUID[ScalaClass], TupleSignature, SlickTable <: Table[TupleSignature] with HasIdColumn[String]] extends SlickObject[String, ScalaClass, TupleSignature, SlickTable] {

  def createMany(as: Seq[ScalaClass]): Future[Seq[ScalaClass]] = {
    if(as.size > 0) {
      Future.sequence(as.grouped(1000).map(group => {
        val toCreate = group.map(_.makeSavingId)
        val ids = db.run(createQuery(toCreate))
        ids.map(_ => toCreate)
      }).toSeq).map(_.flatten)
    } else
      Future.apply(as)
  }

  def createQuery(as: Seq[ScalaClass]) =
    table ++= as.map(classToTuple)

  def deleteQuery(ids: Seq[String]) =
    table.filter(_.id inSet ids).delete

  def byIdsQuery(ids: Seq[String]) =
    table.filter(_.id inSet ids).result
}

trait UpdatableDBObject[ScalaClass <: HasIntId[ScalaClass], TupleSignature, SlickTable <: Table[TupleSignature]
  with HasIdColumn[Int]] extends Updatable[Int, ScalaClass, TupleSignature, SlickTable]
  with SlickDbObject[ScalaClass, TupleSignature, SlickTable]

trait UpdatableUUIDObject[ScalaClass <: HasUUID[ScalaClass], TupleSignature, SlickTable <: Table[TupleSignature]
  with HasIdColumn[String]] extends Updatable[String, ScalaClass, TupleSignature, SlickTable]
  with SlickUUIDObject[ScalaClass, TupleSignature, SlickTable]

trait Updatable[IDType, ScalaClass <: HasId[ScalaClass, IDType], TupleSignature, SlickTable <: Table[TupleSignature] with HasIdColumn[IDType]] extends SlickObject[IDType, ScalaClass, TupleSignature, SlickTable] {
  def updateQuery(a: ScalaClass): FixedSqlAction[Int, NoStream, Effect.Write]

  def save(a: ScalaClass): Future[ScalaClass] = saveMany(Seq(a)).map(_.head)

  def updateOne(a: ScalaClass): Future[ScalaClass] =
    updateMany(Seq(a)).map(_.head)

  def updateMany(as: Seq[ScalaClass]): Future[Seq[ScalaClass]] = {
    val queries = DBIO.sequence(as.map(updateQuery))
    db.run(queries).map(_ => as)
  }

  def saveMany(as: Seq[ScalaClass]): Future[Seq[ScalaClass]] = {
    val withTempId = as.zipWithIndex
    val doNotExist = withTempId.filterNot(_._1.existsInDb)
    val createTempIds = doNotExist.map(_._2)
    val created = createMany(doNotExist.map(_._1))
    val createdWithTempIds = created.map(c =>
      createTempIds.zipWithIndex.map{ case (tempId, index) => (c(index), tempId)}
    )
    val doExist = withTempId.filter(_._1.existsInDb)
    val doExistTempIds = doExist.map(_._2)
    val updated = updateMany(doExist.map(_._1))
    val updatedWithTempIds = updated.map( u =>
      doExistTempIds.zipWithIndex.map{ case (tempId, index) => (u(index), tempId)}
    )

    createdWithTempIds.flatMap(c => updatedWithTempIds.map(u => {
      (c ++ u).sortBy(_._2).map(_._1)
    }))
  }
}

trait HasId[A, IDType] {
  def id: IDType
  def existsInDb: Boolean
  def makeSavingId: A
  def updateId(id: IDType): A
}

trait HasIntId[A] extends HasId[A, Int] {

  def makeSavingId = updateId(0)
  def existsInDb =
    !(id == 0 || id == null)
}

trait HasUUID[A] extends HasId[A, String] {
  def makeUUID = UUID.randomUUID().toString


  def makeSavingId = updateId(makeUUID)
  def existsInDb =
    id != null
}