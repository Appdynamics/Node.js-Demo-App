// This Javascript snippet must be at the very top of your front controller (first file consumed by the server)
require("appdynamics").profile({
  controllerHostName: 'staging.demo.appdynamics.com',
  controllerPort: 8090, // If SSL, be sure to enable the next line
  applicationName: 'Movie Tickets Online',
  tierName: 'frontEnd',
  nodeName: 'Server1' // Prefix to the full node name.
 });

//Express initialization & configuration
var express = require('express'),
    path = require('path'),
    http = require('http'),
    movie = require('./routes/movie');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/tickets/:id', movie.findById); // mongo and redis
app.get('/tickets', movie.findAll); // mongo only
app.get('/ticket/process', movie.process); //slow cpu
app.get('/ticket/refund', movie.refund); //error
app.get('/ticket/check', movie.check); //external http call to fandango
app.get('/ticket/search', movie.searchTickets); //slow mongo query
app.get('/ticket/insert', movie.insert); //add more data to mongo
app.get('/movies/search', movie.movieSearch); // hit movie search
app.get('/movies/detail', movie.movieDetail); // hit movie search
app.get('/movies/review', movie.movieReview); // hit movie search

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
