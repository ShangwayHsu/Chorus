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
  assignedTo:[{
    user_id:{
      type: Number,
      required: true
    }
  }],
  group_id: {
    type: Number,
    required: true
  }
});

var Chores = module.exports = mongoose.model('Chores', choresSchema);

// get chore
module.exports.getAllChores = function(callback) {
  Chores.find(callback);
}

// add chore
module.exports.addChore = function(chore, callback) {
  Chores.create(chore, callback);
}
