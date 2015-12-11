(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ndMidi = (function () {
  function ndMidi(args) {
    _classCallCheck(this, ndMidi);

    // System Exclusive Support?
    this.sysex = args.sysex || false;

    // @see MIDIAccess
    this.access = args.access || null;

    // @see MIDIInputMap
    this.inputMap = args.inputMap || null;

    // @see MIDIOutputMap
    this.outputMap = args.outputMap || null;

    // Show debugging logs?
    this.debug = args.debug || false;

    // Input mapping mode activated?
    this.mappingMode = args.mappingMode || false;

    // The active input elements
    this.inputElements = args.inputElements || [];

    // Mapping of input elements
    this.inputMapping = args.inputMapping || null;
  } // / constructor

  /**
   * Get permission to use MIDI devices.
   */

  _createClass(ndMidi, [{
    key: 'connect',
    value: function connect() {

      // Get permission to use connected MIDI devices
      navigator.requestMIDIAccess({ sysex: this.sysex }).then(
      // Success
      this.connectSuccess.bind(this),
      // Failure
      this.connectFailure.bind(this));
    } // / ndMidi.connect

    /**
     * Got permission to use MIDI devices. 
     * 
     * @param MIDIAccess access
     */

  }, {
    key: 'connectSuccess',
    value: function connectSuccess(access) {

      // Save a reference to MIDIAccess
      this.access = access;

      // Get the inputs for connected MIDI devices
      this.inputMap = this.access.inputs;

      // Get the outputs for connected MIDI devices
      this.outputMap = this.access.outputs;

      // Iterate over all input ports
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.inputMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var input = _step.value;

          // Listen to MIDIMessageEvent for this input port
          input.onmidimessage = this.inputMessage.bind(this);
        }

        // Input mapping exists
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.inputMapping !== null) {

        // Iterate over all input element mappings
        for (var key in this.inputMapping) {
          var note = this.inputMapping[key];

          this.inputElements[note] = {};
          this.inputElements[note].pressed = false;
          this.inputElements[note].velocity = 0;
        }
      }

      // TODO: Handle output messages

      // Listen to stateChange events
      this.access.addEventListener('statechange', this.stateChange.bind(this));
    } // / ndMidi.connectSuccess

    /**
     * It's not possible to use the Web MIDI API.
     */

  }, {
    key: 'connectFailure',
    value: function connectFailure(message) {

      console.error(message);
    } // / ndMidi.connectFailure

    /**
     * State of a MIDI devices changed: connected / disconnected
     * 
     * @param  MIDIConnectionEvent e
     */

  }, {
    key: 'stateChange',
    value: function stateChange(e) {
      console.log('MIDIAccess state change:', e);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.access.inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var entry = _step2.value;

          var input = entry[1];
          console.log("Input port [type:'" + input.type + "'] id:'" + input.id + "' manufacturer:'" + input.manufacturer + "' name:'" + input.name + "' version:'" + input.version + "'");
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    } // / ndMidi.stageChange

  }, {
    key: 'handleInputs',
    value: function handleInputs() {} // / ndMidi.handleInputs

    /**
     * Handle MIDIMessageEvent's that are send from the MIDI device to the PC.
     * 
     * @param  {MIDIMessageEvent} message
     */

  }, {
    key: 'inputMessage',
    value: function inputMessage(message) {

      /**
       * @TODO: WTF?
       * 
       * Reproduce
       * - Connect a MIDI device
       * - Detach MIDI device
       * - Connect MIDI device 
       * ---> The "midimessage" event is fired
       */
      if (message.data.length == 1) {
        return;
      }

      // Input
      var data = message.data;

      // The current MIDI command
      var midi_command = data[0].toString(16);

      // Note
      var note = data[1];

      // Velocity
      var velocity = data[2];

      // Channel
      // var channel = data[0] & 0xf;
      var channel = midi_command.charAt(1);

      // Command
      var channel_command = midi_command.charAt(0);

      // Type
      var type = data[0];

      // Do stuff based on the message type
      switch (channel_command) {

        // Note Off
        case '8':
          this.noteOff({ note: note, velocity: velocity, channel: channel });
          break;

        // Note On
        case '9':
          this.noteOn({ note: note, velocity: velocity, channel: channel });
          break;

        // Aftertouch
        case 'a':
          this.aftertouch({ note: note, velocity: velocity, channel: channel });
          break;

        // Continuous controller
        case 'b':
          this.continuousController({ note: note, velocity: velocity, channel: channel });
          break;

        // Patch change
        case 'c':
          this.patchChange({ note: note, velocity: velocity, channel: channel });
          break;

        // Channel Pressure
        case 'd':
          this.channelPressure({ note: note, velocity: velocity, channel: channel });
          break;

        // Pitch bend
        case 'e':
          this.pitchBend({ note: note, velocity: velocity, channel: channel });
          break;

        // (non-musical commands)
        case 'f':
          this.nonMusicalCommand({ note: note, velocity: velocity, type: type });
          break;

        default:
          console.log('UNKOWN VALUE', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity, 'message', message);

      } // / switch(type)

      if (this.debug) {
        //console.log(message.target.name, '|', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity);
      }

      var event = new CustomEvent('ndMidi', { 'detail': this.inputElements[note] });
      window.dispatchEvent(event);
    } // / ndMidi.inputMessage

    /**
     * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
     * 
     */

  }, {
    key: 'noteOn',
    value: function noteOn(args) {
      if (this.debug) {
        console.log('note on', args);
      } else {
        this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
        this.inputElements[args.note].pressed = true;
        this.inputElements[args.note].noteOn = true;
        this.inputElements[args.note].noteOff = false;
      }
    }

    /**
     * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
     * 
     */

  }, {
    key: 'noteOff',
    value: function noteOff(args) {
      if (this.debug) {
        console.log('note off', args);
      } else {
        this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
        this.inputElements[args.note].pressed = false;
        this.inputElements[args.note].noteOn = false;
        this.inputElements[args.note].noteOff = true;
      }
    }
  }, {
    key: 'pitchBend',
    value: function pitchBend(args) {
      if (this.debug) {
        console.log('pitch bend', args);
      }
    }
  }, {
    key: 'continuousController',
    value: function continuousController(args) {
      if (this.debug) {
        console.log('continuous controller', args);
      } else {
        this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
      }
    }
  }, {
    key: 'patchChange',
    value: function patchChange(args) {
      if (this.debug) {
        console.log('patch Change', args);
      }
    } // / ndMidi.patchChange

  }, {
    key: 'aftertouch',
    value: function aftertouch(args) {
      if (this.debug) {
        console.log('aftertouch', args);
      }
    } // / ndMidi.aftertouch

  }, {
    key: 'channelPressure',
    value: function channelPressure(args) {
      if (this.debug) {
        console.log('channel pressure', args);
      }
    } // / ndMidi.channelPressure

  }, {
    key: 'nonMusicalCommand',
    value: function nonMusicalCommand(args) {
      if (this.debug) {
        console.log('(non-musical commands)', args);
      }
    } // / ndMidi.nonMusicalCommands

  }]);

  return ndMidi;
})(); // / ndMidi

