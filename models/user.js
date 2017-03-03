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
  in_group:{
    group_id: {
      type: String,
      default: ""
    },
    group_name: {
      type: String,
      default: ""
    }
  }
});

var User = module.exports = mongoose.model('User', userSchema);
// reset chore completion
module.exports.resetChoreComplete = function(userId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId, 'chores.completed': true}, {$set: {"chores.$.completed": false}}, callback);
}
// get user
module.exports.getAllUsers = function(callback) {
  User.find(callback);
}

// get user by id
module.exports.getUserById = function(userId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.find({"_id": currId}, callback);
}

// get default user group
module.exports.getCurrGroup = function(userId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.find({_id: currId}, callback);
}

// get all chores of user
module.exports.getAllChoresByGroup = function(userId, groupId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.find({_id: currId}, callback);
}

// "delete" currGroup
module.exports.deleteGroup = function(userId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId}, {$unset: {"in_group": 1}}, callback);
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

// update group
module.exports.addGroup = function(userId, groupId, groupName, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId}, {$set: {"in_group": {group_name: groupName, group_id: groupId}}}, callback);
}

// update email
module.exports.updateEmail = function(userId, email, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId}, {$set: {"email": email}}, callback);
}

// "delete" chore from user
module.exports.deleteChore = function(userId, choreId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId}, {$pull: {chores:{"chore_id": choreId}}}, callback);
}

// "delete" chore from user with groupId
module.exports.deleteChoreByGroup = function(userId, groupId, callback) {
  var currId = mongoose.Types.ObjectId(userId);
  User.update({"_id": currId}, {$pull: {chores:{"group_id": groupId}}}, callback);
}
