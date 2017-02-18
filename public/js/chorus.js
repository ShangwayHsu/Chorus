$(document).ready(function() {
  $("#create-group-btn").click(function(e) {
    var userId = $('.currUserId').attr('id');
    var userName = $('.currUserName').attr('id');

    showCreateGroup({
      title: "Create Group",
      userId: userId,
      userName: userName
    });
  });

  $("#join-group-btn").click(function(e) {
    var userId = $('.currUserId').attr('id');
    var userName = $('.currUserName').attr('id');

    showJoinGroup({
      title: "Enter Group ID",
      userId: userId,
      userName: userName
    });
  });

  $("#my-group").click(function(e) {
    var userId = $('.currUserId').attr('id');
    var groupId = $('.currGroupId').attr('id');
    var groupName = $('.currGroupName').attr('id');

    $.get('/api/groups/group=' + groupId, function(group) {
      var groupMembers = group[0].members;
      showMyGroup({
        title: "Group Details",
        groupName: groupName,
        groupId: groupId,
        userId: userId,
        people: groupMembers
      });
    })

  });


  $("#logout").click(function(e) {
    $.post('/logout');
    window.location.href = "/";
  });

  $('.show-info').click(function (e) {
    var choreId = e.target.id;
    $.get('/api/chores/chore=' + choreId, function(chore) {
      chore = chore[0]
      var choreName = chore.name;
      var description = chore.description;
      var assignedPeople = chore.assignedTo;
      showChore({
        title: choreName,
        text: description,
        people: assignedPeople
      })
    });

  });

  $('#show-my-chores').click(function (e) {
    // Curr user id stored in hidden div
    var userId = $('.currUserId').attr('id');
    var groupId = $('.currGroupId').attr('id');
    $.get('/api/chores/user=' + userId + '&group=' + groupId, function(data) {
      var chores = data[0].chores;
      showMyChores({
        chores: chores,
        groupId: groupId,
        userId: userId
      });
    });
  });

  function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    $.post('/login', {username: username, password: password}, function(data, err) {
      console.log(data);
      window.location.href = "/dashboard";
    })
    .fail(function(err) {
      console.log(err.responseText);
    });
  }

  $(document).keypress(function(e) {
    if(e.which == 13) {
      login();
    }
  });

  $("#login-btn").click(function(e) {
    login();
  });

});
//
// MDL modal js
//

//
// Create group
//
function showCreateGroup(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    userId: null,
    userName: null,
    cancelable: true,
    contentStyle: null,
    onLoaded: false,
    hideOther: true
  }, options);

  if (options.hideOther) {
    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");
  }

  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal
  $('<h3 class="modal-title">' + options.title + '</h3>').appendTo(content);
  $('<form action="#"> <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> <input class="mdl-textfield__input" type="text" id="groupName"> <label class="mdl-textfield__label" for="groupName">Group Name</label> </div> </form>').appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
  var createButton = $('<a id="create-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-button--raised mdl-color--green-400 mdl-color-text--white" style="margin:10px;">' + "Create" + '</a>');
  var cancelButton = $('<a id="cancel-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised" style="margin:10px;">' + "Cancel" + '</a>');
  createButton.appendTo(buttonBar);
  cancelButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  // remove from group
  $('#create-btn').click(function(e) {
    // get group name
    var groupName = $('#groupName').val();
    console.log(groupName);
    // create group
    $.post('/api/groups/new', {
      name: groupName,
      members: [{user_id: options.userId, name: options.userName}]
    }, function(group) {
      console.log(group);
      var groupId = group._id;
      //add group to user
      var uri = '/api/users/user=' + options.userId + '&group=' + groupId + '&groupName=' + groupName;
      $.post(uri, function(data) {
        console.log("Added group to user");
        // go to dashboard
        window.location.href = "/";
      });

    });

  });

  $('#cancel-btn').click(function(e) {
    hideDialog(dialog);
  });

  dialog.click(function () {
    hideDialog(dialog);
  });
  $(document).bind("keyup.dialog", function (e) {
    if (e.which == 27)
    hideDialog(dialog);
  });
  content.click(function (e) {
    e.stopPropagation();
  });
  setTimeout(function () {
    dialog.css({opacity: 1});
    if (options.onLoaded)
    options.onLoaded();
  }, 1);
}

