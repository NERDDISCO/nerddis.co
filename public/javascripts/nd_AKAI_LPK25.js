'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ndMidi = (function () {
  function ndMidi(args) {
    _classCallCheck(this, ndMidi);

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
  }

  // / ndMidi

  // / constructor

  /**
   * Connect to the MIDI devices. 
   * 
   */

  ndMidi.prototype.connect = function connect() {

    // Get permission to use connected MIDI devices
    navigator.permissions.query({ name: 'midi', sysex: false }).then(

    // Success
    (function (permission) {

      if (this.debug) {
        console.log('"midi" permission:', permission.state);
      }

      // Permission is granted
      if (permission.state === 'granted') {
        // Request access to the MIDI devices
        navigator.requestMIDIAccess({ sysex: false }).then((function (access) {

          // Save a reference to MIDIAccess
          this.access = access;

          // Get the inputs for connected MIDI devices
          this.inputMap = this.access.inputs;

          if (this.debug) {
            console.log('MIDI input ports:', this.inputMap.size);
          }

          // Get the outputs for connected MIDI devices
          this.outputMap = this.access.outputs;

          if (this.debug) {
            console.log('MIDI output ports:', this.outputMap.size);
          }

          // Iterate over all input ports
          for (var _iterator = this.inputMap.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var input = _ref;

            // Listen to MIDIMessageEvent for this input port
            input.onmidimessage = this.inputMessage.bind(this);
          }

          // Input mapping exists
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

          // A new MIDI device was added or an existing MIDI device changes state
          this.access.onstatechange = function (MIDIConnectionEvent) {
            console.log('MIDIAccess state change:', MIDIConnectionEvent);
          }; // / this.access.onstatechange
        }).bind(this));

        // No permission
      } else {
          console.error('permission was not granted!');
        }
    }).bind(this), // / Success

    function (err) {
      console.error(err);
    } // / Failure

    ); // / navigator.permissions.query
  };

  // / ndMidi.connect

  /**
   * Handle MIDIMessageEvent's that are send from the MIDI device to the PC.
   * 
   * @param  {MIDIMessageEvent} message
   */

  ndMidi.prototype.inputMessage = function inputMessage(message) {

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

    /*if (this.mappingMode && channel_command !== '9') {
      console.log(note);
    }*/

    if (this.debug) {}
    //console.log(message.target.name, '|', 'channel_command', channel_command, 'channel', channel, 'type', type, 'note', note, 'velocitiy', velocity);

    //this.ndMidiEvent = new CustomEvent('ndMidiChange', { 'midi': elem.dataset.time });
    var event = new CustomEvent('ndMidi', { 'detail': this.inputElements[note] });
    window.dispatchEvent(event);
  };

  // / ndMidi.inputMessage

  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   * 
   */

  ndMidi.prototype.noteOn = function noteOn(args) {
    if (this.debug) {
      console.log('note on', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
      this.inputElements[args.note].pressed = true;
      this.inputElements[args.note].noteOn = true;
      this.inputElements[args.note].noteOff = false;
    }
  };

  /**
   * Note (for example a button on a drumpad) on MIDI device was activated (for example pressed).
   * 
   */

  ndMidi.prototype.noteOff = function noteOff(args) {
    if (this.debug) {
      console.log('note off', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
      this.inputElements[args.note].pressed = false;
      this.inputElements[args.note].noteOn = false;
      this.inputElements[args.note].noteOff = true;
    }
  };

  ndMidi.prototype.pitchBend = function pitchBend(args) {
    if (this.debug) {
      console.log('pitch bend', args);
    }
  };

  ndMidi.prototype.continuousController = function continuousController(args) {
    if (this.debug) {
      console.log('continuous controller', args);
    } else {
      this.inputElements[args.note] = Object.assign(this.inputElements[args.note], args);
    }
  };

  ndMidi.prototype.patchChange = function patchChange(args) {
    if (this.debug) {
      console.log('patch Change', args);
    }
  };

  // / ndMidi.patchChange

  ndMidi.prototype.aftertouch = function aftertouch(args) {
    if (this.debug) {
      console.log('aftertouch', args);
    }
  };

  // / ndMidi.aftertouch

  ndMidi.prototype.channelPressure = function channelPressure(args) {
    if (this.debug) {
      console.log('channel pressure', args);
    }
  };

  // / ndMidi.channelPressure

  ndMidi.prototype.nonMusicalCommand = function nonMusicalCommand(args) {
    if (this.debug) {
      console.log('(non-musical commands)', args);
    }
  };

  // / ndMidi.nonMusicalCommands

  return ndMidi;
})();

