exports.view = function(req, res){
  var name = req.params.name; 

  res.render('choreDetails', {
    'choreName': name
  });
};
