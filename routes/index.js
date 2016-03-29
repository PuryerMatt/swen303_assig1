var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');


var basex = require('basex');

var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

/* GET home page. */
router.get("/",function(req,res,next){
    //console.log("ORIGINAL URL: " + req.originalUrl);
    if(req.originalUrl === "/") {
        client.execute("XQUERY db:list('ColensoDB')", function (error, result) {
            if (error) {
                console.error(error)
            }
            else {
                var list = result.result;
                var listArray = list.split("\r\n");
                var finalList = grabFront(listArray,0);

                res.render('index', {pathArray: finalList, direct: false});
            }
        });
    } else {
        var path = req.originalUrl.split("/?pathResult=");
        path = path[1];
        var slashCount = 1;
        for(i=0;i<path.length;i++) {
            if (path[i] == '/') {
                slashCount++;
            }
        }

        client.execute("XQUERY db:list('ColensoDB','" + path + "')", function (error, result) {
            if (error) {
                console.error(error)
            }
            else {
                var list = result.result;
                var listArray = list.split("\r\n");
                var finalList = grabFront(listArray,slashCount);
                 // console.log(listArray);
                var direct = false;
                if(finalList[0].search("xml") != -1){
                    direct = true
                }
                //console.log("DIRECT: " + direct);
                res.render('index', {pathArray: finalList, direct: direct});
            }
        });
    }


});

function grabFront(list, slashCount){
    var finalList = [];
    var count = 0;
    for(var i = 0; i < list.length; i++){
        var path = list[i].split("/");
        finalList[i] = path[0];

        for(var j = 0; j < slashCount; j++){
            finalList[i] = finalList[i] + "/" + path[j+1];
        }
        count++
    }
    //remove duplicates
    finalList = finalList.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    return finalList;
}




module.exports = router;

