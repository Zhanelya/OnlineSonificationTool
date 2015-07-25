/* Zhanelya Subebayeva */
// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();   

var base_a4 = 440; // set A4=440Hz
var minFreq = 440; // min frequency
var maxFreq = 1200; // set max frequency (frequency may still take higher values due to offset)
var freqDifference = 50; // to ease distinguishing columns in PM using loudness

var soundLoudness = 0.5; //default single sound loudness
var minLoudness = 0.1; // set min loudness 
var maxLoudness = 1.0; // set max loudness (loudness may still take higher values due to offset)

var soundDuration = 700; //default single sound duration
var singleSpeedDuration = 700; //default single sound duration for normal speed
var doubleSpeedDuration = 350; //default single sound duration for double speed (e.g. fast forward)
var minDuration = 50; // set min duration 

var waveshapes = ["sine","triangle","sawtooth","square"]; //differentiate waveforms

var play = true; //flag for play/pause
var reverse = false; //flag for reversed play
var timeouts = []; //store timeouts (to allow stop button clear scheduled sounds)
var repeat = 0; //flag for looping on/off
var columnwise = 0; //flag for columnwise data flow
var rowwise = 0; //flag for rowwise data flow
var scheduled = []; //store sounds scheduled to play (to enable pause/play)

var numericData; //flag to check if all data is numeric
var data; //data array
var numericData = 0;

/* Initialise script */
$(document).ready(function(){
    if(document.getElementById("colCount") &&                  //if file was loaded
      (document.getElementById("colCount").innerHTML > 0)){    //if file contains at least 1 column
         start();     //in app.js
         initGraph(); //in graph.js
      }
    //to prevent buttons from highlighting (bootstrap-specific)  
    $('.btn').click(function() { this.blur(); });  
    //to fadeout errors once the user has seen them
    document.onmousemove = function () {
        $('.err').fadeOut(5000);
    };  
    //if user leaves the tab, pause the sound flow
    window.onblur = function () {
        if($('.sonification').hasClass('active')){
            $('#pause').click();
        }
    };
});
    
