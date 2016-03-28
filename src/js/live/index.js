var React = require('react');
var ReactDOM = require('react-dom');

var Rx = require('rx/dist/rx.all.js');
var MrTurtle = require('./MrTurtle.js');
var mrturtle_client = new MrTurtle();

var Show = require('./components/Show.js');

// Connect to the server
mrturtle_client.connect();






ReactDOM.render(
  <Show artist={""} title={""} />,
  document.getElementById('mrturtle')
);