//
// Join Group
//
function showJoinGroup(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    userId: null,
    userName: null,
    cancelable: true,
    contentStyle: null,
    onLoaded: false,
    hideOther: true
  }, options);

  if (options.hideOther) {
    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");
  }

  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal
  $('<h3 class="modal-title">' + options.title + '</h3>').appendTo(content);
  $('<form action="#"> <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> <input class="mdl-textfield__input" type="text" id="groupId"> <label class="mdl-textfield__label" for="groupID">Group ID</label> </div> </form>').appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
  var joinButton = $('<a id="join-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-button--raised mdl-color--blue-400 mdl-color-text--white" style="margin:10px;">' + "Join" + '</a>');
  var cancelButton = $('<a id="cancel-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised" style="margin:10px;">' + "Cancel" + '</a>');
  joinButton.appendTo(buttonBar);
  cancelButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  // remove from group
  $('#join-btn').click(function(e) {
    // get groupId from input
    var groupId = $('#groupId').val();
    console.log(groupId);
    // get group name
    $.get('/api/groups/group=' + groupId, function(group) {

      var groupName = group[0].name;

      //add group to user
      $.ajax({url: '/api/users/user=' + options.userId + '&group=' + groupId + '&groupName=' + groupName,
      type: 'POST'});

      //add user to group
      $.ajax({url: '/api/groups/group=' + groupId +'&user=' + options.userId + '&userName=' + options.userName,
      type: 'POST'});

      // go to dashboard
      window.location.href = "/";
    }).fail(function() {console.log("Invalid Group ID");});

  });

  $('#cancel-btn').click(function(e) {
    hideDialog(dialog);
  });

  dialog.click(function () {
    hideDialog(dialog);
  });
  $(document).bind("keyup.dialog", function (e) {
    if (e.which == 27)
    hideDialog(dialog);
  });
  content.click(function (e) {
    e.stopPropagation();
  });
  setTimeout(function () {
    dialog.css({opacity: 1});
    if (options.onLoaded)
    options.onLoaded();
  }, 1);
}

//
// Show my group
//
function showMyGroup(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    groupName: null,
    groupId: null,
    userId: null,
    people: null,
    cancelable: true,
    contentStyle: null,
    onLoaded: false,
    hideOther: true
  }, options);

  if (options.hideOther) {
    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");
  }

  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal

  $('<h3 class="modal-title">' + options.title + '</h3>').appendTo(content);
  $("<div class='details-card mdl-shadow--2dp'><h4>" + options.groupName +"</h4><h6>Group ID: " + options.groupId +"</h6></div>").appendTo(content);
  var detailsContent = dialog.find('.details-card');
  // members in group
  $('<p>' + "Group Members:" + '</p>').appendTo(detailsContent);
  var members = '<div class="assigned-people">';
  for (var i = 0; i < options.people.length; i++) {
    members += '<div class="assigned-person mdl-chip"><span class="mdl-chip__text">' + options.people[i].name + '</span></div>';
  }
  members += '</div>';
  $(members).appendTo(detailsContent);
  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
  var leaveButton = $('<a id="leave-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-button--raised mdl-color--red-500 mdl-color-text--white">' + "Leave Group" + '</a>');
  leaveButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  // remove from group
  $('#leave-btn').click(function(e) {
    //remove group from user
    $.ajax({url: '/api/users/user=' + options.userId,
    type: 'DELETE'});
    //remove from group
    $.ajax({url: '/api/groups/group=' + options.groupId +'&user=' + options.userId,
    type: 'DELETE'});
    window.location.href = "/";
  });


  dialog.click(function () {
    window.location.href = "/";
  });
  $(document).bind("keyup.dialog", function (e) {
    if (e.which == 27)
    window.location.href = "/";
  });
  content.click(function (e) {
    e.stopPropagation();
  });
  setTimeout(function () {
    dialog.css({opacity: 1});
    if (options.onLoaded)
    options.onLoaded();
  }, 1);
}

function showLoading() {
  // remove existing loaders
  $('.loading-container').remove();
  $('<div id="orrsLoader" class="loading-container"><div><div class="mdl-spinner mdl-js-spinner is-active"></div></div></div>').appendTo("body");

  componentHandler.upgradeElements($('.mdl-spinner').get());
  setTimeout(function () {
    $('#orrsLoader').css({opacity: 1});
  }, 1);
}

function hideLoading() {
  $('#orrsLoader').css({opacity: 0});
  setTimeout(function () {
    $('#orrsLoader').remove();
  }, 400);
}

