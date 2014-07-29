
require("appdynamics").profile({
  controllerHostName: 'staging.demo.appdynamics.com',
  controllerPort: 8090,
  applicationName: 'Wine Cellar',
  tierName: 'node-tier', 
  nodeName: 'winecellar-app-0',
 });

//Express initialization & configuration
var express = require('express'),
    path = require('path'),
    http = require('http'),
    wine = require('./routes/wines');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/wines', wrapWithGoogle(wine.findAll));
app.get('/wines/:id', wrapWithGoogle(wine.findById));
app.post('/wines', wrapWithGoogle(wine.addWine));
app.put('/wines/:id', wrapWithGoogle(wine.updateWine));
app.delete('/wines/:id', wrapWithGoogle(wine.deleteWine));

// Make an sample exit call

function doGoogle(onComplete) {

http.request("http://www.wine.com", function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('end', onComplete);
}).end();

}

function wrapWithGoogle(handler)
{
  return function() {
    var self = this;
    var args = arguments;
    doGoogle(function () {
    handler.apply(self, args);
  }); };
}

var server = http.createServer(app);

// Lab to be added later -- highlight nodetime sdk for custom instrumentation via start & end sdk calls
// Socket.io initialization & configuration
/*
var io = require('socket.io').listen(server);

io.configure(function() {
  io.set('log level', 1);

  var RedisStore = require('socket.io/lib/stores/redis');
  io.set('store', new RedisStore({
    redisPub:redis.createClient(), 
    redisSub:redis.createClient(), 
    redisClient:redis.createClient()
  }));
});

io.sockets.on('connection', function (socket) {
  socket.on('ping', function(data) {
    // tell agent to start tracing a transaction, see http://docs.nodetime.com/#agent-api
    var time = nodetime.time('Socket.io Events', 'ping');

    redisClient.incr("socketio_ping", function(err) {
      if(err) return console.error(err);

      socket.emit("pong", 'pong-payload');

      // tell agent to stop tracing
      time.end();
    });
  });
});
*/

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
