var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

IndexProvider = function(host, port) {
  this.db= new Db('hive_index', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


IndexProvider.prototype.getCollection= function(callback) {
  this.db.collection('merged_processed_table', function(error, index_collection) {
    if( error ) callback(error);
    else callback(null, index_collection);
  });
};


IndexProvider.prototype.getStats= function(callback) {
  this.db.collection('stats_table', function(error, stats_collection) {
    if( error ) callback(error);
    else callback(null, stats_collection);
  });
};

IndexProvider.prototype.findAllStats = function(callback) {
    this.getStats(function(error, index_collection) {
      if( error ) callback(error)
      else {
        console.log(index_collection);
        index_collection.findOne(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


IndexProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, index_collection) {
      if( error ) callback(error)
      else {
        index_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

IndexProvider.prototype.findByStructure = function(id, callback) {
  console.log("query: " +id);
  this.getCollection(function(error, index_collection) {
    if( error ) callback(error)
    else {
      index_collection.find({merged_structure: {"$regex":id}}).toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

IndexProvider.prototype.findByStructurePagination = function(query, from, to, callback) {
  console.log("query: " +query + " From " + from + " To " + to);
  this.getCollection(function(error, index_collection) {
    if( error ) callback(error)
    else {
      var queries = query.split(" ")
      var final_query = []
      for (var i = 0 ; i < queries.length; i++) {
        final_query.push( {merged_structure: {"$regex": queries[i]}})
      }
      if (queries.length == 1) {
        index_collection.find({merged_structure: {"$regex":query}}).sort().skip(from).limit(to).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      } else{
        console.log("split queries: " + queries)
        console.log("final_query:" + final_query)

        index_collection.find({$and: final_query}).sort().skip(from).limit(to).toArray(function(error, results) {
          console.log(queries)
          if( error ) callback(error)
          else callback(null, results)
        });
      }

    }
  });
};

IndexProvider.prototype.view = function(callback) {
    this.getStats(function(error, index_collection) {
      if( error ) callback(error)
      else {
        index_collection.update({"stats":true}, {$inc:{views:1}});
      }
    });
};

//IndexProvider.prototype.findById = function(id, callback) {
//    this.getCollection(function(error, index_collection) {
//      if( error ) callback(error)
//      else {
//        index_collection.findOne({_id: index_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
//          if( error ) callback(error)
//          else callback(null, result)
//        });
//      }
//    });
//};

//IndexProvider.prototype.viewed = function(page, callback){
//  this.getStats(function(error, stats_collection) {
//        if( error ) callback(error)
//        else {
//          stats_collection.insert(page, function() {
//            callback(null, page);
//          });
//        }
//      });
//};

//IndexProvider.prototype.save = function(articles, callback) {
//    this.getCollection(function(error, index_collection) {
//      if( error ) callback(error)
//      else {
//        if( typeof(articles.length)=="undefined")
//          articles = [articles];
//
//        for( var i =0;i< articles.length;i++ ) {
//          article = articles[i];
//          article.created_at = new Date();
//          if( article.comments === undefined ) article.comments = [];
//          for(var j =0;j< article.comments.length; j++) {
//            article.comments[j].created_at = new Date();
//          }
//        }
//
//        index_collection.insert(articles, function() {
//          callback(null, articles);
//        });
//      }
//    });
//};

console.log("this is the serverice Provider");
exports.IndexProvider = IndexProvider;
