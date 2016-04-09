(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// Import ndDot
var ndDot = require('./ndDot.js');

// Import Recorder
var Recorder = require('./recorder.js');

/**
 * Initialize everything
 */
var audioContext = new AudioContext();

// NERDDISCO container
var nerddisco = document.querySelector('.nerddisco');

// Get the canvas
var canvas = document.querySelector('#c');
var ctx = canvas.getContext('2d');

// Analyser
var analyser = audioContext.createAnalyser();
// Set FFT size
analyser.fftSize = 256;

// AnalyserData
var analyserData = new Uint8Array(analyser.frequencyBinCount);

// Control the volume
var gain = audioContext.createGain();
// Set the volume to 25%
gain.gain.value = 1;

// Connect the gain to the analyser
gain.connect(analyser);

// Connect the recorder to the analyser
var recorder = new Recorder(analyser);

function successCallback(localMediaStream) {
  var audioBuffer = audioContext.createBuffer(1, 22500, 22500);
  var mediaStream = audioContext.createMediaStreamSource(localMediaStream);
  mediaStream.connect(gain);
}

function errorCallBack(streamError) {
  console.log("WebRTC API not supported on this browser. " + streamError);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({ audio: true, video: false }, successCallback, errorCallBack);

var width = canvas.width;
var height = canvas.height;

// Resize the canvas on "resize" events
function resize() {
  // Set the width of the canvas
  canvas.width = nerddisco.clientWidth;

  // Set the height of the canvas
  canvas.height = nerddisco.clientHeight;
}

// Listen to "resize" events
window.addEventListener('resize', function (event) {
  // Resize the canvas
  resize();
}, false); // / window.addEventListener('resize')

// Draw on canvas
function draw() {
  var width = canvas.width;
  var height = canvas.height;
  var elements = analyserData.length;

  analyser.getByteFrequencyData(analyserData);

  // Clear the canvas
  // ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(0, 0, 0, .3)";
  ctx.fillRect(0, 0, width, height);

  if (!isOutputEnabled && !isRecording) {
    return;
  }

  // Iterate over all elements of analyserData
  for (var i = 0; i < elements; i++) {

    // // Key is pressed
    // if (active_keys[j].pressed === true) {
    //   var _height = i % 10;

    //   _height = _height % 6;
    //   _height = height / 2 - _height * 2;

    //   var _y = _height * 2;

    //   ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 50%, ' + (i + 1) % 15 / 10 + ')';
    //   ctx.fillRect(i * (width / elements), height / 2 - _height, key_width, _y);

    // // Key is not pressed
    // } else {

    ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 30%, .65)';
    ctx.fillRect(i * (width / elements), height / 2, 2, 10 - analyserData[i]);
    // }
  }
}

// Update everything
function update() {
  // Draw on canvas
  draw();

  // Call update() again
  //setTimeout(function() {
  window.requestAnimationFrame(update);
  //}, 1000 / 50);
}

// Initial resize
resize();

// Start update loop
update();
// Failure

window.URL = window.URL || window.webkitURL;

// Recording active?
var isRecording = false;

// The button to trigger recording / stop
var recordButton = document.querySelector('#record');

recordButton.addEventListener('click', function (e) {
  toggleRecording(this);
});

function toggleRecording(button) {
  // Start recording
  if (!isRecording) {
    isRecording = true;

    // Change the text to indicate "stop recording"
    button.innerText = 'stop';
    // Add a class
    button.classList.add('recording');

    // Start recording
    setTimeout(function () {
      recorder.record();
    }, 250);

    // Stop recording
  } else {
      isRecording = false;

      // Change the text to indicate "start recording"
      button.innerText = 'record';
      // Remove the class
      button.classList.remove('recording');

      // Stop recording
      recorder.stop();

      // create WAV download link using audio data blob
      createDownloadLink();

      // Remove all input
      recorder.clear();
    }
} // / toggleRecording

// Output active?
var isOutputEnabled = false;

// The button to trigger recording / stop
var audioOutputButton = document.querySelector('#output');

audioOutputButton.addEventListener('click', function (e) {
  toggleAudioOutput(this);
});

function toggleAudioOutput(button) {
  // Start output
  if (!isOutputEnabled) {
    isOutputEnabled = true;

    // Connect to the speaker
    analyser.connect(audioContext.destination);

    // Change the text to indicate "stop recording"
    button.innerText = 'Audio: enabled';

    // Stop output
  } else {
      isOutputEnabled = false;

      // Disconnect from the speaker
      analyser.disconnect(audioContext.destination);

      // Change the text to indicate "start recording"
      button.innerText = 'Audio: disabled';
    }
} // / toggleAudioOutput

function createDownloadLink() {
  recorder.exportWAV(function (blob) {

    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = 'Download';
    hf.classList.add('button');
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
  });
}

},{"./ndDot.js":2,"./recorder.js":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ndDot = (function () {
  function ndDot(args) {
    _classCallCheck(this, ndDot);

    // Canvas context
    this.ctx = args.ctx || undefined;

    // Is the element active
    this.active = args.active || false;

    // Radius
    this.r = args.r || 0;
    this._r = this.r;

    // Position
    this.x = args.x || 0;
    this._x = this.x;

    this.y = args.y || 0;
    this._y = this.y;

    // Time to life
    this.ttl = args.ttl || 0;
    // The amount of time I'm alive
    this._ttl = this.ttl;

    // Color
    this.color = args.color || 0;
    this._color = this.color;
  }

  _createClass(ndDot, [{
    key: "draw",
    value: function draw() {

      // Canvas context does not exist
      if (this.ctx === undefined) {
        return;
      }

      if (!this.active) {
        return;
      }

      // The element is still alive
      if (this._ttl-- > 0) {

        // Save the canvas state
        this.ctx.save();

        // Start to draw a path
        this.ctx.beginPath();

        // Decrease the radius   
        this._r = this._r - this.r / this.ttl;

        // Change the positon
        // this._x = this._x - (this.r / this.ttl);
        // this._y = this._y - (this.r / this.ttl);

        // Set the color
        this.ctx.fillStyle = "hsla(" + this._color + ", 100%, 60%, .45)";

        // Draw the dot
        this.ctx.arc(this.x, this.y, this._r, 0, 2 * Math.PI);

        // Fill the dot with color
        this.ctx.fill();

        // Restore the canvas state
        this.ctx.restore();
      }
    }

    /**
     * Reset the initial state of the dot.
     * 
     */

  }, {
    key: "reset",
    value: function reset() {
      this._ttl = this.ttl;
      this._r = this.r;
    }
  }]);

  return ndDot;
})(); // / ndDot

module.exports = ndDot;

},{}],3:[function(require,module,exports){
'use strict';

var WORKER_PATH = 'js/recorderWorker.js';

var Recorder = function Recorder(source, cfg) {
  var config = cfg || {};
  var bufferLen = config.bufferLen || 4096;
  var numChannels = config.numChannels || 2;
  this.context = source.context;
  this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, bufferLen, numChannels, numChannels);
  var worker = new Worker(config.workerPath || WORKER_PATH);
  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: this.context.sampleRate,
      numChannels: numChannels
    }
  });
  var recording = false,
      currCallback;

  this.node.onaudioprocess = function (e) {
    if (!recording) return;
    var buffer = [];
    for (var channel = 0; channel < numChannels; channel++) {
      buffer.push(e.inputBuffer.getChannelData(channel));
    }
    worker.postMessage({
      command: 'record',
      buffer: buffer
    });
  };

  this.configure = function (cfg) {
    for (var prop in cfg) {
      if (cfg.hasOwnProperty(prop)) {
        config[prop] = cfg[prop];
      }
    }
  };

  this.record = function () {
    recording = true;
  };

  this.stop = function () {
    recording = false;
  };

  this.clear = function () {
    worker.postMessage({ command: 'clear' });
  };

  this.getBuffer = function (cb) {
    currCallback = cb || config.callback;
    worker.postMessage({ command: 'getBuffer' });
  };

  this.exportWAV = function (cb, type) {
    currCallback = cb || config.callback;
    type = type || config.type || 'audio/wav';
    if (!currCallback) throw new Error('Callback not set');
    worker.postMessage({
      command: 'exportWAV',
      type: type
    });
  };

  worker.onmessage = function (e) {
    var blob = e.data;
    currCallback(blob);
  };

  source.connect(this.node);
  this.node.connect(this.context.destination); //this should not be necessary
};

Recorder.forceDownload = function (blob, filename) {
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var link = window.document.createElement('a');
  link.href = url;
  link.download = filename || 'output.wav';
  var click = document.createEvent("Event");
  click.initEvent("click", true, true);
  link.dispatchEvent(click);
};

module.exports = Recorder;

},{}]},{},[1]);
