var express = require('express');
var pretty = require('vkbeautify');
//var jQuery = require('jquery');
var Handlebars = require('handlebars');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

/* GET home page. */
router.get("/",function(req,res,next){
    var path = req.originalUrl.split("browse/?pathResult=");
    path = path[1];
    console.log("TEST: " + path);
    client.execute("XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';"+
        "doc('ColensoDB/"+ path +"')", function(error,result){
        if(error){console.error(error)}
        else {
            if(typeof result.result === 'string'){
                console.log("IS A STRING");
            }

           // var xmlFile = jQuery.parseXML(result.result);
            var xmlDoc = pretty.xml(result.result,4);
            xmlDoc = new Handlebars.SafeString(xmlDoc);

            res.render('browse',{xmlDoc: xmlDoc});

        }
    });

});



module.exports = router;
