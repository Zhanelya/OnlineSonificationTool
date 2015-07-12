/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var userDataUnitX = "Row number",
    userDataUnitY = "Data unit";
    userDataPointSize = 10;
    
/* Draw a graph */
function initGraph () { 
    if(numericData === 1){
        $( "#slider" ).slider({
            max: 18,
            min: 2,
            step: 1,
            value: 10
          });

        var graphData = getGraphData();
        $('#graph-container').highcharts({
            series: graphData,
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
                                playMBS(this.y);
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

/* Format data into graph data object */
function getGraphData(){
    var graphData = new Array();
    for(var i=0; i<data.colCount; i++){
        graphData.push({name: data.colNames[i],
                        data: data.dataVals[i]});
    }
    return graphData;
}

/* Play a sound corresponding to the point value  
 * that was pressed by the user on the graph */
function playMBS(dataVal){
    var offset = calculateOffsetMBS();

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

    osc.frequency.value = getFreq(dataVal) + offset;

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

/* Transform data point value into the corresponding frequency
 * with a use of a parameter mapping technique */
function getFreq(dataVal){
    //find max data value
    var max = Number.MIN_VALUE;
    for(var k=0; k< data.colCount; k++){
        colMax = data.maxDataVals[k];
        if(max < colMax) max = colMax;
    }
    return closestMidi((dataVal/max) * maxFreq + offset);
}

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


