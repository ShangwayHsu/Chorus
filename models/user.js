var mongoose = require('mongoose');

// user schema

var userSchema = mongoose.Schema({
  username:{
    type: String,
    unique:true
  },
  password:{
    type: String
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  chores:[{
    chore_id: {
      type: String
    },
    chore_name: {
      type: String
    },
    group_id: {
      type: String
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  in_groups:[{
    group_id: {
      type: String
    },
    defaultGroup: {
      type: Boolean,
      default: false
    }
  }]
});

var User = module.exports = mongoose.model('User', userSchema);

// get user
module.exports.getAllUsers = function(callback) {
  User.find(callback);
}

// get default user group
module.exports.getCurrGroup = function(userId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.find({_id: currId}, {in_groups: {$elemMatch: {defaultGroup: true}}}, callback);
}

// get all chores of user
module.exports.getAllChoresByGroup = function(userId, groupId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.find({_id: currId}, callback);
}

// add user
module.exports.addUser = function(group, callback) {
  User.create(group, callback);
}

// add chore
module.exports.addChore = function(choreId, choreName, userId, groupId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  var newChore = {chore_id: choreId, chore_name: choreName, group_id: groupId};
  User.update({_id: currId}, {$push: {chores: newChore}},callback);
}

// update if chore completed/uncompleted
module.exports.updateChoreComplete = function(userId, choreId, completed, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId, 'chores.chore_id': choreId}, {$set: {"chores.$.completed": completed}}, callback);
}
