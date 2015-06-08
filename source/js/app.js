// create web audio api context 
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();  
// create Oscillator and gain node 
var oscillator = audioCtx.createOscillator(); 
var gainNode = audioCtx.createGain();  
// connect oscillator to gain node to speakers  
oscillator.connect(gainNode); 
gainNode.connect(audioCtx.destination);  
// create initial theremin frequency and volumn values  


var colCount = document.getElementById("count").innerHTML; //number of columns
var maxDataVals = new Array(colCount);
for (var i = 0; i < colCount; i++) maxDataVals[i] = Number.MIN_VALUE;
var minDataVals = new Array(colCount);
for (var i = 0; i < colCount; i++) minDataVals[i] = Number.MAX_VALUE;

$('[class*="value"]').each(function(){
    var classList = this.className.split(/\s+/); //for every table value retrieve classlist
    var colNo = (classList[1]).split('-')[1]; //column number
    if(parseInt(this.innerHTML) < minDataVals[colNo]) minDataVals[colNo] = parseInt(this.innerHTML);
    if(parseInt(this.innerHTML) > maxDataVals[colNo]) maxDataVals[colNo] = parseInt(this.innerHTML);
    
    //TODO also need to create colCount-D array with all values for each column
});



var WIDTH = window.innerWidth; 
var HEIGHT = window.innerHeight;  

var maxFreq = 6000; var maxVol = 0.02;  
var initialFreq = 3000; var initialVol = 0.001;  
// set options for the oscillator  
oscillator.type = 'square'; 
oscillator.frequency.value = initialFreq; // value in hertz 
oscillator.detune.value = 100; // value in cents 
oscillator.start(0);  
oscillator.onended = function() {   
    console.log('Your tone has now stopped playing!'); 
}  

gainNode.gain.value = initialVol;  
// Mouse pointer coordinates  
var CurX; var CurY;  
// Get new mouse pointer coordinates when mouse is moved 
// then set new gain and pitch values  
//document.onmousemove = updatePage; 
//PARAMETER MAPPING - pitch + loudness
function updatePage(e) {     
    KeyFlag = false;      
    CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);     
    CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);          
    oscillator.frequency.value = (CurX/WIDTH) * maxFreq;     
    gainNode.gain.value = (CurY/HEIGHT) * maxVol;      
}  

//AUDIFICATION - pitch (direct mapping)
