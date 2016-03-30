var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");


router.get('/', function(req, res, next) {//request, response

    var querySegment = developQuery(req.query.searchInput);
    console.log("QUERYSEGMENT: " + querySegment);
    console.log(querySegment);
    var xQuery = "XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
        "for $file in collection('ColensoDB')" +
        "where "+ querySegment +
        "return db:path($file)";

  client.execute(xQuery,function (error, result) {
        if(error){ console.error(error);}
        else {
            var list = result.result;
            var listArray = list.split("\r\n");

          res.render('stringSearch', { queryResult:  listArray});
        }
      }
  );
});

function developQuery(searchQuery){
    if(searchQuery === undefined){
        return "$file//text() contains text {'kshfbklsdbhfkljhsdfklhsdfkljfh'}";
    }
    var splitQuery = searchQuery.split(/[ ,]+/);
    var finalQuery = "$file//text() contains text '";
    var currentWord = "";

    for(var i = 0; i < splitQuery.length; i++){
        if(splitQuery[i] === "AND"){
            finalQuery = finalQuery + currentWord + "'" + " ftand '";
            currentWord = ""
        } else if(splitQuery[i] === "OR"){
            finalQuery = finalQuery + currentWord + "'" + " ftor '";
            currentWord = ""
        } else{
            if(currentWord === ""){//newWord
                currentWord = splitQuery[i];
            } else {
                currentWord = currentWord  + splitQuery[i];
            }
        }
    }
    if(currentWord !== ""){
        finalQuery = finalQuery + currentWord + "'";
    }

    return finalQuery;
}






module.exports = router;
