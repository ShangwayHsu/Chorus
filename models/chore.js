var mongoose = require('mongoose');

// chores schema

var choreSchema = mongoose.Schema({
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
      type: String,
      required: true
    }
  }],
  group_id: {
    type: String,
    required: true
  }
});

var Chore = module.exports = mongoose.model('Chore', choreSchema);

// get chore
module.exports.getAllChores = function(callback) {
  Chore.find(callback);
}

// add chore
module.exports.addChore = function(chore, callback) {
  Chore.create(chore, callback);
}
