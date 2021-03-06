var express = require('express');
var router = express.Router();
var mongoDB = require('../config/server');
var mongoose = require('mongoose');
var TaxonRecordNameVersion = require('../app/models/taxonRecordName.js');
var add_objects = require('../app/models/additionalModels.js');
var cors = require;

var exports = module.exports = {};

exports.postVersion = function(req, res) {
  var taxon_record_name_version  = req.body; 
  taxon_record_name_version._id = mongoose.Types.ObjectId();
  taxon_record_name_version.created=Date();
  taxon_record_name_version.state="accepted";
  taxon_record_name_version.element="taxonRecordName";
  var eleValue = taxon_record_name_version.taxonRecordName;
  taxon_record_name_version = new TaxonRecordNameVersion(taxon_record_name_version);

  var id_v = taxon_record_name_version._id;
  var id_rc = req.params.id_record;

  var ob_ids= new Array();
  ob_ids.push(id_v);

  console.log("ID Ficha: "+id_rc);

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    if(typeof  eleValue!=="undefined" && eleValue!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){ 
      if(typeof count!=="undefined"){
      if(count==0){
        res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
      }else{
       add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "taxonRecordNameVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
          if (err){
              res.status(406);
              res.send(err);
          }
          taxon_record_name_version.id_record=id_rc;
          taxon_record_name_version.version=doc.taxonRecordNameVersion.length+1;
          var ver = taxon_record_name_version.version;
          taxon_record_name_version.save(function(err){
            if(err){
              res.status(406);
              res.send(err);
            }else{
              res.json({ message: 'Save TaxonRecordNameVersion', element: 'TaxonRecordName', version : ver, _id: id_v, id_record : id_rc });
            }
         });
        });
      }
      }else{
        res.json({message: "Empty Database"});
      }
   });
   }else{
    res.json({message: "Empty data in version of the element"});
   } 
  }else{
    res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
};

exports.postRecord = function(req, res) {
  var taxon_record_name_version  = req.body; 
  taxon_record_name_version._id = mongoose.Types.ObjectId();

  taxon_record_name_version.id_record=mongoose.Types.ObjectId();
  taxon_record_name_version.created=Date();
  taxon_record_name_version.state="accepted";
  taxon_record_name_version.element="taxonRecordName";
  var eleValue = taxon_record_name_version.taxonRecordName;
  taxon_record_name_version = new TaxonRecordNameVersion(taxon_record_name_version);

  var id_v = taxon_record_name_version._id;
  var id_rc = taxon_record_name_version.id_record;
  var ver = 1;
  var ob_ids= new Array();
  ob_ids.push(id_v);

  if(typeof  eleValue!=="undefined" && eleValue!=""){
    add_objects.RecordVersion.count({ _id : id_rc }, function (err, count){
    if(count==0){
      add_objects.RecordVersion.create({ _id:id_rc, taxonRecordNameVersion: ob_ids },function(err, doc){
        if(err){
          res.status(406);
          res.send(err);
        }
        taxon_record_name_version.version=1;

        taxon_record_name_version.save(function(err){
          if(err){
            res.status(406);
            res.send(err);
          }
          res.json({ message: 'Created a new Record and Save TaxonRecordNameVersion', element: 'TaxonRecordName', version : ver, _id: id_v, id_record : id_rc });
        });
      });
    }else{
      res.status(406);
      res.json({message: "Already exists a Record(Ficha) with id: "+id_rc });
    }
  });
  }else{
    res.status(406);
    res.json({message: "Empty data in version of the element"});
  }
}

exports.getVersion = function(req, res) {
  var id_rc=req.params.id_record;
  var ver=req.params.version;
  console.log(id_rc);
  console.log(ver);
  add_objects.RecordVersion.findOne({ _id : id_rc }).populate('taxonRecordNameVersion').exec(function (err, record) {
    if(record){
      if (err){
        
        res.send(err);
      };
      var len=record.taxonRecordNameVersion.length;
      if(ver<=len && ver>0){
        res.json(record.taxonRecordNameVersion[ver-1]);
      }else{
        res.json({message: "The number of version is not valid"});
      }
    }else{
      res.json({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
    }
  });
};