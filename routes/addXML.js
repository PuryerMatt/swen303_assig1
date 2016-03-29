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
   res.render('addXML', {success: "XML formatted text goes here"});
});
router.post("/add",function(req,res,next){
    var addedXML = req.body.addedXML;

    var name = req.body.docName;
    addedXML = "<TEI xmlns='http://www.tei-c.org/ns/1.0' xml:id='"+name+"'>" + addedXML + "</TEI>";
    //console.log("NAME: " +name);
    //console.log("ADDED XML"+ addedXML);
    if(name.length === 0){
        res.render('addXML', {success: "Please define a document name"});
    } else if(addedXML. length === 0){
        res.render('addXML', {success: "You need to write XML to add XML"});
    }
    client.execute("XQUERY db:add('ColensoDB',"+ addedXML +",'UserAdded/" + name + ".xml')", function(error,result){
        if(error){
            console.error(error);
            res.render('addXML', {success: "Error: " + error});
        }
        else {
            res.render('addXML', {success: "Success!"});

        }
    });

});










module.exports = router;