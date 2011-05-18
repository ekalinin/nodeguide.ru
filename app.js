/**
 * Module dependencies.
 */

var express = require('express');
var path = require("path");
var fs = require("fs"); 
var os = require("os");

var app = module.exports = express.createServer();

var env;
var env_file = path.join(__dirname, 'build', 'json', 'globalcontext.json');

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

// Read sphinx-env file
fs.readFile(env_file, 'utf8', function (err, data) {
    env = JSON.parse(data);
});

// Routes
app.get('/', function (req, res) { res.redirect('/doc/'); });

app.get('/doc/', doc);
app.get('/doc/:name', doc);
app.get('/doc/:dir/:name', doc);
function doc(req, res, next) {
    var filename = path.join(__dirname, 'build', 'json', req.params.dir,
                        (req.params.name ? req.params.name : 'index') +
                        '.fjson');
    var port = app.address().port;

    path.exists(filename, function(exists) {
        // doc not found
        if(!exists) {
            res.render('layout', {
                doc: {
                    title:  'Документ не найден!',
                    body:   'Документ не найден :( <br/> ' +
                            'Попробуйте, пожалуйста, <a href="/"> сначала </a>.',
                },
                env: env,
                port: port
            });
            return;
        }
        // found
        fs.readFile(filename, 'utf8', function (err, data) {
            res.render('layout', { doc: JSON.parse(data), env: env,
                            port: port});
        });
    });
}


// Only listen on $ node app.js
if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}
