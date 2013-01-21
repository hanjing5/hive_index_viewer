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
  this.db.collection('processed_table', function(error, article_collection) {
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};

IndexProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

IndexProvider.prototype.findByStructure = function(id, callback) {
    console.log(id);
  console.log("looking for structure");
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({structure:{"$regex": id}}, function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
IndexProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

IndexProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
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

        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

console.log("this is the serverice Provider");
exports.IndexProvider = IndexProvider;
