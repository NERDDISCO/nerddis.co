window.URL = window.URL || window.webkitURL;

// Recording active?
var isRecording = false;





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
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
  });

}