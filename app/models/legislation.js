var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;

var LegislationAtomized = Element.extend({
	legislationName : String,
	protectionLegalStatus : String,
	legislationRead : String,
	status : String,
	type : String,
	norm : String,
	appliesTo : {
		country : String,
		stateProvince : String,
		county : String,
		municipality : String,
		locality : String
	}
});

var Legislation = Element.extend({
	legislationAtomized : [LegislationAtomized],
	legislationUnstructured : String
},{collection: 'legislation'});

var LegislationVersion = ElementVersion.extend({
	legislation : Legislation
},{ collection: 'LegislationVersion' });

module.exports = mongoose.model('LegislationVersion', LegislationVersion );