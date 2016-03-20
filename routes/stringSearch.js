var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");


router.get('/', function(req, res, next) {//request, response

    var querySegment = developQuery(req.query.searchInput);
    var xQuery = "XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
        "for $file in collection('ColensoDB')" +
        "where "+ querySegment +
        "return db:path($file)";

  client.execute(xQuery,function (error, result) {
        if(error){ console.error(error);}
        else {
            var list = result.result;
            var listArray = list.split("\r\n");
            console.log("LISTARRAY: " + listArray);
          res.render('stringSearch', { queryResult:  listArray});
        }
      }
  );
});

function developQuery(searchQuery){
    if(searchQuery === undefined){
        return "$file//text() contains text {'kshfbklsdbhfkljhsdfklhsdfkljfh'}";
    }
    console.log("TESTY: " + searchQuery);
    var textSearch = "$file//text() contains text {'";
    var splitQuery = searchQuery.split(/[ ,]+/);
    var finalQuery = "$file//text() contains text {'";
    var currentWord = "";

    console.log("SPLIT QUERY: " + splitQuery);
    for(var i = 0; i < splitQuery.length; i++){
        if(splitQuery[i] === "and"){
            console.log("TEST 1");
            finalQuery = finalQuery + currentWord + "'}" + " and " + textSearch;
            currentWord = ""
        } else if(splitQuery[i] === "or"){
            console.log("TEST 2");
            finalQuery = finalQuery + currentWord + "'}" + " or " + textSearch;
            currentWord = ""
        } /*else if(splitQuery[i] === "not") {
            console.log("TEST 3");
            finalQuery = finalQuery + currentWord + "'}" + " not " + textSearch;
            currentWord = ""
        }*/ else{
            console.log("TEST 4");
            if(currentWord === ""){//newWord
                currentWord = splitQuery[i];
            } else {
                currentWord = currentWord  + splitQuery[i];
            }

        }
    }
    if(currentWord !== ""){
        finalQuery = finalQuery + currentWord + "'}";
    }
    console.log("Final Query " + finalQuery);
    return finalQuery;
}




module.exports = router;
