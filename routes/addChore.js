exports.view = function(req, res){
   res.render('addChore', {
     'housemates': [
       {'name': 'Jennifer Feng'},
       {'name': 'Shangway Hsu'},
       {'name': 'Sugath Madurawe'}
     ]
   });
 };
