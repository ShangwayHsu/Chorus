// Decalre models
var mongoose = require('mongoose');
Chore = require('../models/chore');
HousingGroup = require('../models/housingGroup');
User = require('../models/user');

exports.view = function(req, res){
  if (!req.session.user) {
    return res.status(401).send("No user logged in!");
  }

  var currUser = req.session.user;

  User.getCurrGroup(currUser._id, function(err, userGroup) {
    if (err) { throw err; }
    groupId = userGroup[0].in_groups[0].group_id;
    HousingGroup.getMembers(groupId, function(err, members) {
      if (err) {
        throw err;
      }

      members = members[0].members;
      console.log(members)
      // render page
      res.render('addChore', {
        'housemates': members,
        'groupId': groupId
      });
    });
  });
};
