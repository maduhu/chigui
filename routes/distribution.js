var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var DistributionVersion = require('../app/models/distribution.js');
var add_objects = require('../app/models/additionalModels.js');
var cors = require;

var exports = module.exports = {}

exports.getVersion = function(req, res) {
	var id_rc=req.params.id_record;
	var ver=req.params.version;;
	add_objects.RecordVersion.findOne({ _id : id_rc }).populate('distributionVersion').exec(function (err, record) {
    if(record){
  		if (err){
  			res.send(err);
  		};
  		var len=record.distributionVersion.length;
  		if(ver<=len && ver>0){
  			res.json(record.distributionVersion[ver-1]);
  		}else{
  			res.json({message: "The number of version is not valid"});
  		}
    }else{
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
	});
};

exports.postVersion = function(req, res) {
  var distribution_version  = req.body; 
  distribution_version._id = mongoose.Types.ObjectId();

  distribution_version.created=Date();
  distribution_version.state="accepted";
  distribution_version.element="distribution";
  distribution_version = new DistributionVersion(distribution_version);

  var id_v = distribution_version._id;
  var id_rc = req.params.id_record;

  var ob_ids= new Array();
  ob_ids.push(id_v);

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){ 
      if(typeof count!=="undefined"){
      if(count==0){
        res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
      }else{
        add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "distributionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
          if (err){
              res.status(406);
              res.send(err);
          }else{
            distribution_version.id_record=id_rc;
            distribution_version.version=doc.distributionVersion.length+1;
            var ver = distribution_version.version;
            distribution_version.save(function(err){
              if(err){
                res.status(406);
                res.send(err);
              }else{
                res.json({ message: 'Save DistributionVersion', element: 'distributionVersion', version : ver, _id: id_v, id_record : id_rc });
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