
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
 // , user = require('./routes/user')
  , path = require('path');

  , http = require('http')
var app = express();
//var search = require('./routes/search');

var IndexProvider = require('./db').IndexProvider;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);

var indexProvider = new IndexProvider('localhost', 27017);

app.post('/search', function(req, res) {
    console.log(req);
    res.redirect("/search/" + req.body.search[0]+"/0/100");
});

// Helper function for highlight text
app.locals.highlight = function(str, query){
    return str.replace(query, '<font style="background-color: yellow;">'+query+'</font>')
  }

// main REST url for search
app.get('/search/:query/:from/:to', function(req, res) {
  indexProvider.view();
  indexProvider.findByStructurePagination(req.params.query, parseInt(req.params.from), parseInt(req.params.to), function(error, docs) {
    res.render('results',
    {
      title: "Search Results for "+req.params.query,
      query: req.params.query,
      results: docs,
      from: parseInt(req.params.from),
    });
  });
});

// NOT USED
app.get('/databases', function(req, res) {
    indexProvider.findAll(function(error, docs) {
      console.log(docs.length);
      res.render('databases',
        {
          results: docs
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
