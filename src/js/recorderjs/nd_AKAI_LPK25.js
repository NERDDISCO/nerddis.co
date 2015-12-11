// Import ndMidi
var ndMidi = require('./ndMidi.js');

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
gain.gain.value = .05;

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


/**
 * Listen to "ndMidi" events
 */
window.addEventListener('ndMidi', function (e) {

  // Start
  if (NERDDISCO_midi.inputElements[e.detail.note].noteOn && NERDDISCO_midi.inputElements[e.detail.note].pressed) {
    NERDDISCO_midi.inputElements[e.detail.note].pressed = false;
    var note = e.detail.note - 1;

    NERDDISCO_midi.inputElements[e.detail.note].oscillator1 = tone(Math.pow(1.0594630943593, note - 49) * 440, 'sawtooth', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator2 = tone(Math.pow(1.0594630943593, note - 49 - 7) * 440, 'triangle', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator3 = tone(Math.pow(1.0594630943593, note - 49 - 14) * 440, 'sawtooth', 0);
    NERDDISCO_midi.inputElements[e.detail.note].oscillator4 = tone(Math.pow(1.0594630943593, note - 49 - 21) * 440, 'sawtooth', 0);

    // The key is pressed
    active_keys[(e.detail.note + 2) % 25] = 'on';

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