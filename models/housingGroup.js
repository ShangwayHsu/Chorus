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
  }]
});

var HousingGroup = module.exports = mongoose.model('HousingGroup', groupsSchema);

// get chore
module.exports.getAllGroups= function(callback) {
  HousingGroup.find(callback);
}

// add chore
module.exports.addGroup = function(group, callback) {
  HousingGroup.create(group, callback);
}
