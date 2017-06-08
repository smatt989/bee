package com.example.app.Routes

import com.example.app.{AuthenticationSupport, SlickRoutes}
import com.example.app.models._
import org.json4s.JsonAST.JObject

trait AppRoutes extends SlickRoutes with AuthenticationSupport{


  get("/") {
    <html>
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        </head>
        <body>
          <div id="app"></div>
          <script src="/front-end/dist/bundle.js"></script>
        </body>
      </html>
  }

}