/* Prepare data and initialise sonification buttons */
function start(){
    data = getData();
    isDataNumeric();
         
    $("#audification").click(function(){
        activateSonificationBtn('audification');
    });
    $("#pm_frequency").click(function(){
        activateSonificationBtn('pm_frequency');
    });
    $("#pm_duration").click(function(){
        activateSonificationBtn('pm_duration');
    });
    $("#pm_loudness").click(function(){
        activateSonificationBtn('pm_loudness');
    });
    $("#pm_space").click(function(){
        activateSonificationBtn('pm_space');
    });
    $("#pm_frequency_space").click(function(){
        activateSonificationBtn('pm_frequency_space');
    });
    $('#play').click(function(){
        activateControlsBtn('play');
        
        reverse = false;
        play = true;
        soundDuration = singleSpeedDuration;
        resumeSoundPattern();
    });
    $('#pause').click(function(){
        activateControlsBtn('pause');
        clearTimeoutsQueue();
        play = false;
    });
    $('#stop').click(function(){
        clearBtns();
        clearTimeoutsQueue();
        initScheduledSounds();
    });
    $('#reverse').click(function(){
        activateControlsBtn('reverse');
        
        reverse = true;
        play = true;
        soundDuration = singleSpeedDuration;
        resumeSoundPattern();
    });
    $('#bwd').click(function(){
        activateControlsBtn('bwd');
        
        reverse = true;
        play = true;
        soundDuration = doubleSpeedDuration;
        resumeSoundPattern();
    });
    $('#fwd').click(function(){
        activateControlsBtn('fwd');
        
        reverse = false;
        play = true;
        soundDuration = doubleSpeedDuration;
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
    $('#simultaneous').click(function(){
       rowwise = 0; 
       columnwise = 0;
       $('#stop').click();
       activateSoundFlowBtn('simultaneous');
    });
    $('#columnwise').click(function(){
       rowwise = 0;
       columnwise = 1;
       $('#stop').click();
       activateSoundFlowBtn('columnwise');
    });
    $('#rowwise').click(function(){
       rowwise = 1; 
       columnwise = 0;
       $('#stop').click();
       activateSoundFlowBtn('rowwise');
    });
}

/* Get data from DOM elements and store it in a multi-D array */
function getData(){
    data = {}; //initialise return value
    
    var colCount = document.getElementById("colCount").innerHTML; //get number of columns
    var rowCount = document.getElementById("rowCount").innerHTML; //get number of rows
    
    var colNames = new Array();
    
    var dataVals = new Array();     //colCount-D array with all values for each column
    for (i=0;i<colCount;i++){dataVals[i]=new Array();} //initialise array for each column
    
    var maxDataVals = new Array();  //array for max values in each column
    for (var i = 0; i < colCount; i++) maxDataVals[i] = Number.MIN_VALUE;
    var minDataVals = new Array();  //array for min values in each column
    for (var i = 0; i < colCount; i++) minDataVals[i] = Number.MAX_VALUE;
    
    $('[class*="value"]').each(function(){
        var classList = this.className.split(/\s+/);        //for every table value retrieve classlist
        var colNo = (classList[1]).split('-')[1];           //column number
        if(parseFloat(this.innerHTML) < minDataVals[colNo]) minDataVals[colNo] = parseFloat(this.innerHTML);
        if(parseFloat(this.innerHTML) > maxDataVals[colNo]) maxDataVals[colNo] = parseFloat(this.innerHTML);

        dataVals[colNo].push(parseFloat(this.innerHTML));
    });
    
    $('[class*="name"]').each(function(){
        var colNo = this.className.split('-')[1];           //column number
        colNames[colNo] = this.innerHTML;
    });
    
    data.colNames = colNames;
    data.colCount = colCount;
    data.rowCount = rowCount;
    data.dataVals = dataVals;
    data.maxDataVals = maxDataVals;
    data.minDataVals = minDataVals;
    
    var max = Number.MIN_VALUE;
    for(var k=0; k< data.colCount; k++){
        colMax = data.maxDataVals[k];
        if(max < colMax) max = colMax;
    }
    data.max = max;
    
    return data;
}

/* check if data is values are numeric */
function isDataNumeric(){
    numericData = 1;
    for (var x = 0; x < data.colCount ;x++){
        for (var y = 0; y < data.dataVals[x].length; y++){
            if(!$.isNumeric(data.dataVals[x][y])){
                numericData = 0;
            }
        }
    }
}

/* Highlight sonification button and launch the corresponding sonification technique */
function activateSonificationBtn(btn){
    if($('.soundflow').hasClass('active') || (data.colCount === "1")){
        $('.sonification').removeClass('active');
        $('#'+btn).addClass('active');
        activateControlsBtn('play');
        
        soundDuration = singleSpeedDuration;
        reverse = false;
        clearTimeoutsQueue();
        initScheduledSounds();

        eval(btn+"()"); //call the function corresponding to sonification technique
    }else{
        $('#errContainer').append('<div class="col-md-12 err">Error. Please choose simultaneous or columnwise sonification</div>');
    }
}

/* Highlight controls button */
function activateControlsBtn(btn){
    //activate controls only if one of the sonification methods was selected
    if($('.sonification').hasClass('active')){
        $('.controls').removeClass('active');
        $('#'+btn).addClass('active');
    }else{
        $('#errContainer').append('<div class="col-md-12 err">Error. Please choose sonification technique first </div>');
    }
}

/* Highlight the button reponsible for simultaneous/columnwise playing */
function activateSoundFlowBtn(btn){
    $('.soundflow').removeClass('active');
    $('#'+btn).addClass('active');
}

/* Clear all active buttons including enabled repeat */
function clearBtns(){
    $('.controls').removeClass('active');
    $('.sonification').removeClass('active');
    
    //deactivate repeat
    repeat = 0;
    $('#repeat').removeClass('active');
    
    //set sound Duration back to default
    soundDuration = singleSpeedDuration;
}   

/* Clear js events queue, which is triggering sounds */
function clearTimeoutsQueue(){
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
}

/* Initialise/clear the array of schediled sounds */
function initScheduledSounds(){
    scheduled = new Array();
    for (i=0;i<data.colCount;i++){scheduled.push(new Array());} 
}

/* Audification (direct mapping of data to pitch/frequency) */
function audification(){
    play = true;
    scheduled[data.colCount]='audification';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetAudification();
    playSoundPattern(offset);
}

/* Parameter mapping - frequency */
function pm_frequency(){
    play = true;
    scheduled[data.colCount]='pm_frequency';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPM();
    playSoundPattern(offset);
}

/* Parameter mapping - frequency */
function pm_duration(){
    play = true;
    scheduled[data.colCount]='pm_duration';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPM();
    playSoundPattern(offset);
}

/* Parameter mapping - loudness */
function pm_loudness(){
    play = true;
    scheduled[data.colCount]='pm_loudness';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPM();
    playSoundPattern(offset);
}

/* Parameter mapping - space */
function pm_space(){
    play = true;
    scheduled[data.colCount]='pm_space';
    playSoundPattern();
}

/* Parameter mapping - space */
function pm_frequency_space(){
    play = true;
    scheduled[data.colCount]='pm_frequency_space';
    //offset if the value is below or above reasonable hearable range
    offset = calculateOffsetPM();
    playSoundPattern(offset);
}

/* Calculate the offset needed for audification in order to 
 * fit the sound pattern into reasonable audible range 
 * (to be equal or above of the predefined minimum frequency)*/
function calculateOffsetAudification(){
    possibleMin = Number.MAX_VALUE;
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        if(colMin < possibleMin) possibleMin = colMin;
    }
    //represent data minimum as A4 frequency
    if (possibleMin <= minFreq){
        offset = minFreq - possibleMin;
    }else{
        offset = -(possibleMin - minFreq);
    } 
    return offset;
}

/* Calculate the offset needed for parameter mapping
 * in order to fit the sound pattern into reasonable audible range
 * (to be equal or above of the predefined minimum parameter value) */
function calculateOffsetPM(){
    var possibleMin = Number.MAX_VALUE;
    if(scheduled[data.colCount]==='pm_frequency'||
       scheduled[data.colCount]==='pm_frequency_space'){
        maxParam = maxFreq;
        minParam = minFreq;
    }else if(scheduled[data.colCount]==='pm_duration'){
        maxParam = soundDuration;
        minParam = minDuration;
    }else if(scheduled[data.colCount]==='pm_loudness'){
        maxParam = maxLoudness;
        minParam = minLoudness;
    }
    //find possible min parameter value within the data
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        possibleVal = (colMin/data.max)*maxParam;
        if(possibleVal < possibleMin) possibleMin = possibleVal;
    }
    //represent data minimum as a predefined minimum parameter value
    if (possibleMin <= minParam){
        offset = minParam - possibleMin;
    }else{
        offset = -(possibleMin - minParam);
    } 
    return offset;
}