function showChore(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    text: null,
    people: null,
    cancelable: true,
    contentStyle: null,
    onLoaded: false,
    hideOther: true
  }, options);

  if (options.hideOther) {
    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");
  }

  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal
  if (options.title != null) {
    $('<h3>' + options.title + '</h3>').appendTo(content);
  }
  if (options.people != null) {
    $('<p>' + "Assigned To:" + '</p>').appendTo(content);
    var assignedPeople = '<div class="assigned-people">';
    for (var i = 0; i < options.people.length; i++) {
      assignedPeople += '<div class="assigned-person mdl-chip"><span class="mdl-chip__text">' + options.people[i].name + '</span></div>';
    }
    assignedPeople += '</div>';
    $(assignedPeople).appendTo(content);
  }
  if (options.text != null) {
    $('<p>' + "Description:" + '</p>').appendTo(content);
    $('<p>' + options.text + '</p>').appendTo(content);
  }
  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');

  var bruhButton = $('<button class="bruh-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--red-600 mdl-color-text--white" id="bruhButton">' + "Bruhh" + '</button>');

  bruhButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  componentHandler.upgradeDom();
  if (options.cancelable) {
    dialog.click(function () {
      hideDialog(dialog);
    });
    $(document).bind("keyup.dialog", function (e) {
      if (e.which == 27)
      hideDialog(dialog);
    });
    content.click(function (e) {
      e.stopPropagation();
    });
  }
  setTimeout(function () {
    dialog.css({opacity: 1});
    if (options.onLoaded)
    options.onLoaded();
  }, 1);
}

function showMyChores(options, groupId) {
  options = $.extend({
    id: 'orrsDiag',
    chores: null,
    groupId: null,
    cancelable: true,
    contentStyle: null,
    onLoaded: false,
    hideOther: true
  }, options);

  if (options.hideOther) {
    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");
  }

  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal

  $('<h3 class="modal-title">' + "My Chores" + '</h3>').appendTo(content);

  if (options.chores != null) {
    var myChores = '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp chore-entry"><thead><tr class="mdl-color--green-500 mdl-color-text--white "><td><h5 class="todo-table-title">Todo</h5></td></tr></thead>';
    myChores += '<tbody>';
    for (var i = 0; i < options.chores.length; i++) {
      var currChore = options.chores[i].chore_id;
      var isChecked = options.chores[i].completed;
      var checked = "";
      var choreName = options.chores[i].chore_name;
      if (isChecked) {
        checked = "checked";
      }
      myChores += '<tr>';
      var checkboxes = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="'+ currChore +' "> <input type="checkbox" id="' + currChore + '" class="chore-check mdl-checkbox__input"' +  checked + '> <span class="mdl-checkbox__label chore-check">'+ choreName +'</span> </label>';
      myChores +='<td class="mdl-data-table__cell--non-numeric">' + checkboxes +'</td>';
      myChores += '</tr>';
    }
    myChores += '</tbody>';
    $(myChores).appendTo(content);
  }

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
  var doneButton = $('<a class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-button--raised mdl-color--green-500 mdl-color-text--white" id="my-chores-done">' + "Done" + '</a>');

  doneButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  $('#my-chores-done').click(function(e) {
    hideDialog(dialog);
  });

  $('.chore-check').click(function(e) {
    var choreId = e.target.id;
    var checked = e.target.checked;
    var groupId = options.groupId;
    var userId = options.userId;
    var groupsUri = "/api/groups/group=" + groupId + "&chore=" + choreId;
    var usersUri = "/api/users/user=" + userId + "&chore=" + choreId;

    // PUT to groups: jquery doesnt have $.put method
    $.ajax({url: groupsUri,
      type: 'PUT',
      data: JSON.stringify({'completed': checked}),
      contentType: 'application/json'});

      // PUT to users: jquery doesnt have $.put method
      $.ajax({url: usersUri,
        type: 'PUT',
        data: JSON.stringify({'completed': checked}),
        contentType: 'application/json'});

      });
      $('#my-chores-done').click(function(e) {
        window.location.href = "/";
      });
      dialog.click(function () {
        window.location.href = "/";
      });
      $(document).bind("keyup.dialog", function (e) {
        if (e.which == 27)
        window.location.href = "/";
      });
      content.click(function (e) {
        e.stopPropagation();
      });
      setTimeout(function () {
        dialog.css({opacity: 1});
        if (options.onLoaded)
        options.onLoaded();
      }, 1);
    }

    function hideDialog(dialog) {
      $(document).unbind("keyup.dialog");
      dialog.css({opacity: 0});
      setTimeout(function () {
        dialog.remove();
      }, 400);
    }
