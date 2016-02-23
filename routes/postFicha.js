var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var Record = require('../app/models/record.js');
var cors = require


/* POST */
router.post('/', function(req, res) {
  var fic= new Record(req.body);
  //fic._doc.creation_date=Date();
  fic.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Record created!', id:fic.id });
            console.log("Record created!");
        });
});

module.exports = router;