/* Play a sound pattern (implements different approaches for different sonification techniques) */
function playSoundPattern(offset){
    offset = typeof offset !== 'undefined' ? offset : 0; //set default param value
    if(numericData === 1){ 
        for(var i = 0; i < data.colCount; i++){
            colData = data.dataVals[i];
            for (var k = 0; k < colData.length; k++) {
                (function() {
                    /* schedule sound to play */
                    var element = colData[k];
                    var colNo = i;
                    var rowNo = k;
                    if(scheduled[data.colCount]==='audification'){
                        var freq = element + offset;
                        var val = {value:element,freq:freq};
                    }else if(scheduled[data.colCount]==='pm_frequency'){
                        var freq = closestMidi((element/data.max) * maxFreq + offset); //mapping to frequency
                        var val = {value:element,freq:freq};
                    }else if(scheduled[data.colCount]==='pm_duration'){
                        var duration = (element/data.max) * soundDuration + offset; //mapping to duration
                        var freqOffset = freqDifference*colNo;
                        var val = {value:element,freqOffset:freqOffset,duration:duration};
                    }else if(scheduled[data.colCount]==='pm_loudness'){ 
                        var loudness = (element/data.max) * maxLoudness + offset; //mapping to loudness
                        var freqOffset = freqDifference*colNo;
                        var val = {value:element,freqOffset:freqOffset,loudness:loudness};
                    }else if(scheduled[data.colCount]==='pm_space'){
                        var panningX= (element/data.max*20) -10; //mapping to panning
                        ////range of panning is from -10 to +10, hence 20,
                        //offset is -10 to set it alternating around 0
                        var freqOffset = freqDifference*colNo;
                        var val = {value:element,freqOffset:freqOffset, panningX:panningX};
                    }else if(scheduled[data.colCount]==='pm_frequency_space'){
                        var panningX= (element/data.max*20) -10; //mapping to panninf
                        var freq = closestMidi((element/data.max) * maxFreq + offset); //mapping to frequency
                        var val = {value:element,freq:freq, panningX:panningX};
                    } 
                    scheduled[colNo].push(val); //add sound to schedule   
                    /* play scheduled  sounds */
                    var t = calculateTimeout(colNo,rowNo);
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            sonifySound(colNo);
                            if(repeat && finished()){loop();}
                            if(!repeat && finished()){clearBtns();} 
                        }
                    }, t));
                })(k);
            }
        } 
    }else{
        $('#errContainer').append('<div class="col-md-12 err">Error. Please upload a file with numerical data</div>');
    }
}
/* Calculate timelapse before every sound is played */
function calculateTimeout(colNo,rowNo){
    var t = 0;
    if(!columnwise && !rowwise){
        t = rowNo * soundDuration; //play values from all columns for every row
    }else if(columnwise){
        t = ((colNo*colData.length)+rowNo) * soundDuration; //play a value from 1st column for every row, then start the next column
    }else if(rowwise){
        t = ((rowNo*data.colCount) + colNo) * soundDuration; //play values from the 1st row for every column, then start the next row
    }  
    return t;
}

