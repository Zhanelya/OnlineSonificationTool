/* Zhanelya Subebayeva */
// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();   
var base_a4 = 440; // set A4=440Hz (min frequency)
var maxFreq = 2000; // set max frequency 
var minLoudness = 0.1; // set min loudness 
var maxLoudness = 1.0; // set max loudness 
var soundLoudness = 0.3; //default single sound loudness
var soundDuration = 500; //default single sound duration
var numericData; //flag to check if all data is numeric
var play = true; //flag for play/pause
var reverse = false; //flag for reversed play
var scheduled = []; //store sounds scheduled to play (to enable pause/play)
var timeouts = []; //store timeouts (to allow stop button clear scheduled sounds)
var repeat = 0; //flag for looping on/off

$(document).ready(function(){
    if(document.getElementById("colCount") &&                  //if file was loaded
      (document.getElementById("colCount").innerHTML > 0)){    //if file contains at least 1 column
         start();
      }
    //to prevent buttons from highlighting (bootstrap-specific)  
    $('.btn').click(function() { this.blur(); });  
    //to fadeout errors once the user has seen them
    document.onmousemove = function () {
        $('.err').fadeOut(3500);
    };  
});
    
/* Initialise script */
function start(){
    var data = getData();
    
    scheduled = new Array();
    for (i=0;i<data.colCount;i++){scheduled.push(new Array());} 
    
    $("#audification").click(function(){
        soundDuration = 500;
        reverse = false;
        audification();
    });
    $("#pm_frequency").click(function(){
        soundDuration = 500;
        reverse = false;
        pm_frequency();
    });
    $("#pm_loudness").click(function(){
        soundDuration = 500;
        reverse = false;
        pm_loudness();
    });
    $('#play').click(function(){
        reverse = false;
        play = true;
        soundDuration = 500;
        resumeSoundPattern();
    });
    $('#pause').click(function(){
        play = false;
    });
    $('#stop').click(function(){
        clearTimeoutsQueue();
        for (var i = 0; i < scheduled.length; i++) {
            if(i<(scheduled.length-1)){
               scheduled[i] = []; 
            }else{
               scheduled[i] = ''; //last element of scheduled stored string value of sonification type
            }
        }
    });
    $('#reverse').click(function(){
        reverse = true;
        play = true;
        soundDuration = 500;
        resumeSoundPattern();
    });
    $('#bwd').click(function(){
        reverse = true;
        play = true;
        soundDuration = 250;
        resumeSoundPattern();
    });
    $('#fwd').click(function(){
        reverse = false;
        play = true;
        soundDuration = 250;
        resumeSoundPattern();
    });
    $('#repeat').click(function(){
        if(repeat === 0){
            repeat = 1;
            $(this).addClass('active');
        }else{
            repeat = 0;
            $(this).removeClass('active');
        }
    });
}

/* Get data from DOM elements and store it in a multi-D array */
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
        if(parseFloat(this.innerHTML) < minDataVals[colNo]) minDataVals[colNo] = parseFloat(this.innerHTML);
        if(parseFloat(this.innerHTML) > maxDataVals[colNo]) maxDataVals[colNo] = parseFloat(this.innerHTML);

        dataVals[colNo].push(parseFloat(this.innerHTML));
    });
    
    data.colCount = colCount;
    data.rowCount = rowCount;
    data.dataVals = dataVals;
    data.maxDataVals = maxDataVals;
    data.minDataVals = minDataVals;
    
    return data;
}

/* Audification (direct mapping of data to pitch/frequency) */
function audification(){
    play = true;
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetAudification();
    scheduled[data.colCount]='audification';
    playSoundPattern(offset);
}

/* Parameter mapping - frequency */
function pm_frequency(){
    play = true;
    scheduled[data.colCount]='pm_frequency';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPMFrequency();
    playSoundPattern(offset);
}

/* Parameter mapping - loudness */
function pm_loudness(){
    play = true;
    scheduled[data.colCount]='pm_loudness';
    playSoundPattern();
}

/* Calculate the offset needed for audification in order to 
 * fit the sound pattern into reasonable audible range */
function calculateOffsetAudification(){
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

/* Calculate the offset needed for parameter mapping with a use of frequency 
 * in order to fit the sound pattern into reasonable audible range */
function calculateOffsetPMFrequency(){
    possibleMin = Number.MAX_VALUE;
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        colMax = data.maxDataVals[i];
        possibleVal = (colMin/colMax)*maxFreq;
        if(possibleVal < possibleMin) possibleMin = possibleVal;
    }
    //represent data minimum as  minimum frequency (Hz) i.e. A0
    if (possibleMin <= base_a4){
        offset = base_a4 - possibleMin;
    }else{
        offset = -(possibleMin - base_a4);
    } 
    return offset;
}

