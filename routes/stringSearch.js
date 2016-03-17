var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

//use this to get the related search?
//req.body.variable

router.get('/', function(req, res, next) {//request, response
    var xQuery = "XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
            /*For every file in the collection*/
        "for $file in collection('ColensoDB')" +
            /*select the file if it contains the text ("req...)*/
        "where $file//text() contains text {'" + req.query.searchInput + "'}" +
            //Return the text of the file
        "return $file";

  client.execute(xQuery,function (error, result) {
        if(error){ console.error(error);}
        else {

          res.render('stringSearch', { queryResult:  result.result});
        }
      }
  );
});




module.exports = router;