/* Get sound parameters from the queue of sounds,
 * pass parameters to the sound playing routine, and
 * remove the played sounds from the queue/schedule*/
function sonifySound(colNo){
    try{
        //retrieve sound value from queue/schedule
        if(reverse){
            col = scheduled[colNo]; 
            var playVal = col[col.length-1];//get last element
        }else{
            col = scheduled[colNo]; 
            var playVal = col[0]; //get first element 
        }
        //play sound with different parameters for each sonification type
        if(scheduled[data.colCount]==='pm_frequency'||
            scheduled[data.colCount]==='audification'){
            playSound(colNo,playVal.freq,soundLoudness);
        }else if(scheduled[data.colCount]==='pm_duration'){
            playSound(colNo,playVal.freqOffset,soundLoudness,0,playVal.duration); 
        }else if(scheduled[data.colCount]==='pm_loudness'){
            playSound(colNo,playVal.freqOffset,playVal.loudness); 
        }else if(scheduled[data.colCount]==='pm_space'){
            playSound(colNo,playVal.freqOffset,soundLoudness,playVal.panningX); 
        }else if(scheduled[data.colCount]==='pm_frequency_space'){
            playSound(colNo,playVal.freq,soundLoudness,playVal.panningX);
        } 
        //remove played sounds from schedule
        if(reverse){
            scheduled[colNo].pop();
        }else{
            scheduled[colNo].shift();
        }
    }catch(e){}
}
/* Check if one of the columns is still playing, or all the data was sonified */
function finished(){
    var finished = 1;
    for (j = 0; j < scheduled.length-1; j++){
        //if one of the columns is still playing, set finished to false
        if(scheduled[j].length > 0) finished = 0; 
    }
    return finished;
}

