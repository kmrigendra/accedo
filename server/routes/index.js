(function() {
    'use strict';
    var express = require('express');
    var router = express.Router();
    var mongojs = require('mongojs');
    var db = mongojs('accedodb', ['history']);
    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index');
    });

    router.get('/api/history', function(req, res) {
        db.history.find(function(err, data) {
            res.json(data);
        });
    });
    router.post('/api/history', function(req, res) {
        db.history.update(
          {"id" : req.body.id},
          req.body,
          {upsert: true},
          function(err,data){
              if (err){
                  console.log(err);
              }else{
                  console.log("insert succeded");
              }
          });
    });

    router.get('*', function (req, res) {
     res.redirect('/');  // redirect to / and index.html will be served
    });

    module.exports = router;
}());
