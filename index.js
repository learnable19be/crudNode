var { createServer, METHODS } = require("http");
var { parse } = require("url");
const User = require("./lib/Model");
var stringDecoder = require("string_decoder").StringDecoder;
var config = require("./lib/config");
var helper = require("./lib/helper");
var datahelp = require("./lib/data");
var fs = require('fs');
var util = require("util");
//Startup the httpsserver
var httpServer = createServer(function(req, res) {
  
  
   
  //  datahelp.delete('users', "users", (err) => {
  //      console.log("file deleted succefully", err)
  //  })

  
  //Get the url and parse it
  var parsedurl = parse(req.url, true);
  var pathname = parsedurl.pathname;
  //trim the parsed url
  var trimedPath = pathname.replace(/^\/+|\/+$/g, "");
  //get the query string from the url
  var queryString = parsedurl.query;
//   console.log("Query", queryString);
  //get headers from request
  var headers = req.headers;
  //get http methods
  var method = req.method.toLowerCase();
  var buffer = "";
  var decoder = new stringDecoder("utf-8");

  req
    .on("data", function(datachunk) {
      buffer += decoder.write(datachunk);
    //   console.log("buffer", buffer);
      return buffer;
    })
    .on("end", function() {
      decoder.end();
      let body = JSON.parse(buffer);
      const user = new User({
        id: body.id,
        name: body.name,
        email: body.email,
        password: body.password
      });


  //     datahelp.readuser('users', 'users', user.id, (err) => {
  //   console.log(err)
  //   console.log('hitting read ')
  // })


        datahelp.delete('users', "users", user.id,  (err) => {
          // console.log({name: "node test", description: "TEsting update"}, (err) => {
          //     console.log("file update", err)
          // })
          console.log(err)
      })


      // datahelp.create("users", "users", [user], function(err) {       
      //   console.log("file creation", err);
      // });

      //console.log(buffer);
      var data = {
        trimedPath: trimedPath,
        query: queryString,
        method: method,
        headers: headers,
        payload: JSON.parse(buffer)
      };

      var chosenhandler =
        typeof router[trimedPath] !== "undefined"
          ? router[trimedPath]
          : handler.notFound;

      chosenhandler(data, function(statuscode, payload) {
        var payloadString = JSON.stringify(payload);
        statuscode = typeof statuscode == "number" ? statuscode : 200;
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statuscode);
        res.end(payloadString);
        console.log("end response" + " trimed path " + statuscode, payload);
      });
    });
});

var handler = {};

handler.ping = (data, callback) => {
  callback(200, { success: true });
};

handler.notFound = (data, callback) => {
  callback(404, { success: false, message: "Not found" });
};

var router = {
  ping: handler.ping
};


httpServer.listen(config.port, function() {
  console.log(`server is running on port ${config.port}`);
});
