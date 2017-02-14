var mongoose = require('mongoose');

// groups schema

var groupsSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  members:[{
    user_id: {
      type: Number
    }
  }],
  chores:[{
    chore_id: {
      type: Number
    }
  }]
});

var Groups = module.exports = mongoose.model('Groups', groupsSchema);

// get chore
module.exports.getAllGroups= function(callback) {
  Groups.find(callback);
}

// add chore
module.exports.addGroup = function(group, callback) {
  Groups.create(group, callback);
}
