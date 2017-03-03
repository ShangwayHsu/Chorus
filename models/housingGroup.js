var mongoose = require('mongoose');

// groups schema

var groupsSchema = mongoose.Schema({

  name:{
    type: String,
    required: true
  },
  members:[{
    user_id: {
      type: String
    },
    name: {
      type: String
    }
  }],
  chores:[{
    chore_id: {
      type: String
    },
    chore_name: {
      type: String
    },
    completed: {
      type: Boolean,
      default: false
    },
    short_names: [{
      short_name: {
        type: String
      }
    }]
  }],
  reset: {
    type: String,
    default: '1'
  }

});

var HousingGroup = module.exports = mongoose.model('HousingGroup', groupsSchema);
// reset all chores to false of curr group
module.exports.resetChoreComplete= function(groupId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.update({"_id": currId, "chores.completed": true}, {$set: {"chores.$.completed": false}}, callback);
}
// get all groups
module.exports.getAllGroups= function(callback) {
  HousingGroup.find(callback);
}

// get groups
module.exports.getGroupById= function(groupId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.find({"_id": currId}, callback);
}

// get members
module.exports.getMembers = function(groupId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.find({"_id": currId}, {members: 1}, callback);
}

// delete members
module.exports.deleteMember = function(groupId, userId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.findOneAndUpdate({"_id": currId}, {$pull:{members: {user_id: userId}}}, callback);
}

// add chore to group
module.exports.addChore = function(choreId, choreName, groupId, members, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  var shorts = [];
  for (var i = 0; i < members.length; i++){
    var name = members[i].name.split(' ');

    shorts.push({short_name: name[0].substring(0,1).toUpperCase() + name[1].substring(0,1).toUpperCase()});
  }
  console.log(shorts);
  var newChore = {chore_id: choreId, chore_name: choreName, completed: false, short_names: shorts};
  HousingGroup.update({_id: currId}, {$push: {chores: newChore}},callback);
}

// add Member to group
module.exports.addMember = function(groupId, userId, userName, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  var newMember = {user_id: userId, name: userName};
  HousingGroup.update({_id: currId}, {$push: {members: newMember}},callback);
}

// add group
module.exports.addGroup = function(group, callback) {
  HousingGroup.create(group, callback);
}

// update if chore completed/uncompleted
module.exports.updateChoreComplete = function(groupId, choreId, completed, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.update({"_id": currId, 'chores.chore_id': choreId}, {$set: {"chores.$.completed": completed}}, callback);
}

// "delete" chore from group
module.exports.deleteChore = function(groupId, choreId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.update({"_id": currId}, {$pull: {chores:{"chore_id": choreId}}}, callback);
}

// update reset value
module.exports.updateReset = function(groupId, resetVal, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  HousingGroup.update({"_id": currId}, {$set: {"reset": resetVal}}, callback);
}
