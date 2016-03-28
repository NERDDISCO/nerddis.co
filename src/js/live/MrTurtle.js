'use strict';

// load socket.io-client
var io = require('socket.io-client/socket.io.js');
var Rx = require('rx/dist/rx.all.js');





class MrTurtle {
    
  constructor(args) {

    this.socket = undefined;

    // Custom event for data
    this.mrturtleData = new CustomEvent("mrturtleData", { data: {} });

  } // / constructor




  /**
   * Create a connection and subscribe to streams.
   */
  connect() {
    
    // Connect to socket.io server
    this.socket = io.connect('http://192.168.178.132:2000');

    // Subscribe to different messages from the server
    this.subscribe();

  } // / connect




  /**
   * Subscribe to different kind of streams. 
   */
  subscribe() {

    // Create a stream to listen to "voteEvent"
    var voteEvent$ = Rx.Observable.fromEvent(document.body, 'voteEvent');

    // Subscribe to the "voteEvent" stream
    voteEvent$.subscribe(e => {
      this.socket.emit('voteResult', { result: e.data });
    });



    // Create a stream from the 'hello' messages from the server
    var hello$ = Rx.Observable.fromEvent(this.socket, 'hello');

    // Subscribe to the hello stream
    hello$.subscribe(data => {
      // Save the fetched data into mrturtleData
      this.mrturtleData.data = data;

      // Fire the custom event
      document.body.dispatchEvent(this.mrturtleData);
    });

  } // / subscribe()



} // / MrTurtle





module.exports = MrTurtle;