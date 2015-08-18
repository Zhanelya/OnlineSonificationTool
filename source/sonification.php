<?php 
    session_start();
    /* Zhanelya Subebayeva */
    require_once 'header.php';
?>

    <nav class="navbar navbar-inverse">
           <ul class="nav navbar-nav">
               <li><a href="index.php"><h4>Home</h4></a></li>
               <li class="active"><a href="sonification.php"><h4>Sonification</h4></a></li>
               <li><a href="video.php"><h4>Video</h4></a></li>
               <li><a href="contact.php"><h4>Contact</h4></a></li>
           </ul>
    </nav>
    <div class="wrapper ">
        <div class="container fluid">
            <h1 class="text-center">Sonification<br/>
                <small>Explore Sonification Techniques</small>
            </h1>
            <br/>
            <h3>Supported browsers</h3>
            <div class="row">
                <div class="col-md-2">
                    Desktop
                </div>
                <div class="col-md-10">
                    Firefox (Gecko) 25.0+, Opera 15.0+, Safari (WebKit) 6.9+, Chrome 14.0+, 
                    <br/>Internet Explorer not supported
                </div>
            </div>
            <br/>
            <div class="row">
                <div class="col-md-2">
                    Mobile
                </div>
                <div class="col-md-10">
                    Firefox Mobile (Gecko) 37.0+,  Firefox OS 2.2+, Chrome for Android 33.0+, Safari Mobile 6+, 
                    <br/>Android basic browser not supported, IE Phone not supported, Opera Mobile not supported
                </div>
            </div>
            <br/>
            <form action="upload.php" method="post" enctype="multipart/form-data">
            <h3>Sample .csv data:</h3>
            <div class="row">
                <div class="col-md-6">
                    <table class="table table-striped table-bordered" width="50%">
                        <tr>
                            <th>heading1</th>
                            <th>heading2</th>
                            <th>...</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>3</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>6</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td>...</td>
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="row">
                <p class="col-md-12">*Please note that the file should contain comma-separated numerical data only, and the top row should contain the field names, separated by commas</p>
            </div>
            <br/>    
            <h3>Please select a .csv file:</h3>
            <div class="row">
                <div class="col-md-3"><h4><input type="file" name="csv" value="" /></h4></div>
                <div class="col-md-3"><h4><input type="submit" name="submit" value="Upload" /></h4></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <?php 
                        if($_GET&&$_GET['err']){
                            if($_GET['err']==1){
                                echo '<div class="err">Something went wrong, please try again</div>';
                            }else if($_GET['err']==2){
                                echo '<div class="err">Incorrect file format, please try again</div>';
                            }
                        }
                        echo '<div class="row" id = "topErrContainer"></div>';
                    ?>
                </div>
            </div>
            </form>
            </table>
        </div>
        <br/> 
        
        <?php 
            if(isset($_SESSION['csvArr']) && !empty($_SESSION['csvArr'])) {
                if(count($_SESSION["csvArr"])>0){
                    //pass the number of columns and rows
                    echo '<div id="colCount" style="display:none">'.$_SESSION["csvColsCnt"].'</div>
                          <div id="rowCount" style="display:none">'.$_SESSION["csvRowsCnt"].'</div>'; 
                    echo '<div class="container fluid">';
                          echo '<h3>Audification and Parameter Mapping</h3>
                                <div class="row tile beige">';
                                echo'<div class="col-md-6 text-justify">';
                                    echo '<h4>Instructions</h4>';
                                    echo '<ul>';
                                       echo '<li>Please use headphones for a richer experience</li>';
                                       if($_SESSION["csvColsCnt"]>1){
                                        echo'<li>To explore audification and parameter mapping, first, select if you want to sonify all columns at once by pressing <b>Simultaneously</b>. Alternatively, if you want to sonify consecutively, column by column - press <b>Column-wise</b>, or if you want to sonify row by row - select  <b>Row-wise</b></li>';
                                        echo'<li><b>Selective</b> will activate the selective mode, where you will be able to choose which rows/columns to sonify. To switch off this mode, please press the <b>Selective</b> button again</li>';
                                        echo'<li>Select the sonification technique using <b>Audification</b>, <b>Parameter mapping: frequency (pitch)</b>, <b>Parameter mapping: duration</b>, <b>Parameter mapping: loudness</b>, <b>Parameter mapping: space</b>, or <b>Parameter mapping: space and frequency (pitch)</b> buttons, and the sound should start playing automatically.</li>';
                                       }else{
                                        echo'<li>To explore audification and parameter mapping, first select the sonification technique using <b>Audification</b>, <b>Parameter mapping: frequency (pitch)</b>, <b>Parameter mapping: duration</b>, <b>Parameter mapping: loudness</b>, <b>Parameter mapping: space</b>, or <b>Parameter mapping: space and frequency (pitch)</b> buttons, and the sound should start playing automatically</li>';
                                      
                                       }
                                       echo'<li>Reversed polarity will reverse the sonification mapping currently in use by mapping highs to lows and lows to highs</li>
                                            <li><b>Pause</b> will pause the sound flow, <b>Play</b> will allow to resume, and <b>Stop</b> to stop</li>
                                            <li><b>Reverse</b> will play the sound in reverse</li>
                                            <li><b>Backward</b> will play the sound in reverse with double speed</li>
                                            <li><b>Forward</b> will simply play the sound with double speed</li>
                                            <li><b>Repeat</b> will enable repeat of the sound flow, which will be put in a loop until you press <b>Repeat</b> again or <b>Stop</b></li>
                                            <li><b>Volume off</b>, <b>Volume down</b>, and <b>Volume up</b> allow to control the loudness of the sound flow</li>
                                            <li>Leaving the tab while the sound is playing will pause the sound flow</li>';
                                            if($_SESSION["csvColsCnt"]>1){
                                                echo'<li>Changing between simultaneous (<b>Simultaneously</b>) and <b>Column-wise</b>/<b>Row-wise</b> sonification while the sound is playing will cause the current sonification flow to stop, and you will be asked to choose the technique of sonification again</li>';
                                            }
                                       echo '<li>To explore <b>model-based sonification</b>, please see the graph at the bottom of the page. </li>';
                                    echo'</ul><br/> '; 
                                    
                                echo '</div>
                                      <div class="col-md-6"> ';   
                                    if($_SESSION["csvColsCnt"]>1){ //if data has more than 1 column/field
                                        echo '<div class="btn-toolbar" role="toolbar">';
                                            echo '<div class="btn-group">
                                                    <button class = "btn btn-default soundflow" id = "simultaneous"><div class="glyphicon glyphicon-random"></div> <br/>Simultaneously</button>
                                                    <button class = "btn btn-default soundflow" id = "columnwise"><div class="glyphicon glyphicon-object-align-top"></div> <br/>Column-wise</button>
                                                    <button class = "btn btn-default soundflow" id = "rowwise"><div class="glyphicon glyphicon-object-align-bottom icon-rotated"></div> <br/>Row-wise</button>
                                                  </div>'; 
                                            echo '<button class = "btn btn-default" id = "selective"><div class="glyphicon glyphicon-check"></div><br/>Selective</button>';
                                            echo '<br/><br/>';
                                        echo '</div>';
                                    }    
                                    echo '<div class="btn-group-vertical">
                                            <button id = "audification" class="btn btn-default sonification">Audification</button>
                                            <button id = "pm_frequency" class="btn btn-default sonification"> Parameter mapping: frequency (pitch) </button>
                                            <button id = "pm_duration" class="btn btn-default sonification"> Parameter mapping: duration </button>
                                            <button id = "pm_loudness" class="btn btn-default sonification"> Parameter mapping: loudness </button>
                                            <button id = "pm_space" class="btn btn-default sonification"> Parameter mapping: space </button>
                                            <button id = "pm_frequency_space" class="btn btn-default sonification"> Parameter mapping: space and frequency (pitch) </button>
                                            <button id = "pm_frequency_rpolarity" class="btn btn-default sonification"> Parameter mapping: frequency (pitch) - reversed polarity </button>
                                            <button id = "pm_duration_rpolarity" class="btn btn-default sonification"> Parameter mapping: duration - reversed polarity </button>
                                            <button id = "pm_loudness_rpolarity" class="btn btn-default sonification"> Parameter mapping: loudness - reversed polarity </button>
                                            <button id = "pm_space_rpolarity" class="btn btn-default sonification"> Parameter mapping: space - reversed polarity </button>
                                            <button id = "pm_frequency_space_rpolarity" class="btn btn-default sonification"> Parameter mapping: space and frequency (pitch) - reversed polarity </button>
                                          </div>
                                          <br/><br/>';
                                    echo '<div class="row" id = "errContainer"></div>';
                                    echo '<div class="btn-toolbar" role="toolbar">';
                                        echo '<div class="btn-group"> 
                                                <button class = "btn btn-default controls" id = "pause"><div class="glyphicon glyphicon-pause"></div><br/> Pause </button>
                                                <button class = "btn btn-default controls" id = "play"><div class="glyphicon glyphicon-play"></div><br/> Play </button>
                                                <button class = "btn btn-default controls" id = "stop"><div class="glyphicon glyphicon-stop"></div><br/> Stop </button>
                                                <button class = "btn btn-default controls" id = "reverse"><div class= "glyphicon glyphicon-play icon-flipped"></div><br/> Reverse </button>
                                                <button class = "btn btn-default controls" id = "bwd"><div class="glyphicon glyphicon-backward"></div><br/> Backward </button>
                                                <button class = "btn btn-default controls" id = "fwd"><div class="glyphicon glyphicon-forward"></div><br/> Forward </button>
                                              </div>';
                                        echo '<button class = "btn btn-default" id = "repeat"><div class="glyphicon glyphicon-repeat"></div> <br/>Repeat</button><br/><br/>';
                                    echo '</div>';   
                                    echo '<div class=btn-group> 
                                                <button id = "volume-off" class="btn btn-default volume"><div class="glyphicon glyphicon-volume-off"></div><br/>Volume <br/>off</button>
                                                <button id = "volume-down" class="btn btn-default volume"><div class="glyphicon glyphicon-volume-down"></div><br/> Volume <br/>down </button>
                                                <button id = "volume-up" class="btn btn-default volume"><div class="glyphicon glyphicon-volume-up"></div><br/> Volume <br/>up </button>
                                          </div><br/><br/>';
                                    echo '<div id="datatable">';
                                    for($i=0; $i<count($_SESSION["csvArr"]);$i++){
                                        $row = $_SESSION["csvArr"][$i];
                                        echo '<div class="row">';
                                        foreach ($row as $colNo => $col){
                                            if($i==0){
                                                echo "<div class='col-xs-2'><b><span class = name-".$colNo.">".$col."</span></b></div>";
                                            }else{
                                                echo "<div class='col-xs-2 value-".$colNo."-".($i-1)."'>$col</div>";
                                            }
                                        }
                                        echo '</div>';
                                    }
                                    echo '</div>';
                                echo '</div>';
                            echo '</div>';
                            echo '<h3>Model-Based Sonification</h3>
                                  <div class="row tile beige">
                                    <div class="col-md-6">
                                        <h4>Instructions</h4>
                                        <ul><li>Every data point has a corresponding sound which can be played by <b>clicking on the data point</b></li>
                                             <li>You can change the names of the data units for X and Y axis by entering a new name and hitting the apply button</li>
                                             <li>You can change the size of the datapoints by changing the position of the corresponding slider</li>
                                        </ul><br/>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="userDataUnitY">Change data unit for Y axis:</label><br/>
                                        <div class="col-md-6" ><input type="text" id="userDataUnitY"/></div>
                                        <button class="btn btn-default" onclick="getDataUnitY()">Apply</button><br/>
                                        <label for="userDataUnitX">Change data unit for X axis:</label><br/>
                                        <div class="col-md-6" ><input type="text" id="userDataUnitX"/></div>
                                        <button class="btn btn-default" onclick="getDataUnitX()">Apply</button><br/>
                                        <label for="slider">Change the size of data points:</label><br/>
                                        <div class="col-md-5"><div id="slider"></div></div><br/><br/>
                                    </div>
                                    <div class="col-md-12">
                                        <div id="graph-container" style="width:100%; height:400px;"></div>
                                    </div>
                                  </div>';
                    echo '</div>';
                    echo '<br/>';
                }
            }   
        ?>
<?php require_once 'footer.php';?>
<!-- JQuery library, minified -->    
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<!-- JQuery-UI library -->   
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<!-- Bootstrap library for tabs support -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script> 
<!-- Highcharts library for charts support -->
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="js/app.js"></script>
<script src="js/graph.js"></script>