/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var userDataUnitX = "Row number",
    userDataUnitY = "Data unit",
    userDataPointSize = 10;

/* Get user data unit for X axis and redraw the graph */
function getDataUnitX(){
    userDataUnitX = document.getElementById("userDataUnitX").value;
    initGraph();
}
/* Get user data unit for Y axis and redraw the graph */
function getDataUnitY(){
    userDataUnitY = document.getElementById("userDataUnitY").value;
    initGraph();
}

/* Control the slider responsible for the size of the data points */
$(document).ready(function(){
    if(numericData === 1){
        $("#slider").slider({
            slide: function(event, slider) {
                userDataPointSize = slider.value;
                initGraph();
            }
        });
    }
});

/* Draw a graph */
function initGraph () { 
    if(numericData === 1){
        $( "#slider" ).slider({
            max: 18,
            min: 2,
            step: 1,
            value: userDataPointSize
          });

        $('#graph-container').highcharts({
            series: data.graphData,
            title: {
                text: 'Model Based Sonification'
            },
            xAxis: {
                title: {
                    text: userDataUnitX
                }
            },
            yAxis: {
                title: {
                    text: userDataUnitY
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                sonifyMBS(this.y);
                            }
                        }
                    },
                    marker: {
                        enabled: true,
                        radius: userDataPointSize
                    }
                }
            },
        });
    }else{
        $('#topErrContainer').append('<div class="col-md-12 err">Error. Please upload a file with numerical data</div>');
    }
}

/* Transform data point value into the corresponding frequency
 * with a use of a parameter mapping technique */
function sonifyMBS(dataVal){
    var offset = calculateOffsetMBS();
    playMBS(closestMidi((dataVal/data.max) * maxFreq + offset));
}

/* Calculate the offset needed for Model-Based Sonification
 * in order to fit the sound pattern into reasonable audible range
 * (to be equal or above of the predefined minimum parameter value) */
function calculateOffsetMBS(){
    var possibleMin = Number.MAX_VALUE;
    //find possible min parameter value within the data
    for (i = 0; i < data.colCount; i++){
        colMin = data.minDataVals[i];
        possibleVal = (colMin/data.max)*maxFreq;
        if(possibleVal < possibleMin) possibleMin = possibleVal;
    }
    //represent data minimum as a predefined minimum parameter value
    if (possibleMin <= minFreq){
        offset = minFreq - possibleMin;
    }else{
        offset = -(possibleMin - minFreq);
    } 
    return offset;
}

/* Play a sound corresponding to the point value  
 * that was pressed by the user on the graph */
function playMBS(freqVal){
    var attack = soundDuration*1/4,
        sustain = soundDuration*3/4,
        decay = soundDuration,

        gain = audioCtx.createGain(), 
        osc = audioCtx.createOscillator(); 

    gain.connect(audioCtx.destination); 
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(soundLoudness, audioCtx.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(soundLoudness, audioCtx.currentTime + sustain / 1000);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + decay / 1000);

    osc.frequency.value = freqVal;

    osc.type = "sine";
    osc.detune = 0;
    osc.connect(gain);
    osc.start(0);

    setTimeout(function() { 
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audioCtx.destination);
    }, soundDuration);
}


