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
var nodemailer = require('nodemailer');
//var router = express.Router();
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
var register = require('./routes/register');
var findGroup = require('./routes/findGroup');

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
app.get('/register', register.view);
app.get('/findGroup', findGroup.view);

//----------- Email route -----------
app.post('/bruhh', sendBruhNotification);
function sendBruhNotification(req, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'chorus.reminder@gmail.com', // email id
            pass: 'welovesugath' // password
        }
    });

    var emailBody = 'This is a reminder to do your chore: ' + req.body.choreName + '\n\n-- Chorus';
    var mailOptions = {
        from: 'chorus.reminder.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Chore Reminder!', // Subject line
        text: emailBody
    };
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
}


//-----------  API routes -----------
// GET chores
app.get('/api/test', function(req, res){
  var currUser = req.session.user;

  User.getCurrGroup(currUser._id, function(err, userGroup) {
    if (err) { throw err; }
    groupId = userGroup[0].in_group.group_id;
    HousingGroup.getMembers(groupId, function(err, members) {
      if (err) {
        throw err;
      }
      members = members[0]
      //console.log(members.members);

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
});

// Home page
app.get('/dashboard', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // get the current user
  var currUser = req.session.user;
  var userId = currUser._id;

  // get which group user in

  User.getCurrGroup(userId, function(err, userGroup) {
    if (err) { throw err; }
    // get curent group id
    var groupId = userGroup[0].in_group.group_id;

    if (typeof groupId == 'undefined' || groupId == "") {
      return res.redirect('/findGroup');
      return;
    }
    HousingGroup.getGroupById(groupId, function(err, group) {
      if (err) { throw err; }

      var allChoresList = group[0].chores;
      var groupName = group[0].name;
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
        'curr-group-id': groupId,
        'curr-group-name': groupName
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

// GET members in group
app.get('/api/groups/members/group=:groupId', function(req, res){
  var groupId = req.params.groupId 
  HousingGroup.getMembers(groupId, function(err, members) {
    if (err) {throw err;}
    res.json(members);
  });
});

// GET user by id
app.get('/api/users/user=:id', function(req, res){
  var userId = req.params.id 
  User.getUserById(userId, function(err, user) {
    if (err) {
      throw err;
    }
    res.json(user);
  });
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

// GET groups
app.get('/api/groups/group=:groupId', function(req, res){
  var groupId = req.params.groupId;

  HousingGroup.getGroupById(groupId, function(err, groups) {
    if (err) {throw err;}
    res.json(groups);
  });
});

// Add groups
app.post('/api/groups', function(req, res){
  var group = req.body;
  HousingGroup.addGroup(function(err, groups) {
    if (err) {throw err;}
    res.json(groups);
  });
});

// POST new member to group
app.post('/api/groups/group=:groupId&user=:userId&userName=:userName', function(req, res){
  var groupId = req.params.groupId;
  var userId = req.params.userId;
  var userName = req.params.userName;
  console.log(userName);
  userName = userName.replace('+', ' ');
  console.log("wrong ehre");
  HousingGroup.addMember(groupId, userId, userName, function(err, groups) {
    if (err) { throw err; }
    res.json(groups);
  })
});

// POST groups
app.post('/api/groups/new', function(req, res){
  var group = req.body;
  console.log("here");
  HousingGroup.addGroup(group, function(err, groups) {
    if (err) { throw err; }
    res.json(groups);
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

// PUT new email
app.put('/api/users/email/user=:userId&email=:email', function(req, res) {
  var userId = req.params.userId;
  var email = req.params.email;

  User.updateEmail(userId, email, function(err, user) {
    if (err) { throw err; }
    res.json(user);
  });
});


// delete group from user
app.delete('/api/users/user=:userId', function(req, res) {
  var userId = req.params.userId;
  User.deleteGroup(userId, function(err, user) {
    if (err) { throw err; }
    res.json(user);
  });
});

// add group to user
app.post('/api/users/user=:userId&group=:groupId&groupName=:groupName', function(req, res) {
  var userId = req.params.userId;
  var groupId = req.params.groupId;
  var groupName = req.params.groupName;
  groupName = groupName.replace('+', ' ');
  User.addGroup(userId, groupId, groupName, function(err, user) {
    if (err) { throw err; }
    res.json(user);
  });
});

// delete user from group
app.delete('/api/groups/group=:groupId&user=:userId', function(req, res) {
  var userId = req.params.userId;
  var groupId = req.params.groupId;
  HousingGroup.deleteMember(groupId, userId, function(err, user) {
    if (err) { throw err; }
    res.json(user);
  });
});

// delete chore from chores
app.delete('/api/chores/chore=:choreId', function(req, res) {
  var choreId = req.params.choreId;
  Chore.deleteChore(choreId, function(err, chore) {
    if (err) {throw err;}
    res.json(chore);
  });
});

// delete chore from group
app.delete('/api/groups/group=:groupId&chore=:choreId', function(req, res) {
  var choreId = req.params.choreId;
  var groupId = req.params.groupId;
  HousingGroup.deleteChore(groupId, choreId, function(err, chore) {
    if (err) {throw err;}
    res.json(chore);
  });
});

// delete chore from user
app.delete('/api/users/delete-chore/user=:userId&chore=:choreId', function(req, res) {
  var choreId = req.params.choreId;
  var userId = req.params.userId;
  User.deleteChore(userId, choreId, function(err, chore) {
    if (err) {throw err;}
    res.json(chore);
  });
});


//----------- Serve -----------
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
