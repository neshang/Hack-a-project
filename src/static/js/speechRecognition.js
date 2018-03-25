var speech = []

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US'
recognition.continuous = true
recognition.maxAlternatives = 5

var dicTextarea = $('#dic-textarea')
var result = $('#analysis-result')
var noteContent = ''

/* Set of words that are not tracked */
const untracked_words = new Set(["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with",
                                "he","as","you","do","at","this","but","his","by","from","they","we","say","her","she",
                                "or","an","will","my","one","all","would","there","their","what","so","up","out","if",
                                "about","who","get","which","go","me","when","make","can","like","time","no","just",
                                "him","know","take","people","into","year","your","good","some","could","them","see",
                                "other","than","then","now","look","only","come","its","over","think","also","back",
                                "after","use","two","how","our","work","first","well","way","even","new","want","because",
                                "any","these","give","day","most","us", "it's","I'll", "off"])

/* A map keeps track of word and frequency */
var word_freq = new Map()

/* Buttons and input */
$('#start-record-btn').on('click', function(e) {
  /* Clean up the textareas */
  dicTextarea.val("")
  document.getElementById('analysis-result').innerHTML = ""
  work_freq = new Map()

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
  document.getElementById('analysis-result').innerHTML = ""
  word_freq.forEach(appendResult);

  console.log("Finish record button is pressed...");
})

function appendResult(value, key, map) {
  document.getElementById('analysis-result').innerHTML += `<span class="word"> ${key}</span>`
  document.getElementById('analysis-result').innerHTML += `<span class="frequency"> ${value}</span>`
  document.getElementById('analysis-result').innerHTML += `<br>`
  
}

recognition.onresult = function(event) {
  let final_transcript = '';

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += $.trim(event.results[i][0].transcript)
      analysisSentence(final_transcript)
      final_transcript = capitalizeFirstLetter(final_transcript)
      final_transcript += '. '
      dicTextarea.val(dicTextarea.val() + final_transcript)
    } 
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function analysisSentence(string) {
  var words = string.split(" ")
  for (var i = 0; i < words.length; i += 1) {
    if (!untracked_words.has(words[i])) {
      if (word_freq.has(words[i])) {
        var freq = word_freq.get(words[i])
        word_freq.set(words[i], freq++)
      } else {
        word_freq.set(words[i], 1)
      }
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