/* Repeat if repeat is on */
function loop(){
    setTimeout(function(){
        try{
            //call a sonification function (audification/pm_frequency/pm_loudness)
            //last element  of the scheduled array stores what sonification technique is active
            eval(scheduled[scheduled.length - 1]+"()"); 
        }catch(err){}
    }, soundDuration);
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
    //activate controls only if one of the sonification methods was selected
    if($('.sonification').hasClass('active')){
        clearTimeoutsQueue(); //clear js events queue to eliminate sound overlaps
        //depending on the sonification technique, use different replays of scheduled sounds
        play = true;
        var timeToFinishRow = 0;
        if(rowwise){timeToFinishRow = finishRow();}
        for(i = 0; i < data.colCount; i++){
            colData = scheduled[i];
            for (var k = 0; k < colData.length; k++) {
                (function() {
                    var colNo = i;
                    var rowNo = k;
                    var t = calculateTimeout(colNo,rowNo) + timeToFinishRow;
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            sonifySound(colNo);
                            if(repeat && finished()){loop();}
                            if(!repeat && finished()){clearBtns();}  
                        }
                    }, t));
                })(k);
            }
        }
    }
}
/* Finish playing the current row */
function finishRow(){
    var timeToFinishRow = 0;
    for(i = 0; i < data.colCount; i++){
        if(typeof scheduled[i+1] !== "string" && //if the next element is not a string representing sonification type
           scheduled[i].length < scheduled[i+1].length){//if it was paused before the row finished playing
            //finish playing the current row
            for (j=i+1; j<data.colCount; j++){
                timeToFinishRow += soundDuration;
                (function(){
                    var colNo = j;
                    //play scheduled from the unfinished row
                    timeouts.push(setTimeout(function() { 
                        if(play === true) {
                            sonifySound(colNo);
                        }
                    }, (colNo-(i+1))*soundDuration));
                })(j);  
            }
        }
    }
    return timeToFinishRow;
}

/* Play a single sound
** Spectra and Envelope affect timbre 
** Spectra is controlled by Oscillator wave type (shape) 
** Envelope is controlled by attack, sustain and decay */ 
function playSound(colNo, freq, loudness, panningX, duration){
    panningX = typeof panningX !== 'undefined' ? panningX : 0; //set default param value
    duration = typeof duration !== 'undefined' ? duration : soundDuration; //set default param value
    
    var c = (colNo+1)/data.colCount;

    var attack = c*duration*1/4,
        sustain = c*duration*3/4,
        decay = duration,
        
        gain = audioCtx.createGain(), 
        osc = audioCtx.createOscillator(),
        panner = audioCtx.createPanner(); 
    if(!columnwise){loudness = loudness/(scheduled.length-1);}
    //set loudness (#column times) lower if all columns are played simultaneously
                                    
    gain.connect(audioCtx.destination); 
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(loudness, audioCtx.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(loudness, audioCtx.currentTime + sustain / 1000);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + decay / 1000);
  
    if(scheduled[data.colCount]==='pm_frequency'||
       scheduled[data.colCount]==='audification'||
       scheduled[data.colCount]==='pm_frequency_space'){
        osc.frequency.value = freq;
    }else if(scheduled[data.colCount]==='pm_loudness'||
        scheduled[data.colCount]==='pm_space'||
        scheduled[data.colCount]==='pm_duration'){
        osc.frequency.value = base_a4 + freq; //set frequency to default and add offset (freq) to differentiate columns
    }
    
    osc.type = waveshapes[colNo%4]; //choose 1 of the 4 wave shapes
    osc.detune = 0;
    if(scheduled[data.colCount]==='pm_space'||
       scheduled[data.colCount]==='pm_frequency_space'){
        osc.connect(panner);
        panner.connect(gain);
        panner.setPosition(panningX,1,1);
    }else if(scheduled[data.colCount]==='pm_loudness'||
            scheduled[data.colCount]==='pm_frequency'||
            scheduled[data.colCount]==='pm_duration'||
            scheduled[data.colCount]==='audification'){
        osc.connect(gain);
    }
    osc.start(0);
    
    setTimeout(function() { 
        osc.stop(0);
        if (scheduled[data.colCount]==='pm_space'||
            scheduled[data.colCount]==='pm_frequency_space'){
            panner.disconnect(gain);
            osc.disconnect(panner);
        }else if(scheduled[data.colCount]==='pm_loudness'||
            scheduled[data.colCount]==='pm_frequency'||
            scheduled[data.colCount]==='pm_duration'||
            scheduled[data.colCount]==='audification'){
             osc.disconnect(gain);
        }
        gain.disconnect(audioCtx.destination);
    }, duration);
}