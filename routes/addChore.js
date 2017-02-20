// Decalre models
var mongoose = require('mongoose');
Chore = require('../models/chore');
HousingGroup = require('../models/housingGroup');
User = require('../models/user');

exports.view = function(req, res){
  if (!req.session.user) {
    return res.redirect('/login')
  }

  var currUser = req.session.user;
  var userId = currUser._id;
  User.getCurrGroup(currUser._id, function(err, userGroup) {
    if (err) { throw err; }
    console.log(userGroup);
    var groupId = userGroup[0].in_group.group_id;
    var groupName = userGroup[0].in_group.group_name;
    HousingGroup.getMembers(groupId, function(err, members) {
      if (err) {
        throw err;
      }
      members = members[0].members;

      // render page
      res.render('addChore', {
        'housemates': members,
        'groupId': groupId,
        'curr-user-id': userId,
        'curr-group-id': groupId,
        'curr-group-name': groupName
      });
    });
  });
};
