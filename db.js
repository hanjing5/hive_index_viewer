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
  this.db.collection('processed_table', function(error, index_collection) {
    if( error ) callback(error);
    else callback(null, index_collection);
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
IndexProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, index_collection) {
      if( error ) callback(error)
      else {
        index_collection.findOne({_id: index_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

IndexProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, index_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        index_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

console.log("this is the serverice Provider");
exports.IndexProvider = IndexProvider;
