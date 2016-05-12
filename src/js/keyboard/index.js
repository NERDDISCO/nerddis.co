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
  debug: true,
  sysex: true,

  devices : [
    {
      name : "LPK25 MIDI 1",
      mapping : mapping_akai_lpk25
    }
  ]
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





/**
 * Listen to "ndMidi" events
 */
window.addEventListener('ndMidi', function (e) {

  if (e.detail.name.indexOf('LPK25 MIDI') === -1) {
    return;
  }


  var command = NERDDISCO_midi.getCommand(e.detail);

  // The ID of the pressed key
  var key = (command.note + 2) % 25;


  // Start
  if (command.noteOn && command.pressed) {
    command.pressed = false;
    var note = command.note - 1;

    command.oscillator1 = tone(Math.pow(1.0594630943593, note - 49) * 440, 'sawtooth', 0);
    command.oscillator2 = tone(Math.pow(1.0594630943593, note - 49 - 7) * 440, 'triangle', 0);
    // command.oscillator3 = tone(Math.pow(1.0594630943593, note - 49 - 14) * 440, 'sawtooth', 0);
    // command.oscillator4 = tone(Math.pow(1.0594630943593, note - 49 - 21) * 440, 'sawtooth', 0);

    // Key is pressed
    active_keys[key].pressed = true;

    // Stop
  } else if (command.noteOff) {
      command.noteOff = false;

      var duration = 0.1;
      var _duration = 0.15;
      var increaseBy = -10;
      var stop = audioContext.currentTime + duration;
      var _stop = audioContext.currentTime;

      // command.oscillator1.frequency.setTargetAtTime(command.oscillator1.frequency.value + increaseBy, _stop, _duration);
      command.oscillator1.stop(stop);

      // command.oscillator2.frequency.setTargetAtTime(command.oscillator2.frequency.value + increaseBy, _stop, _duration);
      command.oscillator2.stop(stop);

      // command.oscillator3.frequency.setTargetAtTime(command.oscillator3.frequency.value + increaseBy, _stop, _duration);
      // command.oscillator3.stop(stop);

      // // command.oscillator4.frequency.setTargetAtTime(command.oscillator4.frequency.value + increaseBy, _stop, _duration);
      // command.oscillator4.stop(stop);

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
    // color: 120 / 25 * i
    color: 360 / 25 * i
  });

  active_keys.push({
    pressed : false,
    dot : myDot
  });
}

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
    } else {

    }

    // Draw dot
    active_keys[i].dot.draw();


  } // / Iterate over all keys

} // / funkyDraw


// Visualize active?
var isVisualizing = false;

// The button to trigger recording / stop
var visualizeButton = document.querySelector('#Visualize');

visualizeButton.addEventListener('click', function(e) {
  toggleVisualizing(this);
});


function toggleVisualizing(button) {
  // Start to visualize
  if (!isVisualizing) {
    isVisualizing = true;

    // Change the text to indicate "stop visualize"
    button.innerText = 'visualize: on';
    // Add a class
    button.classList.add('recording');

  // Stop to visualize
  } else {
    isVisualizing = false;

    // Change the text to indicate "start visualize"
    button.innerText = 'visualize: off';
    // Remove the class
    button.classList.remove('recording');
  }

} // / toggleRecording






// Update everything
function update() {

  if (isVisualizing) {
    // Draw on canvas
    draw();

    funkyDraw();
  } else {
    ctx.clearRect(0, 0, width, height);
  }


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

recordButton.addEventListener('click', function(e) {
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
  recorder.exportWAV(function(blob) {

    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
    var rename = document.createElement('input');

    au.controls = true;
    au.src = url;

    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = 'Download';
    hf.classList.add('button');

    li.appendChild(au);
    li.appendChild(hf);
    li.appendChild(rename);

    // Listen for clicks on download button
    hf.addEventListener('click', function(e) {
      if (rename.value !== '') {
        hf.download = rename.value + '.wav';
      }
    });

    recordingslist.appendChild(li);
  });

}
