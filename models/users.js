var mongoose = require('mongoose');

// users schema

var usersSchema = mongoose.Schema({
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
      type: Number
    }
  }]
});

var Users = module.exports = mongoose.model('Users', usersSchema);

// get chore
module.exports.getAllUsers= function(callback) {
  Users.find(callback);
}

// add chore
module.exports.addUser = function(group, callback) {
  Users.create(group, callback);
}
