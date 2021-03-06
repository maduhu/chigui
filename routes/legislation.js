var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var LegislationVersion = require('../app/models/legislation.js');
var add_objects = require('../app/models/additionalModels.js');
var cors = require;

var exports = module.exports = {}

exports.getVersion = function(req, res) {
	var id_rc=req.params.id_record;
	var ver=req.params.version;;
	add_objects.RecordVersion.findOne({ _id : id_rc }).populate('legislationVersion').exec(function (err, record) {
    if(record){
  		if (err){
  			res.send(err);
  		};
  		var len=record.legislationVersion.length;
  		if(ver<=len && ver>0){
  			res.json(record.legislationVersion[ver-1]);
  		}else{
  			res.json({message: "The number of version is not valid"});
  		}
    }else{
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
	});
};

exports.postVersion = function(req, res) {
  var legislation_version  = req.body; 
  legislation_version._id = mongoose.Types.ObjectId();

  legislation_version.created=Date();
  legislation_version.state="accepted";
  legislation_version.element="legislation";
  legislation_version = new LegislationVersion(legislation_version);

  var id_v = legislation_version._id;
  var id_rc = req.params.id_record;

  var ob_ids= new Array();
  ob_ids.push(id_v);

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){ 
      if(typeof count!=="undefined"){
      if(count==0){
        res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
      }else{
        add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "legislationVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
          if (err){
              res.status(406);
              res.send(err);
          }else{
            legislation_version.id_record=id_rc;
            legislation_version.version=doc.legislationVersion.length+1;
            var ver = legislation_version.version;
            legislation_version.save(function(err){
              if(err){
                res.status(406);
                res.send(err);
              }else{
                res.json({ message: 'Save LegislationVersion', element: 'legislationVersion', version : ver, _id: id_v, id_record : id_rc });
              }
            });
          }
        });
      }
    }else{
      res.status(406);
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
  }
    );
  }else{
    res.status(406);
    res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}