exports.view = function(req, res){
   res.render('viewChores', {
     'mychores' : [
       {
         'name': 'Clean Dishes',
         'assignedto': [
           {'name': "Sugath Madurawe"}
         ],
         description: 'Make sure to clean the sink when you are done!'
       },
       {
         'name': 'Vacuum Carpet',
         'assignedto': [
           {'name': "Jennifer Feng"}
         ],
         'description': 'Make sure to move the tables and chairs so that all areas are cleaned!'
       }
     ]
   });
 };