/* Play a sound pattern (implements different approaches for different sonification types) */
function playSoundPattern(offset){
    offset = typeof offset !== 'undefined' ? offset : 0; //set default param value
    //check if the data values are numeric
    numericData = 1;
    for (var x = 0; x < data.colCount ;x++){
        for (var y = 0; y < data.dataVals[x].length; y++){
            if(!$.isNumeric(data.dataVals[x][y])){
                numericData = 0;
            }
        }
    }
    if(numericData === 1){ 
        for(var i = 0; i < data.colCount; i++){
            colData = data.dataVals[i];
            if(scheduled[data.colCount]==='pm_frequency'||
               scheduled[data.colCount]==='pm_loudness'){
                colMax = data.maxDataVals[i]; // to be used for parameter mapping
            }
            for (var k = 0; k < colData.length; k++) {
                (function() {
                    if(scheduled[data.colCount]==='pm_frequency'||
                        scheduled[data.colCount]==='pm_loudness'){
                        var max = colMax; // to be used for parameter mapping
                    }
                    var element = colData[k];
                    var index = i;
                    if(scheduled[data.colCount]==='audification'){
                        var freq = element + offset;
                        var val = freq;
                    }else if(scheduled[data.colCount]==='pm_frequency'){
                        var freq = closestMidi((element/max) * maxFreq + offset);
                        var val = freq;
                    }else if(scheduled[data.colCount]==='pm_loudness'){
                        var loudness = (element/max) * maxLoudness;
                        var freqOffset = base_a4*index;
                        var val = {freqOffset:freqOffset,loudness:loudness};
                    }    
                    scheduled[index].push(val);      //schedule sounds   
                        timeouts.push(setTimeout(function() { 
                            if(play === true) {
                                if(scheduled[data.colCount]==='pm_frequency'||
                                    scheduled[data.colCount]==='audification'){
                                    if(reverse){
                                        //if reverse is on, play from last to first
                                        freq = scheduled[index][scheduled[index].length-1];
                                        playSound(freq,soundLoudness,soundDuration);
                                    }else{
                                        //if reverse is off, play from first to last
                                        playSound(freq,soundLoudness,soundDuration);
                                    }
                                }else if(scheduled[data.colCount]==='pm_loudness'){
                                    playSound(freqOffset,loudness,soundDuration); 
                                }  
                                //remove played sounds from schedule
                                if(reverse){
                                    scheduled[index].pop();
                                }else{
                                    scheduled[index].shift();
                                }
                                //scheduled[index].shift();
                                if(repeat){loop(index);}
                            }
                        }, k * soundDuration));

                })(k);
            }
        } 
    }else{
        $('#errContainer').append('<div class="col-md-4 err">Error. Please upload a file with numerical data</div>');
    }
}

/* Find closest frequency corresponding to a MIDI note*/
function closestMidi(freq){
    return (midiToFreq(freqToMidi(freq)));
}

/* Convert frequency to MIDI note number */
function freqToMidi(freq){
    /* http://newt.phys.unsw.edu.au/jw/notes.html */
    return Math.round(12 * Math.log2(freq/base_a4));;
}

/* Convert MIDI note number to frequency */
function midiToFreq(midi){
    /* http://newt.phys.unsw.edu.au/jw/notes.html */
    return base_a4 * Math.pow(2,(midi)/12);
}

/* Resume playing sound after pause/play were pressed */
function resumeSoundPattern(){
    clearTimeoutsQueue(); //clear js events queue to eliminate sound overlaps
    //depending on the sonification type, use different replays of scheduled sounds
    play = true;
    for(i = 0; i < data.colCount; i++){
        colData = scheduled[i];
        for (var k = 0; k < colData.length; k++) {
            (function() {
                if(reverse){
                    var element = colData[colData.length-1-k];
                }else{
                    var element = colData[k];
                }
                var index = i;
                var val = element;
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            if(scheduled[data.colCount]==='pm_loudness'){
                                freqOffset = val.freqOffset;
                                loudness = val.loudness;
                                playSound(freqOffset,loudness,soundDuration);
                            }else{  //audification or pm_frequency
                                freq = val;
                                playSound(freq,soundLoudness,soundDuration);
                            }
                            if(reverse){
                                scheduled[index].pop();
                            }else{
                                scheduled[index].shift();
                            }
                            if(repeat){loop(index);}
                        }
                    }, k * soundDuration));
            })(k);
        }
    }
}

/* Clear js events queue, which is triggering sounds */
function clearTimeoutsQueue(){
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
}

/* Repeat if repeat is on */
function loop(index){
    if(scheduled[index].length === 0){ //if finished pattern (no more scheduled sounds)
        setTimeout(function(){
            //call a sonification function (audification/pm_frequency/pm_loudness)
            try{
                eval(scheduled[scheduled.length - 1]+"()"); 
            }catch(err){}
        }, soundDuration);
    }
}

/* Play a single sound */
function playSound(freq, loudness, duration){
    var attack = 5,
        gain = audioCtx.createGain(), 
        osc = audioCtx.createOscillator(); 

    gain.connect(audioCtx.destination); 
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(loudness, audioCtx.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);

    if(scheduled[data.colCount]==='pm_frequency'||
       scheduled[data.colCount]==='audification'){
        osc.frequency.value = freq;
    }else if(scheduled[data.colCount]==='pm_loudness'){
        osc.frequency.value = base_a4 + freq; //add offset to differentiate columns
    }
    
    osc.type = "sine";
    osc.detune = 0;
    osc.connect(gain); 
    osc.start(0);

    setTimeout(function() { 
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audioCtx.destination);
    }, duration);
}
