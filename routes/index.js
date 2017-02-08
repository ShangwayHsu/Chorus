exports.view = function(req, res){
   res.render('index', {
     'incompleted-chores': [
       {'name': 'Clean Kitchen'},
       {'name': 'Clean Dishes'},
       {'name': 'Vacuum Carpet'},
       {'name': 'Take Out Trash'}
     ],
     'completed-chores': [
       {'name': 'Buy Toiletry'},
       {'name': 'Refill Soap'},
       {'name': 'Sweep Floor'}
     ]
   });
 };