module.exports = ndMidi;

},{}],3:[function(require,module,exports){
'use strict';

// Import ndMidi
var ndMidi = require('./ndMidi.js');

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
analyser.fftSize = 512;

// AnalyserData
var analyserData = new Uint8Array(analyser.frequencyBinCount);

// Control the volume
var gain = audioContext.createGain();
// Set the volume to 25%
gain.gain.value = .25;

// Connect the gain to the analyser
gain.connect(analyser);

// Connect the recorder to the analyser
var recorder = new Recorder(analyser);

// Connect the analyser to the destination (speaker) to be able to hear something
analyser.connect(audioContext.destination);

// Mapping for the AKAI LPK25 MIDI controller
var mapping_akai_lpk25 = {
  a: 48,
  b: 49,
  c: 50,
  d: 51,
  e: 52,
  f: 53,
  g: 54,
  h: 55,
  i: 56,
  j: 57,
  k: 58,
  l: 59,
  m: 60,
  n: 61,
  o: 62,
  p: 63,
  q: 64,
  r: 65,
  s: 66,
  t: 67,
  u: 68,
  v: 69,
  w: 70,
  x: 71,
  y: 72
};

/**
 * MIDI
 */
var NERDDISCO_midi = new ndMidi({
  debug: false,
  inputMapping: mapping_akai_lpk25,
  sysex: true
});

// Connect to the Web MIDI API and the attached MIDI devices
NERDDISCO_midi.connect();

/**
 * Play a tone
 */
function tone(frequency, type, detune) {
  var oscillator = audioContext.createOscillator();

  // @see https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
  oscillator.type = type;

  // Set the frequency of the current tone
  oscillator.frequency.value = frequency;

  // Set detune
  oscillator.detune.value = detune;

  // Connect to gain node to control the volume
  oscillator.connect(gain);

  // Start the playback
  oscillator.start(0);

  return oscillator;
}

// Currently active keys from AKAI LPK25
var active_keys = [];

resize();

var width = canvas.width;
var height = canvas.height;

// Generate the active_keys
for (var i = 0; i < 25; i++) {

  var myDot = new ndDot({
    ctx: ctx,
    x: width / 2,
    y: height / 2,
    r: 150,
    ttl: 60,
    color: 120 / 25 * i
  });

  active_keys.push({
    pressed: false,
    dot: myDot
  });
}

/**
 * Listen to "ndMidi" events
 */
window.addEventListener('ndMidi', function (e) {

  // The ID of the pressed key
  var key = (e.detail.note + 2) % 25;

  // Start
  if (NERDDISCO_midi.inputElements[e.detail.note].noteOn && NERDDISCO_midi.inputElements[e.detail.note].pressed) {
    NERDDISCO_midi.inputElements[e.detail.note].pressed = false;
    var note = e.detail.note - 1;

    NERDDISCO_midi.inputElements[e.detail.note].oscillator1 = tone(Math.pow(1.0594630943593, note - 49) * 440, 'sawtooth', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator2 = tone(Math.pow(1.0594630943593, note - 49 - 7) * 440, 'triangle', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator3 = tone(Math.pow(1.0594630943593, note - 49 - 14) * 440, 'sawtooth', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator4 = tone(Math.pow(1.0594630943593, note - 49 - 21) * 440, 'sawtooth', 0);

    // Key is pressed
    active_keys[key].pressed = true;

    // Stop
  } else if (NERDDISCO_midi.inputElements[e.detail.note].noteOff) {
      NERDDISCO_midi.inputElements[e.detail.note].noteOff = false;

      var duration = 0.1;
      var _duration = 0.05;
      var increaseBy = -10;
      var stop = audioContext.currentTime + duration;
      var _stop = audioContext.currentTime;

      //NERDDISCO_midi.inputElements[e.detail.note].oscillator1.frequency.setTargetAtTime(NERDDISCO_midi.inputElements[e.detail.note].oscillator1.frequency.value + increaseBy, _stop, _duration);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator1.stop(stop);

      //NERDDISCO_midi.inputElements[e.detail.note].oscillator2.frequency.setTargetAtTime(NERDDISCO_midi.inputElements[e.detail.note].oscillator2.frequency.value + increaseBy, _stop, _duration);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator2.stop(stop);

      //NERDDISCO_midi.inputElements[e.detail.note].oscillator3.frequency.setTargetAtTime(NERDDISCO_midi.inputElements[e.detail.note].oscillator3.frequency.value + increaseBy, _stop, _duration);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator3.stop(stop);

      //NERDDISCO_midi.inputElements[e.detail.note].oscillator4.frequency.setTargetAtTime(NERDDISCO_midi.inputElements[e.detail.note].oscillator4.frequency.value + increaseBy, _stop, _duration);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator4.stop(stop);

      // The key is released
      active_keys[key].pressed = false;
    }
});

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

var key_width = 2;

// Draw on canvas
function draw() {
  var width = canvas.width;
  var height = canvas.height;
  var elements = 360;

  // Clear the canvas
  // ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(0, 0, 0, .3)";
  ctx.fillRect(0, 0, width, height);

  // Iterate over all elements of analyserData
  for (var i = 0; i < elements; i++) {

    var j = Math.floor(25 / elements * i);

    // Key is pressed
    if (active_keys[j].pressed === true) {
      var _height = i % 10;

      _height = _height % 6;
      _height = height / 2 - _height * 2;

      var _y = _height * 2;

      ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 50%, ' + (i + 1) % 15 / 10 + ')';
      ctx.fillRect(i * (width / elements), height / 2 - _height, key_width, _y);

      // Key is not pressed
    } else {

        ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 30%, .65)';
        ctx.fillRect(i * (width / elements), height / 2, key_width, 10);
      }
  }
}

/**
 * Draw some funky stuff >:D
 * 
 */
function funkyDraw() {

  // Iterate over all keys
  for (var i = 0; i < active_keys.length; i++) {

    // Key is pressed
    if (active_keys[i].pressed) {

      active_keys[i].dot.active = true;

      // Reset dot
      active_keys[i].dot.reset();

      // Key is released
    } else {}

    // Draw dot
    active_keys[i].dot.draw();
  } // / Iterate over all keys
} // / funkyDraw

// Update everything
function update() {
  // Draw on canvas
  draw();

  funkyDraw();

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
    recorder.record();

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

},{"./ndDot.js":1,"./ndMidi.js":2,"./recorder.js":4}],4:[function(require,module,exports){
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

},{}]},{},[3]);
