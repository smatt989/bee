package com.example.app

import javax.servlet.http.HttpServletResponse

/**
  * Created by matt on 8/11/17.
  */
object CSVWriter {

  def writeCsv[A](elements: Seq[A], getFields: Seq[(String, (A) => Any)])(implicit response: HttpServletResponse) = {
    response.setContentType("application/ms-excel"); // or you can use text/csv
    response.setHeader("Content-Disposition", "attachment; filename=output.csv")
    // Write the header line
    val out = response.getOutputStream
    val header = getFields.map(_._1).mkString(", ")+"\n"
    out.write(header.getBytes())
    // Write the content
    val line = elements.map(a => getFields.map(_._2(a)).mkString(",")).mkString("\n")
    out.write(line.toString.getBytes())
    out.flush()
  }

}
