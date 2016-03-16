var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

//use this to get the related search?
//req.body.variable

router.get('/', function(req, res, next) {//request, response
  //I want an xquery to find all the xml documents that are based on a string
    var xQuery = "XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
        "for $file in collection('ColensoDB')" +
        "where $file//text() contains text {'" + req.query.searchInput + "'}" +
        "return $file//text()";

  client.execute(xQuery,function (error, result) {
        if(error){ console.error(error);}
        else {
          console.log("Search queried for: " + req.query.searchInput);
          res.render('stringSearch', { queryResult:  result.result});
        }
      }
  );
});


module.exports = router;
