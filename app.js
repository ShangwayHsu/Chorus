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
var mongoose = require('mongoose');
app.use(bodyParser.json());

// Decalre models
Chores = require('./models/chores');
Groups = require('./models/groups');
Users = require('./models/users');

// Connect to mongoose
mongoose.connect('mongodb://localhost/chorus');
var db = mongoose.connetion;

//-----------  API routes -----------

// GET chores
app.get('/api/chores', function(req, res){
  Chores.getAllChores(function(err, chores) {
    if (err) {
      throw err;
    }
    res.json(chores);
  });
});

// ADD chores
app.post('/api/chores', function(req, res){
  var chore = req.body;
  Chores.addChore(chore, function(err, chores) {
    if (err) {
      throw err;
    }
    res.json(chore);
  })
});

// GET groups
app.get('/api/groups', function(req, res){
  Groups.getAllGroups(function(err, groups) {
    if (err) {
      throw err;
    }
    res.json(groups);
  });
});

// ADD groups
app.post('/api/groups', function(req, res){
  var group = req.body;
  Groups.addGroup(group, function(err, groups) {
    if (err) {
      throw err;
    }
    res.json(group);
  })
});

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
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
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

//----------- Serve -----------
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
