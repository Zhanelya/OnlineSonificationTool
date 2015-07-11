<?php 
    session_start();
    /* Zhanelya Subebayeva */
    require_once 'header.php';
?>

    <nav class="navbar navbar-inverse">
           <ul class="nav navbar-nav">
               <li><a href="index.php"><h4>Home</h4></a></li>
               <li class="active"><a href="sonification.php"><h4>Sonification</h4></a></li>
               <li><a href="contact.php"><h4>Contact</h4></a></li>
           </ul>
    </nav>
    <div class="wrapper ">
        <div class="container fluid">
            <h1>Sonification</h1>
            <h4>Supported browsers</h4>
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
            <br/><br/>
            <form action="upload.php" method="post" enctype="multipart/form-data">
            <h4>Please select a .csv file:</h4>
            <div class="row">
                <div class="col-md-3"><h4><input type="file" name="csv" value="" /></h4></div>
                <div class="col-md-3"><h4><input type="submit" name="submit" value="Upload" /></h4></div>
            </div>
            <div class="row">
                <p class="col-md-12">*Please note that the file should contain numerical data only, and the top row should contain the field names</p>
            </div>    
            <div class="row">
                <div class="col-md-4"></div>
                <div class="col-md-4">
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
                          echo '<div class="row tile beige">';
                                echo'<div class="col-md-6 text-justify">';
                                    echo '<h4>Instructions</h4>';
                                    echo '<ul>';
                                       if($_SESSION["csvColsCnt"]>1){
                                       echo'<li>To explore audification and parameter mapping, first, select if you want to sonify all columns at once by pressing <b>Simultaneously</b>, or if you want to sonify consecutively column by column by pressing <b>Column at a time</b></li>';
                                       }
                                       echo'<li>Select the sonification technique using <b>Audification</b>, <b>Parameter mapping: frequency</b>, or <b>Parameter mapping: loudness</b> buttons, and the sound should start playing automatically</li>
                                            <li><b>Pause</b> will pause the sound flow, <b>Play</b> will allow to resume, and <b>Stop</b> to stop</li>
                                            <li><b>Reverse</b> will play the sound in reverse</li>
                                            <li><b>Backward</b> will play the sound in reverse with double speed</li>
                                            <li><b>Forward</b> will simply play the sound with double speed</li>
                                            <li><b>Repeat</b> will enable repeat of the sound flow, which will be put in a loop until you press <i>Repeat</i> again or <i>Stop</i></li>
                                            <li>Leaving the tab while the sound is playing will pause the sound flow</li>';
                                            if($_SESSION["csvColsCnt"]>1){
                                                echo'<li>Changing between simultaneous (<b>Simultaneously</b>) and columnwise (<b>Column at a time</b>) sonification while the sound is playing will cause the current sonification flow to stop, and you will be asked to choose the technique of sonification again</li>';
                                            }
                                    echo'</ul><br/> '; 
                                    
                                echo '</div>
                                      <div class="col-md-6"> ';   
                                    if($_SESSION["csvColsCnt"]>1){
                                        echo '<div class="btn-group">
                                                <button class = "btn btn-default soundflow" id = "simultaneous"><div class="glyphicon glyphicon-random"></div> <br/>Simultaneously</button>
                                                <button class = "btn btn-default soundflow" id = "columnwise"><div class="glyphicon glyphicon-sort-by-attributes-alt"></div> <br/>Column at a time</button>
                                              </div><br/><br/>'; //if data has more than 1 column/field
                                    }    
                                    echo '<div class="btn-group">
                                            <button id = "audification" class="btn btn-default sonification"> Audification: <br/>frequency</button>
                                            <button id = "pm_frequency" class="btn btn-default sonification"> Parameter mapping: <br/>frequency </button>
                                            <button id = "pm_loudness" class="btn btn-default sonification"> Parameter mapping: <br/>loudness </button>
                                          </div>
                                          <br/><br/>';
                                    echo '<div class="btn-toolbar" role="toolbar">';
                                        echo '<div class=btn-group> 
                                                <button class = "btn btn-default controls" id = "pause"><div class="glyphicon glyphicon-pause"></div><br/> Pause </button>
                                                <button class = "btn btn-default controls" id = "play"><div class="glyphicon glyphicon-play"></div><br/> Play </button>
                                                <button class = "btn btn-default controls" id = "stop"><div class="glyphicon glyphicon-stop"></div><br/> Stop </button>
                                                <button class = "btn btn-default controls" id = "reverse"><div class= "glyphicon glyphicon-play icon-flipped"></div><br/> Reverse </button>
                                                <button class = "btn btn-default controls" id = "bwd"><div class="glyphicon glyphicon-backward"></div><br/> Backward </button>
                                                <button class = "btn btn-default controls" id = "fwd"><div class="glyphicon glyphicon-forward"></div><br/> Forward </button>
                                                ';
                                        echo '</div>';
                                        echo '<button class = "btn btn-default" id = "repeat"><div class="glyphicon glyphicon-repeat"></div> <br/>Repeat</button>';
                                    echo '</div>';    
                                    echo '<div class="row" id = "errContainer"></div>';
                                    for($i=0; $i<count($_SESSION["csvArr"]);$i++){
                                        $row = $_SESSION["csvArr"][$i];
                                        echo '<div class="row">';
                                        foreach ($row as $colNo => $col){
                                            if($i==0){
                                                echo "<div class='col-xs-2'><br/><b><span class = name-".$colNo.">".$col."</span></b></div>";
                                            }else{
                                                echo "<div class='col-xs-2 value-".$colNo."'>$col</div>";
                                            }
                                        }
                                        echo '</div>';
                                    }
                                echo '</div>';
                            echo '</div>';
                            echo '<div class="row tile beige"><div class="col-md-12">
                                    <div id="graph-container" style="width:100%; height:400px;"></div>
                                  </div></div>';
                    echo '</div>';
                    echo '<br/>';
                }
            }   
        ?>
      
<?php require_once 'footer.php';?>
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script> <!-- For tabs support -->
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="js/app.js"></script>
<script src="js/graph.js"></script>