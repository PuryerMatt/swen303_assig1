var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

/* GET home page. */
router.get("/",function(req,res,next){


        client.execute("XQUERY db:list('ColensoDB')", function (error, result) {
            if (error) {

                console.error(error)
            }
            else {
                var list = result.result;
                var listArray = list.split("\r\n");

                res.render('index', {pathArray: listArray});
            }
        });


});



module.exports = router;

