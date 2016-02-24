var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var LifeFormAtomized = new Schema ({
	measurementOrFact : MeasurementOrFact,
	ancillaryData : AncillaryData
},{ strict: false, versionKey: false });

var LifeForm = Element.extend({
	lifeFormAtomized : LifeFormAtomized,
	lifeFormUnstructured : String
},{ strict: false, versionKey: false });

var LifeFormVersion = new ElementVersion.extend({
	lifeForm : LifeForm
},{ collection: 'LifeFormVersion', versionKey: false });

module.exports = mongoose.model('LifeFormVersion', LifeFormVersion );