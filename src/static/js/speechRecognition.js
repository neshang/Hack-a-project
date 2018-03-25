var speech = [];

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.maxAlternatives = 5;

var dicTextarea = $('#dic-textarea');
var noteContent = '';

/* Buttons and input */
$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
  console.log("Recognition start...");
});

$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  console.log("Recognition stop...");  
});

dicTextarea.on('input', function() {
  noteContent = $(this).val();
})

$('#finish-record-btn').on('click', function(e) {
  recognition.stop();
  console.log("Finish record button is pressed...");
  

  // if(!noteContent.length) {
  //   instructions.text('Could not save empty note. Please add a message to your note.');
  // }
  // else {
  //   // Save note to localStorage.
  //   // The key is the dateTime with seconds, the value is the content of the note.
  //   saveNote(new Date().toLocaleString(), noteContent);

  //   // Reset variables and update UI.
  //   noteContent = '';
  //   renderNotes(getAllNotes());
  //   noteTextarea.val('');
  //   instructions.text('Note saved successfully.');
  // }
})

recognition.onresult = function(event) {
  let final_transcript = '';

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      final_transcript += '. '
      console.log(`The final transcript is: ${final_transcript}`)
      dicTextarea.val(dicTextarea.val() + final_transcript)
    } 
  }
}

//   console.log(interim_transcript);
//   console.log('Final: ' + final_transcript);
// };

// recognition.onerror = function (event) {
//   console.log(event.error);
// };

// recognition.onend = function (event) {
//   recognition.start();
// };

// recognition.onstart = function() {
//   console.log('Speech recognition service has started');
// }


// recognition.onsoundstart = function() {
//   console.log('Some sound is being received');
// }

// function produceMessage(){
//     var msg= 'Hello<br />';
//     console.log(msg);
//     return msg;
// }

// function getSpeech(){
//     console.log('return speech array');
//     console.log('the speech array is' + speech);
//     return speech;
// }
