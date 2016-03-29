var express = require('express');
var pretty = require('vkbeautify');
var cheerio = require('cheerio');
var Handlebars = require('handlebars');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");



/* GET home page. */
router.get("/download/*",function(req,res,next){
    var path = req.originalUrl.split("/browse/download/");
    path = path[1];
    path = path.substring(0, path.length - 1);
    console.log("PATH: " + path);
    res.download("Colenso/" + path);


});

/* GET home page. */
router.get("/",function(req,res,next){
    var path = req.originalUrl.split("browse/?pathResult=");
    path = path[1];
    console.log("TEST: " + path);
    client.execute("XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';"+
        "doc('ColensoDB/"+ path +"')", function(error,result){
        if(error){console.error(error)}
        else {





            // $ = cheerio.load(result.result);
            //var xmlFile = $.parseXML();
            // var xmlFile = ParseXML(result.result);
            var prettyDoc = pretty.xml(result.result,4);
            prettyDoc = new Handlebars.SafeString(prettyDoc);
            // console.log(result.result);

            //res.sendFile(xmlDoc.xml);
            //console.log(xmlFile);

            res.render('browse',{xmlDoc: result.result,  prettyDoc: prettyDoc, path:path});

        }
    });

});













module.exports = router;
