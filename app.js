
/**
 * Module dependencies.
 */

var express = require('express');
var path = require("path");
var fs = require("fs"); 

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});


// Routes
app.get('/', function(req, res){
    res.render('index', {
        pageTitle: 'Руководства по Node.js'
    });
});

app.get('/guide/:folder/:name', function(req, res){
    var filename = path.join(__dirname, 'guides', 'build',
        req.params.folder+'-'+req.params.name + '.html');

    path.exists(filename, function(exists) {
        if(!exists) {
            res.render('guide', {
                pageTitle: 'Руководство не найдено! '
            });
        }

        fs.readFile(filename, 'utf8', function (err, data) {
            res.render('guide', {
                pageTitle: 'Руководство: ...',
                markdownHTML: data || 'ooops...'
            });
        });
    });
});

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
