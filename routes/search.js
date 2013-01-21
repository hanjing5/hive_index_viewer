var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {safe:false});

var hive_index = new mongodb.Db('hive_index', server, {});
var collection = new mongodb.Collection(client, 'processed_table');

/*
 * POST serach results.
 */

exports.results = function(req, res){
  //console.log(req);
  var params = req.body;
  hive_index.open(function (error, client) {
    if (error) throw error;
    collection.find({merged_structure: {"$regex": params.search}}).toArray(function (err, docs){
      console.log(docs);
      res.render('results', {query:params.search, results: docs});
    });
  });
  //res.send("respond with a resource");
};

    var client = new Db('test', new Server("127.0.0.1", 27017, {}), {w: 1}),
        test = function (err, collection) {
          collection.insert({a:2}, function(err, docs) {

            collection.count(function(err, count) {
              test.assertEquals(1, count);
            });

            // Locate all the entries using find
            collection.find().toArray(function(err, results) {
              test.assertEquals(1, results.length);
              test.assertTrue(results[0].a === 2);

              // Let's close the db
              client.close();
            });
          });
        };

    client.open(function(err, p_client) {
      client.collection('test_insert', test);
    });
