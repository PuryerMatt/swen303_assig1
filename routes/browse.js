var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

/* GET home page. */
router.get("/",function(req,res,next){
    console.log("TEST1: " + req.originalUrl);
    var test = req.originalUrl.split("browse/?pathResult=");
    //var test = req.originalUrl.split("browse/");
    test = test[1];
    console.log("TEST: " + test);
    client.execute("XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';"+
        "doc('ColensoDB/"+ test +"')", function(error,result){
        if(error){console.error(error)}
        else {
          //  var list = result.result;
           // var listArray =  list.split("\n");
            //console.log("RESULT: " + result.result);
            res.render('browse', { xmlDoc: result.result});
        }
    });

});



module.exports = router;
