// Set to true to get verbose output from the application.
var debug = true;
var dummy;

function log(str)
{
  if (!debug)
    return;
  console.log(str);
}

// This Javascript snippet must be at the very top of your front controller (first file consumed by the server)
require("appdynamics").profile({
  controllerHostName: 'pm4.appdynamics.com',
  controllerPort: 8090, // If SSL, be sure to enable the next line
  applicationName: 'Wine Cellar',
  tierName: 'wineTier',
  nodeName: 'wineNode', // Prefix to the full node name.
 });

//Express initialization & configuration
var express = require('express'),
    path = require('path'),
    http = require('http'),
    wine = require('./routes/wines');

wine.setLogCallback(log);

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/wines', wrapWithError(wrapWithGoogle(wine.findAll)));
app.get('/wines/:id', wrapWithError(wrapWithGoogle(wine.findById)));
app.post('/wines', wrapWithError(wrapWithGoogle(wine.addWine)));
app.put('/wines/:id', wrapWithError(wrapWithGoogle(wine.updateWine)));
app.delete('/wines/:id', wrapWithError(wrapWithGoogle(wine.deleteWine)));

// Make an sample exit call

function doGoogle(onComplete) {

http.request("http://www.wine.com", function(res) {
  log('STATUS: ' + res.statusCode);
  log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    log('BODY: ' + chunk);
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
    }); 
  };
}

function wrapWithError(handler) {
  return function(req, res, next) {
    var self = this;
    var args = arguments;
    
    // occasionally generate an error
    if (Math.random() < 0.1 ) {
      log('ERROR RESPONSE');
      var error = new Error('Sample BT Error');
      res.__caughtException__ = error; // (WORK-AROUND)
      return next(error);
    }
    // occasionally slow down
    if (Math.random() < 0.1) {
      log('SLOW');
      setTimeout(function() {
        handler.apply(self, args);
      }, 10000);
      return;
    }
    // occasionally stall out
    if (Math.random() < 0.1) {
      log('STALL');
      setTimeout(function() {
        handler.apply(self, args);
      }, 50000);
      return;
    }
    // occasionally bog down the CPU
    if (Math.random() < 0.02) {
      log('CPU PINNED');
      cpuDelay();
      handler.apply(self, args);
    }

    // normal response
    handler.apply(self, args);
  };
}

function cpuDelay() {
  dummy = [];
  var now = Date.now(), then = now;
  while (then - now < 5000) {
    then = Date.now();
    dummy.push(0);
    if (dummy.length > 100) {
      dummy.splice(0, 10);
    }
  }
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
