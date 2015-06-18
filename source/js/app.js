var base_a4 = 440; // set A4=440Hz
// create initial frequency and volume values 
var maxFreq = 2000; 
var initialVol = 0.00;  
var defaultVol = 0.01;

$(document).ready(function(){
    if(document.getElementById("count") &&                  //if file was loaded
      (document.getElementById("count").innerHTML > 0)){    //if file contains at least 1 column
         start();
      }
});

function start(){
    var data = getData();
    console.log(data); 
    
    // create web audio api context 
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();  
    // create oscillator & gain node 
    var oscillator = audioCtx.createOscillator(); 
    var gainNode = audioCtx.createGain();  
    // connect oscillator & gain node to speakers  
    oscillator.connect(gainNode); 
    gainNode.connect(audioCtx.destination); 
    
    $("#audification").click(function(){
        audification(oscillator,gainNode,data);
    });
    
}

function getData(){
    data = {}; //initialise return value
    
    var colCount = document.getElementById("count").innerHTML; //get number of columns
   
    var dataVals = new Array(colCount);     //colCount-D array with all values for each column
    for (i=0;i<3;i++){dataVals[i]=new Array();} //initialise array for each column
    
    var maxDataVals = new Array(colCount);  //array for max values in each column
    for (var i = 0; i < colCount; i++) maxDataVals[i] = Number.MIN_VALUE;
    var minDataVals = new Array(colCount);  //array for min values in each column
    for (var i = 0; i < colCount; i++) minDataVals[i] = Number.MAX_VALUE;
    
    $('[class*="value"]').each(function(){
        var classList = this.className.split(/\s+/);        //for every table value retrieve classlist
        var colNo = (classList[1]).split('-')[1];           //column number
        if(parseInt(this.innerHTML) < minDataVals[colNo]) minDataVals[colNo] = parseInt(this.innerHTML);
        if(parseInt(this.innerHTML) > maxDataVals[colNo]) maxDataVals[colNo] = parseInt(this.innerHTML);

        dataVals[colNo].push(parseInt(this.innerHTML));
    });
    
    data.colCount = colCount;
    data.dataVals = dataVals;
    data.maxDataVals = maxDataVals;
    data.minDataVals = minDataVals;
    
    return data;
}

/* audification (direct mapping of data to pitch/frequency) */
function audification(oscillator,gainNode,data){
    // set options for the oscillator  
    // sine wave sounds as the least obtrusive, 
    // may extend with user choice of 
    // square/sine/etc. wave types
    oscillator.type = 'sine';  
    oscillator.frequency.value = base_a4; // value in hertz 
    oscillator.detune.value = 200; // value in cents 
    try{oscillator.start(0);
    }catch(err){}
      
    gainNode.gain.value = initialVol;
    
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffset(data, maxFreq);
    
    for(i = 0; i < data.colCount; i++){
            //sleep(200);
            colMax = data.maxDataVals[i];
            colMin = data.minDataVals[i];
            colData = data.dataVals[i];
           
            $(colData).each(function(index){
                sound = closestMidi((this/colMax) * maxFreq + offset);
                oscillator.frequency.value = sound; 
                gainNode.gain.value = defaultVol;
              //  sleep(100);
            });
    }
    
}

/* parameter mapping - loudness */
function pm_frequency(oscillator,gainNode,data){
    
}

/* parameter mapping - frequency */
function pm_loudness(oscillator,gainNode,data){
    
    // create initial theremin frequency and volumn values 
    var WIDTH = window.innerWidth; 
    var HEIGHT = window.innerHeight;  

    var maxFreq = 6000; var maxVol = 0.02;  
    // set options for the oscillator  
    oscillator.type = 'square'; 
    oscillator.frequency.value = base_a4; // value in hertz 
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
    
    document.onmousemove = updatePage; 

    function updatePage(e) {     
        KeyFlag = false;      
        CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);     
        CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);          
        oscillator.frequency.value = (CurX/WIDTH) * maxFreq;     
        gainNode.gain.value = (CurY/HEIGHT) * maxVol;      
    }  
}

function closestMidi(freq){
    return (midiToFreq(freqToMidi(freq)));
}
function freqToMidi(freq){
    /* http://newt.phys.unsw.edu.au/jw/notes.html */
    midi = Math.round(12 * Math.log2(freq/base_a4));
    return midi;
}
function midiToFreq(midi){
    /* http://newt.phys.unsw.edu.au/jw/notes.html */
    freq = base_a4 * Math.pow(2,(midi)/12);
    return freq;
}

function calculateOffset(data, maxFreq){
    possibleMin = Number.MAX_VALUE;
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        colMax = data.maxDataVals[i];
        possibleVal = (colMin/colMax)*maxFreq;
        if(possibleVal < possibleMin) possibleMin = possibleVal;
    }
    //represent data minimum as 27.5Hz i.e. A0
    offset = Math.abs(27.5 - possibleMin); 
    return offset;
}

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while(new Date().getTime() < unixtime_ms + ms) {}
}
