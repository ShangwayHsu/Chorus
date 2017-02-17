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
var dbURI = 'mongodb://chorus:welovesugath@ds161495.mlab.com:61495/chorus'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("Connected to MLab!"); });
db.on('connecting', function () {
  console.info('MongoDB: Trying: ' + dbURI); });
db.on('connected', function () {
  console.info('MongoDB: Successfully connected to: ' + dbURI); });
db.on('error',function (err) {
  console.error('MongoDB: ERROR connecting to: ' + dbURI + ' - ' + err); });
db.on('close',function (err) {
  console.error('MongoDB: Connection Closed'); });
db.on('reconnected', function () {
  console.warn('MongoDB: Database link was reconnected'); });
db.on('disconnected', function () {
  console.error('MongoDB: The connection was ended on: ' + dbURI ); });
mongoose.connect(dbURI);

//----------- View routes -----------
var addChore = require('./routes/addChore');
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
app.get('/add-chore', addChore.view);
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

app.get('/', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/login')
  } else {
    res.redirect('/dashboard')
  }
})

// Home page
app.get('/dashboard', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/login')
  }

  // get the current user
  var currUser = req.session.user;
  var userId = currUser._id;

  // get which group user in
  var currGroup =
  User.getCurrGroup(userId, function(err, userGroup) {
    if (err) { throw err; }
    // get curent group id
    groupId = userGroup[0].in_groups[0].group_id;

    HousingGroup.getGroupById(groupId, function(err, group) {
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

      // render index with chore lists
      res.render('index', {
        'uncompleted-chores': uncompletedChoreList,
        'completed-chores': completedChoreList,
        'curr-user-id': userId,
        'curr-group-id': groupId

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

// logout
app.post('/logout', function(req, res) {
  req.session.destroy();
  console.log("logging out");
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

// GET all chores of user
app.get('/api/chores/user=:userId&group=:groupId', function(req, res){
  var userId = req.params.userId;
  var groupId = req.params.groupId;

  User.getAllChoresByGroup(userId, groupId, function(err, chores) {
    if (err) {
      throw err;
    }
    res.json(chores);
  });
});

// GET chores
app.get('/api/chores/chore=:id', function(req, res){
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
    var groupId = chore.group_id;

    // add chore to group
    HousingGroup.addChore(chore.id, chore.name, groupId, function(err, group) {
      if (err) {throw err;}
    });

    // add chore to EACH user assigned to
    for (var i = 0; i < assignedToList.length; i++){
      var userId = assignedToList[i].user_id;

      User.addChore(chore.id, chore.name, userId, groupId, function(err, group) {
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

// POST groups
app.post('/api/groups', function(req, res){
  var group = req.body;
  HousingGroup.addGroup(group, function(err, groups) {
    if (err) { throw err; }
    res.json(group);
  })
});

// PUT chore completed
app.put('/api/groups/group=:groupId&chore=:choreId', function(req, res) {
  var choreId = req.params.choreId;
  var groupId = req.params.groupId;
  var completed = req.body.completed;

  HousingGroup.updateChoreComplete(groupId, choreId, completed, function(err, group) {
    if (err) { throw err; }
    res.json(group);
  });
});

// PUT chore completed
app.put('/api/users/user=:userId&chore=:choreId', function(req, res) {
  var choreId = req.params.choreId;
  var userId = req.params.userId;
  var completed = req.body.completed;

  User.updateChoreComplete(userId, choreId, completed, function(err, user) {
    if (err) { throw err; }
    res.json(user);
  });
});
//----------- Serve -----------
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
