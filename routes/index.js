var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN ColensoDB");

/* GET home page. */
router.get("/",function(req,res,next){
  client.execute("XQUERY declare namespace tei ='http://www.tei-c.org/ns/1.0';" +
      "(//name[@type='place'])[1]",
      function (error, result) {
        if(error){ console.error(error);}
        else {
          //console.log("PRINTING STUFF: " + result.result);
          res.render('index', { title: 'ECS Video Rental', place: result.result });
        }
      }
  );
});

module.exports = router;
