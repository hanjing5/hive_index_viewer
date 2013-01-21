var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {safe:false});
var hive_index = new mongodb.Db('hive_index', server, {});


/*
 * POST serach results.
 */

exports.results = function(req, res){
  //console.log(req);
  var params = req.body;
  hive_index.open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'processed_table');
    collection.find({merged_structure: {"$regex": params.search}}).toArray(function (err, docs){
      console.log(docs);
      res.render('results', {query:params.search, results: docs});
    });
  });
  //res.send("respond with a resource");
};
