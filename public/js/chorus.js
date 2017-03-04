var okPressed = true;
$(document).ready(function() {
  $('#editResetCycle-btn').click(function(e) {
    var groupId = $('.currGroupId').text();
    $.get('/api/groups/group=' + groupId, function(group) {
      reset = group[0].reset;

      showResetCycle({
        groupId: groupId,
        reset: reset
      });
    })

  });

  $('#editNotification-btn').click(function(e) {
    var groupId = $('.currGroupId').text();
    var userId = $('.currUserId').text();
    showLoading();
    showEditNotification({
      title: 'Notifications Setting',
      userId: userId
    });
  })

  $('#editChores-btn').click(function(e) {
    var groupId = $('.currGroupId').text();
    var userId = $('.currUserId').text();
    showLoading();
    showEditChores({
      title: 'Edit Chores',
      groupId: groupId,
      userId: userId
    });
  });

  $("#create-group-btn").click(function(e) {
    var userId = $('.currUserId').text();
    var userName = $('.currUserName').text();

    showCreateGroup({
      title: "Create Group",
      userId: userId,
      userName: userName
    });
  });

  $("#join-group-btn").click(function(e) {
    var userId = $('.currUserId').text();
    var userName = $('.currUserName').text();
    console.log(userName);
    console.log('here');

    showJoinGroup({
      title: "Enter Group ID",
      userId: userId,
      userName: userName
    });
  });

  $("#my-group").click(function(e) {
    var userId = $('.currUserId').text();
    var groupId = $('.currGroupId').text();
    var groupName = $('.currGroupName').text();
    showLoading();
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

  $("#logout-group").click(function(e) {
    $.post('/logout');
    window.location.href = "/";
  });

  $("#logout").click(function(e) {
    $.post('/logout');
    window.location.href = "/";
  });
  var showChoreInfo = function(e) {
    var choreId = e.target.id;
    var groupId = $('.currGroupId').text();
    var completed = $(e.target).hasClass("choreComplete");
    $.get('/api/chores/chore=' + choreId, function(chore) {
      chore = chore[0]
      var choreName = chore.name;
      var description = chore.description;
      var assignedPeople = chore.assignedTo;

      showChore({
        title: choreName,
        text: description,
        people: assignedPeople,
        choreId: choreId,
        groupId: groupId,
        completed: completed
      })
    });

  }
  $('.show-info').click(function(e) {
    showChoreInfo(e);
  });

  $('#float-add-chore').click(function (e) {
    var groupId = $('.currGroupId').text();
    showLoading();
    showAddChore({groupId: groupId});
  })

  $('#show-my-chores').click(function (e) {
    // Curr user id stored in hidden div
    var userId = $('.currUserId').text();
    var groupId = $('.currGroupId').text();
    showLoading();
    $.get('/api/users/allchores/user=' + userId + '&group=' + groupId, function(data) {
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
      showFormError(
        {
          title: "Error",
          text: err.responseText
        }

      );
      console.log(err.responseText);
    });
  }

  $("#login-btn").click(function(e) {
    login();
  });

  $('#password').keypress(function (e) {
    var key = e.which;
    if(key == 13 &&  okPressed)  // the enter key code
    {
      okPressed = false;
      login();
      return false;
    }
  });
  $("#register-btn").click(function(e) {
    var name = $('#r-fullName').val();
    var username = $('#r-username').val();
    var password = $('#r-password').val();
    var email = $('#r-email').val();
    if (name == "") {
      showFormError({title: "Error", text: "Please enter a name"});
      return;
    } else if (username == "") {
      showFormError({title: "Error", text: "Please enter an username."});
      return;
    } else if (password == "") {
      showFormError({title: "Error", text: "Please enter a password."});
      return;
    } else if (email == "") {
      showFormError({title: "Error", text: "Please enter an email."});
      return;
    }
    $.post('/register', {
      name: name,
      username: username,
      password: password,
      email: email
    }, function(data) {
      console.log("Successfully created user!");
      showSuccess({title: "Success!", text: "You have successfully signed up!"});

    }).fail(function(err) {
      showFormError({title: "Error", text: "Username already exists!"});
      console.log("Username already exists!");
    });


  });

  $('#username').keypress(function (e) {
    var key = e.which;
    if(key == 13 & okPressed)  // the enter key code
    {
      okPressed = false;
      login();
      return false;
    }
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
  componentHandler.upgradeDom();
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
  componentHandler.upgradeDom();
  // remove from group
  $('#join-btn').click(function(e) {
    // get groupId from input
    var groupId = $('#groupId').val();
    console.log(groupId);
    // get group name
    $.get('/api/groups/group=' + groupId, function(group) {

      var groupName = group[0].name;

      //add group to user
      groupName = groupName.replace(' ', '+')
      $.ajax({url: '/api/users/user=' + options.userId + '&group=' + groupId + '&groupName=' + groupName,
      type: 'POST'});

      //add user to group
      var userName = options.userName.replace(" ", "+")
      $.ajax({url: '/api/groups/group=' + groupId +'&user=' + options.userId + '&userName=' + userName,
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
  hideLoading();
  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal

  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);
  $('<h3 class="modal-title">' + options.title + '</h3>').appendTo(content);
  $("<div class='details-card mdl-shadow--2dp'><h3 style='margin-bottom:5px;'>" + options.groupName +
    "</h3><p style='font-size:12px;'>Give group ID to users who want to join your group</>" +
    "<h6 style='font-weight:bold;'>Group ID: " + options.groupId +"</h6></div>").appendTo(content);
  var detailsContent = dialog.find('.details-card');
  // members in group
  $('<p style="text-align:left; padding-left: 15px; padding-bottom:0px; margin-bottom:0px;">' + "Group Members:" + '</p>').appendTo(detailsContent);
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
  $('<p style="font-size:10px; text-align:center; padding-bottom:0px; margin-bottom;0px;">*Leaving the group will remove you from chores and reset chore to uncomplete</p>').appendTo(content);
  $('#cancel').click(function(e) {
    hideDialog(dialog);
  });
  function deleteChoreLeave(groupId, choreId, assignedTo) {

    // delete chores from group
    $.ajax({url: '/api/groups/group=' + groupId + '&chore=' + choreId,
    type: 'DELETE'});

    // delete chores from chores
    $.ajax({url: '/api/chores/chore=' + choreId,
    type: 'DELETE'});

    // delete chores from users
    for (var x = 0; x < assignedTo.length; x++) {
      $.ajax({url: '/api/users/delete-chore/user=' + assignedTo[x].user_id + '&chore=' + choreId,
      type: 'DELETE'});
    }
  }
  // remove from group
  $('#leave-btn').click(function(e) {
    $.get('/api/users/user=' + options.userId, function(user) {
      user = user[0];
      var userChores = user.chores;

      // loop through all chores and update without curr user
      for (var i = 0; i < userChores.length; i++ ) {
        var choreId = userChores[i].chore_id;

        // get curr chore
        $.get('/api/chores/chore=' + choreId, function(chore) {
          chore = chore[0];
          if (chore == null) {
            return;
          }
          var newAssignedTo = [];
          var currAssignedTo = chore.assignedTo;
          var choreName = chore.name;
          var choreDescription = chore.description;
          var choreGroup = chore.group_id;
          deleteChoreLeave(chore.group_id, chore._id, chore.assignedTo);
          for (var j = 0; j < currAssignedTo.length; j++) {
            var currPerson = currAssignedTo[j];
            if (currPerson.user_id != options.userId){
              newAssignedTo.push(currPerson);
            }
          }

          var updatedChore = {
            name: choreName,
            description: choreDescription,
            group_id: choreGroup,
            assignedTo: newAssignedTo
          };
          $.post('/api/chores', updatedChore);

        });

      }
      $.ajax({url: '/api/users/user=' + options.userId,
      type: 'DELETE'});
      //remove from group
      $.ajax({url: '/api/groups/group=' + options.groupId +'&user=' + options.userId,
      type: 'DELETE'});

    }).done(function(){setTimeout(showSuccess({title: "Success!", text: "You have left the group."}),10000);});

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
//  show loadgin
//
function showLoading() {
  // remove existing loaders
  $('.loading-container').remove();
  $('<div id="orrsLoader" class="loading-container"><div><div class="mdl-spinner mdl-js-spinner is-active"></div></div></div>').appendTo("body");

  componentHandler.upgradeElements($('.mdl-spinner').get());
  setTimeout(function () {
    $('#orrsLoader').css({opacity: 1});
  }, 1);
}
//
// hide loading
//
function hideLoading() {
  $('#orrsLoader').css({opacity: 0});
  setTimeout(function () {
    $('#orrsLoader').remove();
  }, 400);
}
//
// show chores
//
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
  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);
//<p style="display: inline; font-size:15px; line-height: 2.1em;">Options</p>
  // menu
  $(`   <div class="mdl-color-text--grey-600"style="float:right; padding: 0px;margin0px; text-align:right;">
        <button id="demo-menu-lower-right"
        class="mdl-button mdl-js-button mdl-button--icon" style="float:right; padding: 0px;margin0px;">
        <i id="menu-btn" class="material-icons" style="float:right;padding: 0px;margin:0px;">edit</i>
        </button>

        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
        for="demo-menu-lower-right">
        <li id="m-edit" class="mdl-menu__item">Edit Chore</li>
        <li id="m-delete" class="mdl-menu__item">Delete Chore</li>

        </ul></div>`).appendTo(content);
  if (options.title != null) {
    $('<h3 style="padding-bottom: 5px; margin-top: 5px;">' + options.title + '</h3>').appendTo(content);
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
  if (!options.completed) {
    var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
    var bruhButton = $('<button class="bruh-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--red-600 mdl-color-text--white" id="bruhButton">' + "Send Notification" + '</button>');
    bruhButton.appendTo(buttonBar);
    buttonBar.appendTo(content);
    $('<h6 style="font-size:10px; text-align:center; margin-bottom:0px;">Press the notification button to notify assigned group members to do this chore.</h6>').appendTo(content);

  }


  // send notification
  $('#bruhButton').click(function(e) {
    if ($('#bruhButton').text() == "Send Notification") {
      $('#bruhButton').removeClass('mdl-color--red-600').addClass('mdl-color--blue-400');
      $('#bruhButton').text("Click To Confirm");
    } else {
      // send notification
      showLoading();
      for (var i = 0; i < options.people.length; i++) {
        var currId = options.people[i].user_id;
        $.get('/api/users/user=' + currId, function(data) {
          var emailAddress = data[0].email;
          var emailOptions = {choreName: options.title, email: emailAddress};

          //send email
          $.post('/bruhh', emailOptions, function(data) {
            console.log('Email sent!');
            hideLoading();
            $('#bruhButton').removeClass('mdl-color--blue-400').addClass('mdl-color--green-500');
            $('#bruhButton').text("Notification Sent!");
            $('#bruhButton').prop("disabled", true);
          });
        });
      }
    }

  });

  $('#cancel').click(function(e) {
    hideDialog(dialog);
  });
  $('#m-edit').click(function(e) {

    showEditSingleChore({choreId: options.choreId, groupId: options.groupId});
  });
  $('#m-delete').click(function(e) {
    showConfirmDelete({choreId: options.choreId, groupId: options.groupId});
  });

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
//
// Show my chores
//
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
  hideLoading();
  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);
  $('<h3 class="modal-title" style="margin-bottom: 5px;">' + "My Chores" + '</h3>').appendTo(content);
  $('<h6 style="text-align:center;">' + "Check off chores to mark them as complete" + '</6>').appendTo(content);

  if (options.chores != null) {
    var myChores = '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp chore-entry"><thead><tr class="mdl-color--green-500 mdl-color-text--white "><td><h5 class="todo-table-title">Todo</h5></td></tr></thead>';
    myChores += '<tbody>';
    var choreCount = 0;
    for (var i = 0; i < options.chores.length; i++) {
      if (options.chores[i].group_id !== options.groupId) {
        continue;
      }
      choreCount += 1;
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

    if (choreCount == 0) {
      myChores += '<tr>';
      myChores +='<td class="mdl-data-table__cell--non-numeric">' + 'No Chores' +'</td>';
      myChores += '</tr>';
    }
    myChores += '</tbody>';
    $(myChores).appendTo(content);
  }

  $('#cancel').click(function(e) {
    hideDialog(dialog);
  });

  $('.chore-check').click(function(e) {
    console.log(options.chores);
    var choreId = e.target.id;
    var checked = e.target.checked;
    var groupId = options.groupId;
    var userId = options.userId;

    showLoading();
    var groupsUri = "/api/groups/group=" + groupId + "&chore=" + choreId;
    // PUT to groups: jquery doesnt have $.put method
    $.ajax({url: groupsUri,
      type: 'PUT',
      data: JSON.stringify({'completed': checked}),
      contentType: 'application/json'
    });

    // get all users who are assinged to this chore
    $.get('/api/chores/chore=' + choreId, function(chore) {
      var assignedPeople = chore[0].assignedTo;

      for (var i = 0; i < assignedPeople.length; i++) {
        var currUserId = assignedPeople[i].user_id;
        var usersUri = "/api/users/user=" + currUserId + "&chore=" + choreId;

        // PUT to users: jquery doesnt have $.put method
        $.ajax({url: usersUri,
          type: 'PUT',
          data: JSON.stringify({'completed': checked}),
          contentType: 'application/json'
        });
      }

      hideLoading();
    });


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

//
// form error
//
function showFormError(options) {
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

  $('<div id="' + options.id + 'error" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id + "error");
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal
  if (options.title != null) {
    $('<h3>' + options.title + '</h3>').appendTo(content);
  }

  $('<p>' + options.text + '</p>').appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');

  var okButton = $('<button id="error-done" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Ok" + '</button>');

  okButton.appendTo(buttonBar);
  buttonBar.appendTo(content);
  $("#error-done").click(function(e) {
    okPressed = true;
    hideDialog(dialog);
  });
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
//
// confirm delete-chore
//
function showConfirmDelete(options) {
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

  $('<div id="' + options.id + '2" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id + '2');
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal

  $('<h5>' + "Are you sure you want to delete?" + '</h5>').appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');

  var yesButton = $('<button id="c-delete" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color--red-600 mdl-color-text--white">' + "Delete" + '</button>');
  var noButton = $('<button id="c-cancel" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Cancel" + '</button>');

  yesButton.appendTo(buttonBar);
  noButton.appendTo(buttonBar);
  buttonBar.appendTo(content);
  function yesDeleteChore(choreId, groupId) {

    $.get('/api/chores/chore=' + choreId, function(chore) {
      chore = chore[0]

      var assignedTo = chore.assignedTo;
    // delete chores from group
    $.ajax({url: '/api/groups/group=' + groupId + '&chore=' + choreId,
    type: 'DELETE'});

    // delete chores from chores
    $.ajax({url: '/api/chores/chore=' + choreId,
    type: 'DELETE'});

    // delete chores from users
    for (var x = 0; x < assignedTo.length; x++) {
      $.ajax({url: '/api/users/delete-chore/user=' + assignedTo[x].user_id + '&chore=' + choreId,
      type: 'DELETE'});
    }
  });
  }


  $("#c-cancel").click(function(e) {
    hideDialog(dialog);
  });

  $("#c-delete").click(function(e) {
    yesDeleteChore(options.choreId, options.groupId);
    hideDialog(dialog);
    location.reload(true);
    window.location.href = "/";
  });
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

//
// form showSuccess
//
function showSuccess(options) {
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

  $('<p>' + options.text + '</p>').appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');

  var okButton = $('<button id="error-done" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Ok" + '</button>');

  okButton.appendTo(buttonBar);
  buttonBar.appendTo(content);
  $("#error-done").click(function(e) {
    window.location.href = "/";
    hideDialog(dialog);
  });
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

//
// edit chores
//
function showEditChores(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    text: null,
    groupId: null,
    userId: null,
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

  $('<div class="x-btn"><span type=button id="cancel" class="material-icons mdl-icon mdl-color-text--white" style="float: right;">clear</span></div>').prependTo(dialog);
  if (options.title != null) {
    $('<h3>' + options.title + '</h3>').appendTo(content);
  }

  // get chores
  $.get('/api/groups/group=' + options.groupId, function(group) {
    hideLoading();
    var chores = group[0].chores;

    // display list of chores
    var choreList = `
    <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp chore-entry">
    <thead>
    <tr>
    <th class="mdl-data-table__cell--non-numeric">Chores</th>
    </tr>
    </thead>
    <tbody>`;

    for (var i = 0; i < chores.length; i++) {
      choreList += `
      <tr class="e-chore">
      <td id=` +  chores[i].chore_id + ` class="mdl-data-table__cell--non-numeric">` + chores[i].chore_name + `</td>
      </tr>
      `;
    }

    choreList += '</tbody> </table>';
    $(choreList).appendTo(content);
    var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
    var okButton = $('<button id="error-done" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Cancel" + '</button>');

    okButton.appendTo(buttonBar);
    buttonBar.appendTo(content);

    $("#error-done").click(function(e) {
      hideDialog(dialog);
    });

    $('.e-chore').click(function(e) {
      var choreId = e.target.id;
      showLoading();
      showEditSingleChore({choreId: choreId, groupId: options.groupId});
    });

  });
  componentHandler.upgradeDom();
  $('#cancel').click(function(e) {
    hideDialog(dialog);
  });
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

//
// edit single chore
//
function showEditSingleChore(options) {
  options = $.extend({
    id: 'orrsDiag',
    choreId: null,
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
  $('<div id="' + options.id + '" class="dialog-container"><div class="long-modal mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);
  // get chore

  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);
  $.get('/api/chores/chore=' + options.choreId, function(chore) {
    chore = chore[0]
    var choreName = chore.name;
    var description = chore.description;
    var assignedTo = chore.assignedTo;

    // Putting content to modal
    $('<h3>Edit</h3>').appendTo(content);
    $('<h6>Name:</h6>').appendTo(content);
    $(`
      <form action="#">
      <div class="mdl-textfield mdl-js-textfield">
      <input class="mdl-textfield__input" type="text" id="e-name" value="` + choreName +`"></input>
      </div>
      </form>
      `).appendTo(content);

      //get members
      $.get('/api/groups/members/group=' + options.groupId, function(groupMembers) {
        hideLoading();
        $('<h6>Assigned To:</h6>').appendTo(content);

        groupMembers = groupMembers[0].members;

        var myChores = '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp chore-entry"><thead><tr class="mdl-color--green-500 mdl-color-text--white "><td><h5 class="todo-table-title">Members</h5></td></tr></thead>';
        myChores += '<tbody>';
        var choreCount = 0;
        for (var i = 0; i < groupMembers.length; i++) {

          choreCount += 1;
          var memberName = groupMembers[i].name;
          var memberId = groupMembers[i].user_id;

          // check if member is assigned to chore
          var checked = "";
          for (var j = 0; j < assignedTo.length; j++) {
            if (memberId == assignedTo[j].user_id) {
              checked = "checked";
            }
          }

          myChores += '<tr>';
          var checkboxes = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="'+ memberId +' "> <input type="checkbox" id="' + memberId + '" class="chore-check mdl-checkbox__input new-checked"' +  checked + '> <span id="e-memberName' + memberId + '" class="mdl-checkbox__label chore-check">'+ memberName +'</span> </label>';
          myChores +='<td class="mdl-data-table__cell--non-numeric">' + checkboxes +'</td>';
          myChores += '</tr>';
        }
        $(myChores).appendTo(content);

        $('<h6>Description:</h6>').appendTo(content);
        $(`
          <form action="#">
          <div class="mdl-textfield mdl-js-textfield">
          <textarea class="mdl-textfield__input" type="text" rows= "4" id="e-description">` + description + `</textarea>
          </div>
          </form>
          `).appendTo(content);

          // cancel save delete buttons
          var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
          var saveButton = $('<button id="e-save" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--green-500 mdl-color-text--white">' + "Save Changes" + '</button>');

          $('<p>*Note: Saving will reset chore to completed</p>').appendTo(content);
          saveButton.appendTo(buttonBar);
          buttonBar.appendTo(content);

          function deleteChore() {
            // delete chores from group
            $.ajax({url: '/api/groups/group=' + options.groupId + '&chore=' + options.choreId,
            type: 'DELETE'});

            // delete chores from chores
            $.ajax({url: '/api/chores/chore=' + options.choreId,
            type: 'DELETE'});

            // delete chores from users
            for (var x = 0; x < assignedTo.length; x++) {
              $.ajax({url: '/api/users/delete-chore/user=' + assignedTo[x].user_id + '&chore=' + options.choreId,
              type: 'DELETE'});
            }
          }

          $('#e-save').click(function(e) {
            // basically delete that chore and put a new one
            //showLoading();
            //check which check boxes have been set for assignedTo
            var newAssignedTo = [];
            $(".new-checked").each(function(index) {
              if($(this).is(':checked')) {
                var currMemName = $('#e-memberName' + $(this).attr('id')).text();
                newAssignedTo.push({user_id: $(this).attr('id'), name: currMemName});
              }
            })
            var url = "/api/chores";
            var newChoreName = $('#e-name').val();
            var newChoreDescription = $('#e-description').val();

            var data = { "name" : newChoreName,
            "description" : newChoreDescription,
            "assignedTo" : newAssignedTo,
            "group_id": options.groupId };
            $.post(url, data, function(err) {
              deleteChore();
              //hideLoading();
              window.location.href = "/";
            });



          });

          $('#e-cancel').click(function(e) {
            window.location.href = "/";
          });

          $('#e-delete').click(function(e) {
            showConfirmDelete({choreId: options.choreId, groupId: options.groupId});

          });

        });
      });

      componentHandler.upgradeDom();
      $('#cancel').click(function(e) {
        hideDialog(dialog);
      });
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


    function showEditNotification(options) {
      options = $.extend({
        id: 'orrsDiag',
        title: null,
        text: null,
        userId: null,
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
      $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);
      if (options.title != null) {
        $('<h3>' + options.title + '</h3>').appendTo(content);
      }

      $('<h6>Send Notifications To:</h6>').appendTo(content);

      $.get('/api/users/user=' + options.userId, function(user) {
        hideLoading();
        user = user[0];
        $(`
          <form action="#">
          <div class="mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="text" id="n-email" value="` + user.email +`"></input>
          <label class="mdl-textfield__label" for="n-email">Email...</label>
          </div>
          </form>
          `).appendTo(content);
          var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
          var saveButton = $('<button id="n-save" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--green-500 mdl-color-text--white">' + "Save" + '</button>');
          var cancelButton = $('<button id="n-cancel" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Cancel" + '</button>');

          saveButton.appendTo(buttonBar);
          cancelButton.appendTo(buttonBar);
          buttonBar.appendTo(content);
          componentHandler.upgradeDom();
          $("#n-cancel").click(function(e) {
            hideDialog(dialog);
          });

          $('#n-save').click(function(e) {
            var email = $('#n-email').val();
            $.ajax({url: '/api/users/email/user=' + options.userId + '&email=' + email,
            type: 'PUT'}, function(e) {
              console.log("Email Saved");
            });
            window.location.href = "/";

          });
        });
        $('#cancel').click(function(e) {
          hideDialog(dialog);
        });
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

//
// add chore
//
function showAddChore(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    text: null,
    groupId: null,
    userId: null,
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

  $('<div id="' + options.id + '" class="dialog-container"><div class="long-modal mdl-card mdl-shadow--16dp" style="padding-right: 60px; padding-left: 60px;" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);

  // Putting content to modal

  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);

  $('<h3>' + "Add New Chore" + '</h3>').appendTo(content);

  $(`
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label chore-entry" style="width: 100%;">
      <input class="mdl-textfield__input" type="text" id="chore-name"/>
      <label class="mdl-textfield__label" for="chore-name">Chore Name</label>
    </div>`).appendTo(content);
  $('<h6>' + "Assigned To:" + '</h6>').appendTo(content);
  // get members
  $.get('/api/groups/members/group=' + options.groupId, function(members) {
    hideLoading();
    groupMembers = members[0].members;

    var membersList = '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp chore-entry"><thead><tr class="mdl-color--green-500 mdl-color-text--white "><td><h5 class="todo-table-title">Members</h5></td></tr></thead>';
    membersList += '<tbody>';
    var memberCount = 0;
    for (var i = 0; i < groupMembers.length; i++) {

      memberCount += 1;
      var memberName = groupMembers[i].name;
      var memberId = groupMembers[i].user_id;

      var checked = "";

      membersList += '<tr>';
      var checkboxes = '<label class="" for="'+ memberId +' "> <input type="checkbox" id="' + memberId + '" class="chore-check mdl-checkbox__input new-checked"' +  checked + '> <span id="e-memberName' + memberId + '" class="mdl-checkbox__label chore-check">'+ memberName +'</span> </label>';
      membersList +='<td class="mdl-data-table__cell--non-numeric">' + checkboxes +'</td>';
      membersList += '</tr>';
    }
    $(membersList).appendTo(content);
  $(`
  <div class="mdl-textfield mdl-js-textfield chore-entry" style="width: 100%;">
    <textarea class="mdl-textfield__input" type="text" rows= "5" id="chore-description" ></textarea>
    <label class="mdl-textfield__label" for="chore-description">Description...</label>
  </div>`).appendTo(content);

  var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
  var saveButton = $('<button id="saveChore-btn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color--green-500 mdl-color-text--white">' + "Save" + '</button>');

  saveButton.appendTo(buttonBar);
  buttonBar.appendTo(content);

  $('#saveChore-btn').click(function (e) {
    var choreDescription = $('#chore-description').val();
    var choreName = $('#chore-name').val();
    var newAssignedTo = [];


    $(".new-checked").each(function(index) {
      if($(this).is(':checked')) {
        var currMemName = $('#e-memberName' + $(this).attr('id')).text();
        newAssignedTo.push({user_id: $(this).attr('id'), name: currMemName});
      }
    });
      if (newAssignedTo.length == 0) {
        showFormError({title: "Error", text: "Please assign chore to group member."});
        return;
      }
      else if (choreName == "") {
        showFormError({title: "Error", text: "Please enter chore name."});
        return;
      } else if (choreDescription == "") {
        showFormError({title: "Error", text: "Please enter a description."});
        return;
      }

    var url = "/api/chores";
    var data = { "name" : choreName,
                 "description" : choreDescription,
                 "assignedTo" : newAssignedTo,
                 "group_id": options.groupId };
    showLoading();
    $.post(url, data, function(e) {
      hideLoading();
      location.reload(true);
    });

  });

  componentHandler.upgradeDom();
  });
  componentHandler.upgradeDom();

  $('#cancel').click(function(e) {
    hideDialog(dialog);
  });
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

function showResetCycle(options) {
  options = $.extend({
    id: 'orrsDiag',
    title: null,
    text: null,
    userId: null,
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
  $('<button class="x2-btn mdl-button mdl-js-button mdl-button--fab"><i id="cancel" class="material-icons mdl-icon mdl-color-text--grey-700">clear</i></button>').appendTo(dialog);

  // see which option is selected
  var weekly = '';
  var biweekly = '';

  if (options.reset == "weekly") {

      weekly = "checked";
  } else {
    biweekly = "checked";
  }

  $('<h3>Reset Cycle Settings</h3>').appendTo(content);
  $('<p style="font-size: 12px;">The reset cycle puts all chores back to uncompleted on Sunday 12:00am.  Set whether your group prefers a weekly or biweekly setting</p>').appendTo(content);
  $(`
    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-1">
      <input type="radio" id="option-1" class="mdl-radio__button" name="options" value="1" ` + weekly +`>
      <span class="mdl-radio__label">Weekly</span>
    </label>
    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-2">
      <input type="radio" id="option-2" class="mdl-radio__button" name="options" value="1" ` + biweekly +`>
      <span class="mdl-radio__label">Biweekly</span>
    </label>
    `).appendTo(content);
    var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
    var saveButton = $('<button id="n-save" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--green-500 mdl-color-text--white">' + "Save" + '</button>');
    var cancelButton = $('<button id="n-cancel" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Cancel" + '</button>');

    saveButton.appendTo(buttonBar);
    cancelButton.appendTo(buttonBar);
    buttonBar.appendTo(content);
    componentHandler.upgradeDom();

    $('#n-save').click(function(e) {
      if ($('#option-1').is(':checked')) {
        $.post('/api/groups/reset/group=' + options.groupId + '&reset=' + 'weekly', function(data) {
          //console.log(data);
          hideDialog(dialog);
        })
      } else {
        $.post('/api/groups/reset/group=' + options.groupId + '&reset=' + 'biweekly', function(data) {
          //console.log(data);
          hideDialog(dialog);
        })
      }


    })
    $("#n-cancel").click(function(e) {
      hideDialog(dialog);
    });

    $('#cancel').click(function(e) {
      hideDialog(dialog);
    });
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
