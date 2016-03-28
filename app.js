var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var Rx = require('rx');

var routes = require('./routes/index');

server.listen(2000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// compress all requests
app.use(compression());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var mrturtle_data = {
  artist: 'Tim Pietrusky',
  title: 'JSConf Uruguay 2016',
  votes : {
    yes : 0,
    no: 0
  }
};




/**
 * socket.io
 * 
 */
io.on('connection', function (socket) {

  // console.log('sessionID ' + socket.id);
  
  // Send init event to socket
  socket.emit('hello', mrturtle_data);

  // Create a stream from the 'hello' messages from the server
  var voteResult$ = Rx.Observable.fromEvent(socket, 'voteResult');

  // Subscribe to the socket stream
  voteResult$.subscribe(data => {

    // Count result
    if (data.result === 'yes') {
      mrturtle_data.votes.yes += 1;
    } else {
      mrturtle_data.votes.no += 1;
    }

    // Send update to all clients
    io.emit('hello', mrturtle_data);

  });

});






module.exports = app;