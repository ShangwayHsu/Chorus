$(document).ready(function() {

  $('#editChores-btn').click(function(e) {
    var groupId = $('.currGroupId').text();
    var userId = $('.currUserId').text();
    showEditChores({
      title: 'Edit Chores',
      groupId: groupId,
      userId: userId
    });
  })

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
    var userId = $('.currUserId').text();
    var groupId = $('.currGroupId').text();

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

  $("#login-btn").click(function(e) {
    login();
  });

  $('#password').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
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
      console.log("Username already exists!");
    });


  });

  $('#username').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
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

  // send notification
  $('#bruhButton').click(function(e) {

    for (var i = 0; i < options.people.length; i++) {
      var currId = options.people[i].user_id;
      $.get('/api/users/user=' + currId, function(data) {
        var emailAddress = data[0].email;
        var emailOptions = {choreName: options.title, email: emailAddress};

        //send email
        $.post('/bruhh', emailOptions, function(data) {
          console.log('Email sent!');
        });
      });
    }
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

  $('<h3 class="modal-title">' + "My Chores" + '</h3>').appendTo(content);

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
      contentType: 'application/json'
    });

    // PUT to users: jquery doesnt have $.put method
    $.ajax({url: usersUri,
      type: 'PUT',
      data: JSON.stringify({'completed': checked}),
      contentType: 'application/json'
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
  if (options.title != null) {
    $('<h3>' + options.title + '</h3>').appendTo(content);
  }

  // get chores
  $.get('/api/groups/group=' + options.groupId, function(group) {
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
      window.location.href = "/";
    });

    $('.e-chore').click(function(e) {
      var choreId = e.target.id;
      showEditSingleChore({choreId: choreId, groupId: options.groupId});
    });

  });
  componentHandler.upgradeDom();
  if (options.cancelable) {
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
  $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
  var dialog = $('#' + options.id);
  var content = dialog.find('.mdl-card');
  if (options.contentStyle != null) content.css(options.contentStyle);
  // get chore
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
          var buttonBar2 = $('<div class="mdl-card__actions dialog-button-bar"></div>');
          var cancelButton = $('<button id="e-cancel" class="mdl-button mdl-js-button mdl-js-ripple-effect">' + "Cancel" + '</button>');
          var saveButton = $('<button id="e-save" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--green-500 mdl-color-text--white">' + "Save Changes" + '</button>');
          var deleteButton = $('<button id="e-delete" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--red-500 mdl-color-text--white">' + "Delete Chore" + '</button>');

          $('<p>*Note: Saving will reset chore to completed</p>').appendTo(content);
          saveButton.appendTo(buttonBar);
          cancelButton.appendTo(buttonBar);
          buttonBar.appendTo(content);
          deleteButton.appendTo(buttonBar2);
          $('<br>').appendTo(content);
          buttonBar2.appendTo(content);

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
            $.post(url, data);

            deleteChore();
            window.location.href = "/";

          });

          $('#e-cancel').click(function(e) {
            window.location.href = "/";
          });

          $('#e-delete').click(function(e) {
            deleteChore();
            window.location.href = "/";
          });

        });
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
