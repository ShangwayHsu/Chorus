//
// COGS 120 - CHORUS, a better way to manage chores
//

//----------- Module dependencies -----------
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.json());

// Decalre models
Chore = require('./models/chore');
HousingGroup = require('./models/housingGroup');
User = require('./models/user');

// Connect to mongoose
mongoose.connect('mongodb://localhost/chorus');
var db = mongoose.connetion;



//----------- View routes -----------
var index = require('./routes/index');
var addChore = require('./routes/addChore');
var viewChores = require('./routes/viewChores');
var choreDetails = require('./routes/choreDetails');
var switchGroups = require('./routes/switchGroups');
var editMembers = require('./routes/editMembers');
var editProfile = require('./routes/editProfile');
var login = require('./routes/login');


//----------- All environments -----------
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret:"ulfj39dk02ijgu3of", resave:false, saveUninitialized:true}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//----------- Development only -----------
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------- Add routes here -----------
app.get('/', index.view);
app.get('/add-chore', addChore.view);
app.get('/view-chores', viewChores.view);
app.get('/chore/:name', choreDetails.view);
app.get('/switch-groups', switchGroups.view);
app.get('/edit-members', editMembers.view);
app.get('/edit-profile', editProfile.view);
app.get('/login', login.view);

//-----------  API routes -----------
// GET chores
app.get('/api/test', function(req, res){
  var currUser = req.session.user;

  User.getCurrGroup(currUser._id, function(err, userGroup) {
    if (err) { throw err; }
    groupId = userGroup[0].in_groups[0].group_id;
    HousingGroup.getMembers(groupId, function(err, members) {
      if (err) {
        throw err;
      }
      members = members[0]
      console.log(members.members);

  });



    res.json(userGroup);
  });
});
// home page if user is here.
app.get('/dashboard', function(req, res) {
  if (!req.session.user) {
    return res.status(401).send("No user logged in!");
  }

  // get the current user
  var currUser = req.session.user;
  var userId = currUser['_id'];
  // get which group user in
  var currGroup =
  User.getCurrGroup(userId, function(err, userGroup) {
    if (err) { throw err; }
    currGroup = userGroup[0].in_groups[0].group_id;
    console.log(currGroup);

    HousingGroup.getGroupById(String(currGroup), function(err, group) {
      if (err) { throw err; }
      var allChoresList = group[0].chores;
      var uncompletedChoreList = [];
      var completedChoreList = [];

      for (var i = 0; i < allChoresList.length; i++) {
        if (allChoresList[i].completed) {
          completedChoreList.push(allChoresList[i]);
        } else {
          uncompletedChoreList.push(allChoresList[i]);
        }
      }
      console.log(allChoresList);
      console.log(completedChoreList);

      // render index with chore lists
      res.render('index', {
        'uncompleted-chores': uncompletedChoreList,
        'completed-chores': completedChoreList
      });
    });
  });

});

// login
app.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username, password: password}, function(err, user) {
    if (err) {

      console.log(err);
      return res.status(500).send();
    }

    if (!user) {
      return res.status(404).send("Incorrect user or password ");
    }

    // save user in session
    req.session.user = user;
    return res.status(200).send("Welcome " + user.name);
  })
});

// Register User
app.post('/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var email = req.body.email;

  var newuser = new User()
  newuser.username = username;
  newuser.password = password;
  newuser.name = name;
  newuser.email = email;

  // User mongoose save method to save to db
  newuser.save(function(err, savedUser) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  })
});

// GET chores
app.get('/api/chores/:id', function(req, res){

  var choreId = req.params.id 

  Chore.getChoreById(choreId, function(err, chore) {
    if (err) {
      throw err;
    }

    res.json(chore);
  });
});

// ADD chores
app.post('/api/chores', function(req, res){

  var chore = req.body;

  // add chore to chores
  Chore.addChore(chore, function(err, chore) {
    if (err) {
      throw err;
    }
    res.json(chore);
    var assignedToList = chore.assignedTo;

    // add chore to group
    HousingGroup.addChore(chore.id, chore.name, chore.group_id, function(err, group) {
      if (err) {throw err;}
    });

    // add chore to EACH user assigned to
    for (var i = 0; i < assignedToList.length; i++){
      var userId = assignedToList[i].user_id;

      User.addChore(chore.id, chore.name, userId, function(err, group) {
        if (err) {throw err;}
      });
    }

  });


});

// GET groups
app.get('/api/groups', function(req, res){
  HousingGroup.getAllGroups(function(err, groups) {
    if (err) {throw err;}
    res.json(groups);
  });
});

// ADD groups
app.post('/api/groups', function(req, res){
  var group = req.body;
  HousingGroup.addGroup(group, function(err, groups) {
    if (err) {
      throw err;
    }
    res.json(group);
  })
});


//----------- Serve -----------
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
