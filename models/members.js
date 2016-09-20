mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app_db');

var Schema = mongoose.Schema;

// create a schema
var membersSchema = new Schema({
  // Schema
  name: {type: String, required: true, unique: true}, 
  email: {type: String, required: true, index: {unique: true}},
  company: {type: String },
  workPhone: {type: String },
  mobile: {type: String },
  
});

var Members = mongoose.model('Members', membersSchema);
// make this available to our users in our Node applications
module.exports = Members;
