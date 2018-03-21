$(document).ready(function() {
  var speech = [];

  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 5;
  recognition.start();

  recognition.onresult = function(event) {
    var interim_transcript = '';
    var final_transcript = '';

    comsole.log(event.results);

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    console.log(interim_transcript);
    console.log('Final: ' + final_transcript);
  };

  recognition.onerror = function (event) {
    console.log(event.error);
  };

  recognition.onend = function (event) {
    recognition.start();
  };

  recognition.onstart = function() {
    console.log('Speech recognition service has started');
  }


  recognition.onsoundstart = function() {
    console.log('Some sound is being received');
  }

  function produceMessage(){
      var msg= 'Hello<br />';
      console.log(msg);
      return msg;
  }

  function getSpeech(){
      console.log('return speech array');
      console.log('the speech array is' + speech);
      return speech;
  }
});
