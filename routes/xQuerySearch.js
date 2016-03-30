var express = require('express');
var router = express.Router();
var pretty = require('vkbeautify');

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

router.get('/', function(req, res, next) {//request, response
    res.render('xQuerySearch');
});

router.get('/query/*', function(req, res, next) {//request, response

    var xQuery = "XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
        req.query.searchInput;

    client.execute(xQuery,function (error, result) {
            if(error){ console.error(error);
                console.log("ERROR: " + error);
                res.render('xQuerySearch', { queryResult: "ERROR: " + error});
            }
            else {

                var list = result.result;
                var listArray = list.split("\r\n");

                if(list.length === 0){
                    var errorMessage = ["Incorrect query", "please try again"];
                        res.render('xQuerySearch', { queryResult:  errorMessage});
                } else {
                    res.render('xQuerySearch', {queryResult: listArray});
                }
            }
        }
    );
});

module.exports = router;

