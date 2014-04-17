/*
// This Javascript snippet must be at the very top of your front controller (first file consumed by the server)
require("appdynamics").profile({
  controllerHostName: '<controller host name>',
  controllerPort: <controller port number>, // If SSL, be sure to enable the next line
  controllerSslEnabled: true|false, // Optional - use if connecting to controller via SSL
  accountName: '<AppDynamics account name>', // Required for a controller running in multi-tenant mode.
  accountAccessKey: '<AppDynamics account key>', // Required for a controller running in multi-tenant mode.
  applicationName: '<app_name>',
  tierName: '<tier_name>', 
  nodeName: '<node_name>', // Prefix to the full node name.
  debug: true|false // Optional - defaults to false.
 });
 */



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

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

//uncomment the line below for lab 2
//app.set('nodetime', nodetime);


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
