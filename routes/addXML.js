/**
 * Created by MattP on 29/03/2016.
 */
var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");



/* GET home page. */
router.get("/", function(req,res,next) {
   res.render('addXML');
});
router.post("/add",function(req,res,next){
    var addedXML = req.body.addedXML;
    var name = req.body.docName;
    console.log("NAME: " +name);
    console.log("ADDED XML"+ addedXML);
    client.execute("XQUERY db:add('ColensoDB',"+ addedXML +",'UserAdded/" + name + ".xml')", function(error,result){
        if(error){console.error(error)}
        else {


            res.render('addXML');

        }
    });

});










module.exports = router;