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
    }
  }]

});

var HousingGroup = module.exports = mongoose.model('HousingGroup', groupsSchema);

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

// add chore to group
module.exports.addChore = function(choreId, choreName, groupId, callback) {
  var currId = mongoose.Types.ObjectId(groupId);
  console.log(groupId);
  var newChore = {chore_id: choreId, chore_name: choreName, completed: false};
  HousingGroup.update({_id: currId}, {$push: {chores: newChore}},callback);
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
