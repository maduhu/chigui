var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var EnvironmentalEnvelopeVersion = new Schema({
	record : { type: Schema.Types.ObjectId, ref: 'RecordVersion' },
	created : {type: Date, default: Date.now},
	id_user : String,
	version : { type: Number, min: 0 },
	environmentalEnvelope : {type: Schema.Types.ObjectId, ref: 'EnvironmentalEnvelope'}
},{ collection: 'EnvironmentalEnvelopeVersion' });

var environmentalEnvelopeAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact
});

var environmentalEnvelope = Element.extend({
	environmentalEnvelopeAtomized : [environmentalEnvelopeAtomized],
	environmentalEnvelopeUnstructured : String,
	id_version : { type: Schema.Types.ObjectId, ref: 'EnvironmentalEnvelopeVersion' }
},{collection: 'EnvironmentalEnvelope'});

module.exports = {
	             	EnvironmentalEnvelopeVersion: mongoose.model('EnvironmentalEnvelopeVersion', EnvironmentalEnvelopeVersion ),
	             	EnvironmentalEnvelope: mongoose.model('EnvironmentalEnvelope', EnvironmentalEnvelope )
	             };