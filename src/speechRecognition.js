var speech = []

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
recognition.start();
console.log('Tesy');

recognition.onresult = function(event) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaahhhhhhhhhhh')
    console.log('You said: ' + event.results[0][0].transcript);
    speech.push(event.results[0][0].transcript);
}

function produceMessage(){
    var msg= 'Hello<br />';
    console.log(msg)        
    return msg;
}

function getSpeech(){
    console.log('return speech array')
    return speech
}