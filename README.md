# Bee Label Maker #

This is image annotation software built using scalatra with a connection to Postgres/H2 db with Slick and serving up a react/redux web front end.

## Build & Run ##

```sh
$ cd bee
$ ./sbt
> jetty:start
> browse
```

If `browse` doesn't launch your browser, manually open [http://localhost:8080/](http://localhost:8080/) in your browser.

## Development ##

For development you can have the web server recompile and restart after every code change by using the following code snippit:

```sh
$ cd bee
$ ./sbt
> ~;jetty:stop;jetty:start
```

To develop the front end separately from the backend, start the server the normal way, and separately run the front end on a different port:

```sh
$ cd bee/src/main/webapp/front-end
$ webpack-dev-server --host 0.0.0.0 --port 9000
```


For first time use, to create the db schema:
 [http://localhost:8080/db/create-tables](http://localhost:8080/db/create-tables)

