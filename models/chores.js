var mongoose = require('mongoose');

// chores schema

var choresSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "No description..."
  },
  assignedTo:{
    type: Number,
    required: true
  }
});

var Chores = module.exports = mongoose.model('Chores', choresSchema);

// get chore
module.exports.getChores = function(callback) {
  Chores.find(callback);
}

// add chore
module.exports.addChore = function(chore, callback) {
  Chores.create(chore, callback);
}
