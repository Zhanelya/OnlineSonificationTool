// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();   
var base_a4 = 440; // set A4=440Hz
var minFreq = 27.5; // create min frequency 
var maxFreq = 2000; // create max frequency 
var minLoudness = 0.1; // create min loudness 
var maxLoudness = 1.0; // create max loudness 
var play = true; //flag for play/pause
var timeouts = []; //store timeouts to allow stop button clear scheduled sounds
var soundDuration = 500;
var scheduled;
$(document).ready(function(){
    if(document.getElementById("colCount") &&                  //if file was loaded
      (document.getElementById("colCount").innerHTML > 0)){    //if file contains at least 1 column
         start();
      }
    //to prevent buttons from highlighting (bootstrap-specific)  
    $('.btn').click(function() { this.blur() }) 
});

function start(){
    var data = getData();
    
    scheduled = new Array();
    for (i=0;i<data.colCount;i++){scheduled.push(new Array());} 
    
    $("#audification").click(function(){
        audification(data);
    });
    $("#pm_frequency").click(function(){
        pm_frequency(data);
    });
    $("#pm_loudness").click(function(){
        pm_loudness(data);
    });
    $('#stop').click(function(){
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        for (var i = 0; i < scheduled.length; i++) {
            scheduled[i] = [];
        }
    });
    $('#pause').click(function(){
        play = false;
    });
    $('#play').click(function(){
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        play = true;
        replay_scheduled();
    });
}

function getData(){
    data = {}; //initialise return value
    
    var colCount = document.getElementById("colCount").innerHTML; //get number of columns
    var rowCount = document.getElementById("rowCount").innerHTML; //get number of rows
    
    var dataVals = new Array(colCount);     //colCount-D array with all values for each column
    for (i=0;i<colCount;i++){dataVals[i]=new Array();} //initialise array for each column
    
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
    data.rowCount = rowCount;
    data.dataVals = dataVals;
    data.maxDataVals = maxDataVals;
    data.minDataVals = minDataVals;
    
    return data;
}

/* audification (direct mapping of data to pitch/frequency) */
function audification(data){
    play = true;
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetAudification(data);
    for(i = 0; i < data.colCount; i++){
        colData = data.dataVals[i];
        for (var k = 0; k < colData.length; k++) {
            (function() {
                var element = colData[k];
                var index = i;
                var freq = element + offset;
                scheduled[index].push(freq);      //schedule sounds   
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            playFrequency(freq,soundDuration);
                            scheduled[index].shift();  //remove played sounds from schedule
                        }
                    }, k * soundDuration));
                    
            })(k);
        }
    }
    scheduled[data.colCount]='audification';
}
/* parameter mapping - loudness */
function pm_frequency(data){
    play = true;
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPMFrequency(data);
    for(i = 0; i < data.colCount; i++){
        colMax = data.maxDataVals[i];
        colData = data.dataVals[i];
        for (var k = 0; k < colData.length; k++) {
            (function() {
                    var max = colMax;
                    var element = colData[k];
                    var index = i;
                    var freq = closestMidi((element/max) * maxFreq + offset);
                    scheduled[index].push(freq);     //schedule sounds   
                    timeouts.push(setTimeout(function () {
                        if(play === true) {
                            playFrequency(freq,soundDuration); 
                            scheduled[index].shift(); //remove played sounds from schedule
                        }
                    }, k*soundDuration));
            })(k);
        }
    } 
    scheduled[data.colCount]='pm_frequency';
}

/* parameter mapping - frequency */
function pm_loudness(data){
    play = true;
    for(i = 0; i < data.colCount; i++){
        colMax = data.maxDataVals[i];
        colData = data.dataVals[i];
        for (var k = 0; k < colData.length; k++) {
        (function() {
                    var max = colMax;
                    var element = colData[k];
                    var index = i;
                    var loudness = (element/max) * maxLoudness;
                    var freqOffset = base_a4*index;
                    var val = {freqOffset:freqOffset,loudness:loudness};
                    scheduled[index].push(val);     //schedule sounds   
                    timeouts.push(setTimeout(function () {
                        if(play === true) {
                            playLoudness(freqOffset,loudness,soundDuration); 
                            scheduled[index].shift(); //remove played sounds from schedule
                        }
                    }, k*soundDuration));
            })(k);
        }
    } 
    scheduled[data.colCount]='pm_loudness';
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

function calculateOffsetAudification(data){
    possibleMin = Number.MAX_VALUE;
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        if(colMin < possibleMin) possibleMin = colMin;
    }
    //represent data minimum as A4 frequency
    if (possibleMin <= base_a4){
        offset = base_a4 - possibleMin;
    }else{
        offset = -(possibleMin - base_a4);
    } 
    return offset;
}

function calculateOffsetPMFrequency(data){
    possibleMin = Number.MAX_VALUE;
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        colMax = data.maxDataVals[i];
        possibleVal = (colMin/colMax)*maxFreq;
        if(possibleVal < possibleMin) possibleMin = possibleVal;
    }
    //represent data minimum as  minimum frequency (Hz) i.e. A0
    if (possibleMin <= minFreq){
        offset = minFreq - possibleMin;
    }else{
        offset = -(possibleMin - minFreq);
    } 
    return offset;
}

function playFrequency(freq, duration) { 
    var attack = 5,
        gain = audioCtx.createGain(), 
        osc = audioCtx.createOscillator(); 

    gain.connect(audioCtx.destination); 
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);

    osc.frequency.value = freq;
    osc.type = "sine";
    osc.detune = 100;
    osc.connect(gain); 
    osc.start(0);

    setTimeout(function() { 
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audioCtx.destination);
    }, duration);
}

function playLoudness(freqOffset,loudness, duration) { 
    var attack = 5,
        gain = audioCtx.createGain(), 
        osc = audioCtx.createOscillator(); 

    gain.connect(audioCtx.destination); 
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(loudness, audioCtx.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);
    osc.frequency.value = base_a4 + freqOffset;
    osc.type = "sine";
    osc.detune = 100;
    osc.connect(gain); 
    osc.start(0);

    setTimeout(function() { 
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audioCtx.destination);
    }, duration)
}
function replay_scheduled(){
    //depending on the sonification type, use different replays
    play = true;
    for(i = 0; i < data.colCount; i++){
        colData = scheduled[i];
        for (var k = 0; k < colData.length; k++) {
            (function() {
                var element = colData[k];
                var index = i;
                var val = element;
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            if(scheduled[data.colCount]==='pm_loudness'){
                                freqOffset = val.freqOffset;
                                loudness = val.loudness;
                                playLoudness(freqOffset,loudness,soundDuration);
                            }else{  //audification or pm_frequency
                                freq = val;
                                playFrequency(freq,soundDuration);
                            }
                            
                            scheduled[index].shift();
                        }
                    }, k * soundDuration));
            })(k);
        }
    }
}