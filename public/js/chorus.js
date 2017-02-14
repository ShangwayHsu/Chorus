//
// MDL modal js
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
          assignedPeople += '<div class="assigned-person mdl-chip"><span class="mdl-chip__text">' + options.people[i] + '</span></div>';
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

function showMyChores(options) {
    options = $.extend({
        id: 'orrsDiag',
        chores: null,
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
          myChores += '<tr>';
          var checkboxes = '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-'+ i +' "> <input type="checkbox" id="checkbox-' + i + '" class="mdl-checkbox__input"> <span class="mdl-checkbox__label chore-check">'+ options.chores[i] +'</span> </label>';
          myChores +='<td class="mdl-data-table__cell--non-numeric">' + checkboxes +'</td>';
          myChores += '</tr>';
        }
        myChores += '</tbody>';
        $(myChores).appendTo(content);
    }


    var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');

    var doneButton = $('<button class="bruh-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored mdl-color--green-500 mdl-color-text--white" id="my-chores-done">' + "Done" + '</button>');

    doneButton.appendTo(buttonBar);
    buttonBar.appendTo(content);

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

function hideDialog(dialog) {
    $(document).unbind("keyup.dialog");
    dialog.css({opacity: 0});
    setTimeout(function () {
        dialog.remove();
    }, 400);
}
