
/**
 * Module dependencies.
 */

var express = require('express');
var path = require("path");
var fs = require("fs"); 

var app = module.exports = express.createServer();

// Configuration
app.configure( function() {
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
app.get('/', function (req, res) { res.redirect('/doc/'); });

app.get('/doc/', doc);
app.get('/doc/:name', doc);
app.get('/doc/:dir/:name', doc);
function doc(req, res, next) {
    var filename = path.join(__dirname, 'build', 'json', req.params.dir,
                        (req.params.name ? req.params.name : 'index') + '.fjson');

    path.exists(filename, function(exists) {
        // doc not found
        if(!exists) {
            res.render('layout', {
                doc: {
                    title:  'Документ не найден!',
                    body:   'Документ не найден :( <br/> ' +
                            'Попробуйте, пожалуйста, <a href="/"> сначала </a>.',
                }
            });
            return;
        }
        // found
        fs.readFile(filename, 'utf8', function (err, data) {
            res.render('layout', { doc: JSON.parse(data) });
        });
    });
}


// Only listen on $ node app.js
if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}
