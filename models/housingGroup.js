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
    }
  }],
  chores:[{
    chore_id: {
      type: String
    }
  }],
  uncompletedChores:[{
    chore_id: {
      type: String
    },
    chore_name: {
      type: String
    }
  }],
  completedChores:[{
    chore_id: {
      type: String
    },
    chore_name: {
      type: String
    }
  }],

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

// add group
module.exports.addGroup = function(group, callback) {
  HousingGroup.create(group, callback);
}
