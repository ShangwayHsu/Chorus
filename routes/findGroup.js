exports.view = function(req, res){
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // get the current user
  var currUser = req.session.user;
  var userId = currUser._id;
  var userName = currUser.name;
   res.render('findGroup', {
     "curr-user-id": userId,
     "curr-user-name": userName
   });
 };
