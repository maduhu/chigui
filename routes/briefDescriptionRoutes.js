var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var BriefDescriptionVersion = require('../app/models/briefDescription.js');
var add_objects = require('../app/models/additionalModels.js');
var cors = require;

var exports = module.exports = {}

exports.postVersion = function(req, res) {
  var brief_description_version  = req.body; 
  brief_description_version._id = mongoose.Types.ObjectId();

  brief_description_version.created=Date();
  brief_description_version.state="accepted";
  brief_description_version.element="briefDescription";
  brief_description_version = new BriefDescriptionVersion(brief_description_version);

  var id_v = brief_description_version._id;
  var id_rc = req.params.id_record;

  var ob_ids= new Array();
  ob_ids.push(id_v);

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){ 
      if(typeof count!=="undefined"){
      if(count==0){
        res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
      }else{
        add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "briefDescriptionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
          if (err){
              res.status(406);
              res.send(err);
          }else{
            brief_description_version.id_record=id_rc;
            brief_description_version.version=doc.briefDescriptionVersion.length+1;
            var ver = brief_description_version.version;
            brief_description_version.save(function(err){
              if(err){
                res.status(406);
                res.send(err);
              }else{
                res.json({ message: 'Saved BriefDescriptionVersion', element: 'BriefDescription', version : ver, _id: id_v, id_record : id_rc });
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


exports.getVersion = function(req, res) {
  var id_rc=req.params.id_record;
  var ver=req.params.version;
  add_objects.RecordVersion.findOne({ _id : id_rc }).populate('briefDescriptionVersion').exec(function (err, record) {
    if(record){
      if (err){
        res.send(err);
      };
      var len=record.briefDescriptionVersion.length;
      if(ver<=len && ver>0){
        res.json(record.briefDescriptionVersion[ver-1]);
      }else{
        res.json({message: "The number of version is not valid"});
      }
    }else{
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
  });
};



