var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var EcologicalSignificanceVersion = require('../app/models/ecologicalSignificance.js');
var add_objects = require('../app/models/additionalModels.js');
var cors = require;

var exports = module.exports = {}

exports.getVersion = function(req, res) {
	var id_rc=req.params.id_record;
	var ver=req.params.version;;
	add_objects.RecordVersion.findOne({ _id : id_rc }).populate('ecologicalSignificanceVersion').exec(function (err, record) {
    if(record){
  		if (err){
  			res.send(err);
  		};
  		var len=record.ecologicalSignificanceVersion.length;
  		if(ver<=len && ver>0){
  			res.json(record.ecologicalSignificanceVersion[ver-1]);
  		}else{
  			res.json({message: "The number of version is not valid"});
  		}
    }else{
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
	});
};

exports.postVersion = function(req, res) {
  var ecological_significance_version  = req.body; 
  //console.log(identification_keys_version);
  ecological_significance_version._id = mongoose.Types.ObjectId();

  ecological_significance_version.created=Date();
  ecological_significance_version.state="accepted";
  ecological_significance_version.element="ecologicalSignificance";
  ecological_significance_version = new EcologicalSignificanceVersion(ecological_significance_version);

  var id_v = ecological_significance_version._id;
  var id_rc = req.params.id_record;

  var ob_ids= new Array();
  ob_ids.push(id_v);

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){ 
      if(typeof count!=="undefined"){
      if(count==0){
        res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
      }else{
        add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "ecologicalSignificanceVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
          if (err){
              res.status(406);
              res.send(err);
          }else{
            ecological_significance_version.id_record=id_rc;
            ecological_significance_version.version=doc.ecologicalSignificanceVersion.length+1;
            var ver = ecological_significance_version.version;
            ecological_significance_version.save(function(err){
              if(err){
                res.status(406);
                res.send(err);
              }else{
                res.json({ message: 'Save EcologicalSignificanceVersion', element: 'ecologicalSignificanceVersion', version : ver, _id: id_v, id_record : id_rc });
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