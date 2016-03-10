var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;

var Reference = new Schema ({
	profile_id : String,
	group_id : String,
	created : {type: Date, default: Date.now},
	last_modified : {type: Date, default: Date.now},
	identifiers : [String],
	abstractText : String,
	tags : String,
	type : String,
	source : String,
	title : String,
	authors : [String],
	year : {type: Date, default: Date.now},
	volume : String,
	issue : String,
	pages : String,
	series : String,
	chapter : String,
	websites : String,
	accesed : String,
	publisher : String,
	city : String, 
	edition : String,
	institution : String,
	editors : [String],
	keywords : [String],
	doi : String,
	isbn : String,
	issn : String,
	link : String,
	recordId : String
},{ collection: 'Reference' });

var Agent = new Schema({
	firstName: String,
	lastName: String,
	organisation: String,
	position: String,
	address: String,
	city : String,
	state : String,
	country : String,
	postalCode : String,
	phone: String,
	email: String,
	homepage : String,
	personnelDirectory : String,
	personnelIdentifier : String,
	role: String
});

var AncillaryData = new Schema({
	//identifier : String,
	dataType : String,
	mimeType : String,
	agent: [Agent],
	created : {type: Date, default: Date.now},
	modified : {type: Date, default: Date.now},
	license : String,
	rights  : String,
	rigthsHolder : String,
	bibliographicCitation : String,
	audience: [String],
	source : String,
	subject : [String],
	description : String,
	mediaURL : [String],
	thumbnailURL : String,
	location : String,
	geoPoint : String,
	additionalInformation : String,
	dataObject: String,
	reference : [Reference]
},{ collection: 'ancillaryData' });

/*
var Element = new Schema ({
	ancillaryData : [{type: Schema.Types.ObjectId, ref: 'AncillaryData'}]
});
*/

var Element = new Schema ({
	ancillaryData : [AncillaryData]
});

var ElementVersion = new Schema ({
	id_record : { type: Schema.Types.ObjectId, ref: 'RecordVersion' },
	created : { type: Date, default: Date.now },
	id_user : String,
	version : { type: Number, min: 0 }
});

var RecordVersion = new Schema({
	language : String,
	moreInformationVersion : [{ type: Schema.Types.ObjectId, ref: 'MoreInformationVersion' }],
	associatedPartyVersion : [{ type: Schema.Types.ObjectId, ref: 'AssociatedPartyVersion' }],
	directThreatsVersion : [{ type: Schema.Types.ObjectId, ref: 'DirectThreatsVersion' }],
	baseElementsVersion : [{ type: Schema.Types.ObjectId, ref: 'BaseElementsVersion' }],
	taxonRecordNameVersion : [{ type: Schema.Types.ObjectId, ref: 'TaxonRecordNameVersion' }],
	synonymsAtomizedVersion : [{ type: Schema.Types.ObjectId, ref: 'SynonymsAtomizedVersion' }],
	commonNamesAtomizedVersion : [{ type: Schema.Types.ObjectId, ref: 'CommonNamesAtomizedVersion' }],
	hierarchyVersion : [{ type: Schema.Types.ObjectId, ref: 'HierarchyVersion' }],
	briefDescriptionVersion : [{ type: Schema.Types.ObjectId, ref: 'BriefDescriptionVersion' }],
	abstractVersion : [{ type: Schema.Types.ObjectId, ref: 'AbstractVersion' }],
	fullDescriptionVersion : [{ type: Schema.Types.ObjectId, ref: 'FullDescriptionVersion' }],
	identificationKeysVersion : [{ type: Schema.Types.ObjectId, ref: 'IdentificationKeysVersion' }],
	lifeFormVersion : [{ type: Schema.Types.ObjectId, ref: 'LifeFormVersion' }],
	lifeCycleVersion : [{ type: Schema.Types.ObjectId, ref: 'LifeCycleVersion' }],
	reproductionVersion : [{ type: Schema.Types.ObjectId, ref: 'ReproductionVersion' }],
	annualCyclesVersion : [{ type: Schema.Types.ObjectId, ref: 'AnnualCyclesVersion' }],
	molecularDataVersion : [{ type: Schema.Types.ObjectId, ref: 'MolecularDataVersion' }],
	migratoryVersion : [{ type: Schema.Types.ObjectId, ref: 'MigratoryVersion' }],
	ecologicalSignificanceVersion : [{ type: Schema.Types.ObjectId, ref: 'EcologicalSignificanceVersion' }],
	environmentalEnvelopeVersion : [{ type: Schema.Types.ObjectId, ref: 'EnvironmentalEnvelopeVersion' }],
	invasivenessVersion : [{ type: Schema.Types.ObjectId, ref: 'invasivenessVersion' }],
	feedingVersion : [{ type: Schema.Types.ObjectId, ref: 'FeedingVersion' }],
	dispersalVersion : [{ type: Schema.Types.ObjectId, ref: 'DispersalVersion' }],
	behaviorVersion : [{ type: Schema.Types.ObjectId, ref: 'BehaviorVersion' }],
	interactionsVersion : [{ type: Schema.Types.ObjectId, ref: 'InteractionsVersion' }],
	habitatsVersion : [{ type: Schema.Types.ObjectId, ref: 'HabitatsVersion' }],
	distributionVersion : [{ type: Schema.Types.ObjectId, ref: 'DistributionVersion' }],
	territoryVersion : [{ type: Schema.Types.ObjectId, ref: 'TerritoryVersion' }],
	populationBiologyVersion : [{ type: Schema.Types.ObjectId, ref: 'PopulationBiologyVersion' }],
	threatStatusVersion : [{ type: Schema.Types.ObjectId, ref: 'ThreatStatusVersion' }],
	legislationVersion : [{ type: Schema.Types.ObjectId, ref: 'LegislationVersion' }],
	usesManagementAndConservationVersion : [{ type: Schema.Types.ObjectId, ref: 'UsesManagementAndConservationVersion' }]
}, { collection: 'Records' });

var MeasurementOrFact = new Schema({
	measurementID : String,
	measurementType : String,
	measurementValue : String,
	measurementAccuracy : String,
	measurementUnit : String,
	measurementDetermineDate : String,
	measurementDetermineBy: [String],
	measurementMethod : String,
	measurementRemarks : String,
	realtedTo : String
},{ collection : 'measurementOrFact'});



//module.exports = mongoose.model('Element', Element);


module.exports = {
	             	Element : mongoose.model('Element', Element),
	             	ElementVersion : mongoose.model('ElementVersion', ElementVersion),
	             	AncillaryData: mongoose.model('AncillaryData', AncillaryData ),
	             	Agent: mongoose.model('Agent', Agent ),
	             	RecordVersion : mongoose.model('RecordVersion', RecordVersion ),
	             	Reference : mongoose.model('Reference', Reference ),
	             	MeasurementOrFact : mongoose.model('MeasurementOrFact', MeasurementOrFact)
	             };
	             