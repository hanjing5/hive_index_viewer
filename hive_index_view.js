
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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
app.get('/users', user.list);
//app.post('/search', search.results);

var indexProvider = new IndexProvider('localhost', 27017);

app.post('/search', function(req, res) {
    console.log(req);
    res.redirect("/search/" + req.body.search[0]+"/0/100");
});

app.locals.highlight = function(str, query){
    return str.replace(query, '<font style="background-color: yellow;">'+query+'</font>')
  }
app.get('/search/:query/:from/:to', function(req, res) {
  console.log(req);
  console.log(req.params);
  indexProvider.findByStructurePagination(req.params.query, parseInt(req.params.from), parseInt(req.params.to), function(error, docs) {
      console.log(docs.length);
      res.render('results',
      {
        title: "Search Results for "+req.params.query,
        query: req.params.query,
        results: docs,
        from: parseInt(req.params.from)
      });
  });
});

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