/*
// Create a new instance of ndMido
var NERDDISCO_midi = new ndMidi({
  debug : true,
  mappingMode : true,
  inputMapping : mapping_akai_lpk25
});

// Connect to the Web MIDI API and the attached MIDI devices
NERDDISCO_midi.connect();
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



var active_keys = [];

/**
 * Play a tone
 */
function tone(frequency) {
  var oscillator = audioContext.createOscillator();

  // @see https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
  oscillator.type = 'sawtooth';

  // Connect to gain node to control the volume
  oscillator.connect(gain);

  // Set the frequency of the current tone
  oscillator.frequency.value = frequency;

  // Start the playback
  oscillator.start(0);

  // Stop the playback after 150 ms
  //oscillator.stop(audioContext.currentTime + 0.15);

  return oscillator;
}

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
  inputMapping: mapping_akai_lpk25
});

// Connect to the Web MIDI API and the attached MIDI devices
NERDDISCO_midi.connect();

window.addEventListener('ndMidi', function (e) {

  // Start
  if (NERDDISCO_midi.inputElements[e.detail.note].noteOn && NERDDISCO_midi.inputElements[e.detail.note].pressed) {
    NERDDISCO_midi.inputElements[e.detail.note].pressed = false;
    var note = e.detail.note - 1;

    NERDDISCO_midi.inputElements[e.detail.note].oscillator1 = tone(Math.pow(1.0594630943593, note - 49) * 440);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator2 = tone(Math.pow(1.0594630943593, note - 49 - 7) * 440);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator3 = tone(Math.pow(1.0594630943593, note - 49 - 14) * 440);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator4 = tone(Math.pow(1.0594630943593, note - 49 - 21) * 440);

    // The key is pressed
    active_keys[(e.detail.note + 2) % 25] = 'on';

    // Stop
  } else if (NERDDISCO_midi.inputElements[e.detail.note].noteOff) {
      NERDDISCO_midi.inputElements[e.detail.note].noteOff = false;

      var stop = audioContext.currentTime + .1;

      NERDDISCO_midi.inputElements[e.detail.note].oscillator1.stop(stop);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator2.stop(stop);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator3.stop(stop);
      NERDDISCO_midi.inputElements[e.detail.note].oscillator4.stop(stop);

      // The key is released
      active_keys[(e.detail.note + 2) % 25] = 'off';
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
  //var elements = analyser.frequencyBinCount;
  var elements = 360;

  // Get current frequency data
  //analyser.getByteFrequencyData(analyserData);
  //analyser.getByteTimeDomainData(analyserData);

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  var shit = [];

  // Iterate over all elements of analyserData
  for (var i = 0; i < elements; i++) {

    //console.log(25 / elements * i);

    var j = Math.floor(25 / elements * i);

    if (typeof active_keys[j] !== undefined && active_keys[j] === 'on') {

      var _height = i % 10;

      _height = _height % 6;
      _height = height / 2 - _height * 2;
      //shit.push({i : _height});

      var _y = _height * 2;

      ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 50%, ' + (i + 1) % 15 / 10 + ')';
      ctx.fillRect(i * (width / elements), height / 2 - _height, key_width, _y);
    } else {

      ctx.fillStyle = 'hsla(' + elements / 360 * i + ', 100%, 30%, .65)';
      ctx.fillRect(i * (width / elements), height / 2, key_width, 10);
    }
  }

  if (shit.length > 0) {
    console.log(shit);
  }
}

draw();

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