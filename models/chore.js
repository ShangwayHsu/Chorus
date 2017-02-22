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
    },
    name: {
      type: String
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

// get chore by id
module.exports.getChoreById = function(choreId, callback) {
  var currId = mongoose.Types.ObjectId(choreId);
  Chore.find({"_id": currId}, callback);
}

// add chore
module.exports.addChore = function(chore, callback) {
  // add chore to chore list
  Chore.create(chore, callback);

}

// delete chore
module.exports.deleteChore = function(choreId, callback) {
  var currId = mongoose.Types.ObjectId(choreId);
  Chore.find({"_id": currId}).remove(callback);
}
