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
                                "after","use","two","how","our","work","first","way","even","is",
                                "any","these","give","day","most","us", "it's","I'll", "off", "I'm"])

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

/* Call back function */
let wfIterator = word_freq.keys()
function cb() {
  console.log("call back is called")
  const n = wfIterator.next()
  if (n.done) {
    wfIterator = word_freq.keys()
    return
  }

  appendResult (word_freq.get(n.value), n.value, cb)
}

$('#finish-record-btn').on('click', function(e) {
  recognition.stop();
  document.getElementById('analysis-result').innerHTML = ""

  /* sort the word_freq list */
  let word_freq_list_sorted = sort_map(word_freq)
  console.log(word_freq_list_sorted)

  const initial = wfIterator.next()
  appendResult(word_freq.get(initial.value), initial.value, cb)

  console.log("Finish record button is pressed...")
})

/* Sorting the map using frequency */
function sort_map(ini_map) {
  let a = []
  for(var x of ini_map) 
    a.push(x)

  a.sort(function(x, y) {
    return x[1] - y[1]
  })
  
  return new Map(a)
}

function appendResult(value, key, callback) {
  document.getElementById('analysis-result').innerHTML += 
  `<div class="card">
    <div class="card-header" id=${key}>
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${key}" aria-expanded="true" aria-controls="collapse${key}">
          ${key} with frequency: ${value}
        </button>
      </h5>
    </div>

    <div id="collapse${key}" class="collapse" aria-labelledby="heading${key}" data-parent="#analysis-result">
      <div class="card-body">
        <ul id="list-${key}">
        </ul>
      </div>
    </div>
  </div>`
  
  /* Request synonyms from Words API  and append it to the ul */
  $.getJSON( `https://api.datamuse.com/words?rel_syn=${key}`, function( data ) {
    var ul = document.getElementById(`list-${key}`)
    let cnt = 0

    for (let word of data) {
      cnt++
      var li = document.createElement("li")
      li.appendChild(document.createTextNode(word.word))
      ul.appendChild(li)

      if (cnt == 5) {
        break
      }
    }
    callback()
  })
}

recognition.onresult = function(event) {
  let final_transcript = ''

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
        freq++
        word_freq.set(words[i], freq)
        console.log(`The word is ${words[i]} and the requency is ${freq}`)
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
