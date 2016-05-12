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

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
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
    setTimeout(function() {
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

audioOutputButton.addEventListener('click', function(e) {
  toggleAudioOutput(this);
});



function toggleAudioOutput(button) {
  // Start output
  if (!isOutputEnabled) {
    isOutputEnabled = true;

    // Connect to the speaker
    analyser.connect(audioContext.destination);

    // Change the text to indicate "stop recording"
    button.innerText = 'output: on';

  // Stop output
  } else {
    isOutputEnabled = false;

    // Disconnect from the speaker
    analyser.disconnect(audioContext.destination);

    // Change the text to indicate "start recording"
    button.innerText = 'output: off';
  }

} // / toggleAudioOutput






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
