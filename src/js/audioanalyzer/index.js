var ndAudio = require('../vendor/NERDDISCO/ndAudio.js');
var ndSoundcloud = require('../vendor/NERDDISCO/ndSoundcloud.js');
var React = require('react');
var ReactDOM = require('react-dom');

var FrequencyGroup = require('./components/FrequencyGroup.js');





/**
 * Audio Analyzer
 */
var NERDDISCO_audio = new ndAudio({
  mediaElement : document.getElementById('player'),
  fftSize : 512
});

/**
 * SoundCloud connector
 */
var NERDDISCO_soundcloud = new ndSoundcloud({
  ndAudio : NERDDISCO_audio,
  clientID : 'dce5652caa1b66331903493735ddd64d',
  trackURL : 'https://soundcloud.com/loud-abovt-us/eptic-spellbound-loud-bovt-us-boot'
});

NERDDISCO_soundcloud.loadTrack();





/**
 * Update everything:
 */
var fps = 60;
var audioEvent = new CustomEvent("ndAudioEvent", { data: {} });

function update() {
  // Update the audio data
  NERDDISCO_audio.updateData();

  // Update data in custom event
  audioEvent.data = NERDDISCO_audio.getGroupedFrequencyData();

  // Fire custom event
  document.body.dispatchEvent(audioEvent);

  // Start update again
  setTimeout(function() {
    window.requestAnimationFrame(update);
  }, 1000 / fps);
}

update();





/**
 * Render react
 */
ReactDOM.render(
  <FrequencyGroup />,
  document.getElementById('audioanalyzer')
);