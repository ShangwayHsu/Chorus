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
    }
  }],
  in_groups:[{
    group_id: {
      type: String
    }
  }]
});

var User = module.exports = mongoose.model('User', userSchema);

// get user
module.exports.getAllUsers= function(callback) {
  User.find(callback);
}

// add user
module.exports.addUser = function(group, callback) {
  User.create(group, callback);
}
