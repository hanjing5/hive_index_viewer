/*
 * GET home page.
 */

var IndexProvider = require('../db').IndexProvider;
exports.index = function(req, res){
  //IndexProvider.viewed('index');
  res.render('index', { title: 'Hive Table Index Searcher' });
};
