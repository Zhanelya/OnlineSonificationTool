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
            <form action="upload.php" method="post" enctype="multipart/form-data">
            <div class="row">
                <div class="col-md-4"><h4>Please select a .csv file:</div>
                <div class="col-md-4"><h4><input type="file" name="csv" value="" /><h4></div>
            </div>
            <div class="row">
                <p class="col-md-8">*Please note that the file should contain numerical data only, and the top row should contain the field names</p>
            </div>    
            <div class="row">
                <div class="col-md-4"><h4>Upload:</h4></div>
                <div class="col-md-4"><h4><input type="submit" name="submit" value="Upload" /></h4></div>
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
                    ?>
                </div>
            </div>
            </form>
            </table>
        </div>
        <br/> <br/> 
        <?php 
            if(isset($_SESSION['csvArr']) && !empty($_SESSION['csvArr'])) {
                if(count($_SESSION["csvArr"])>0){
                    //pass the number of columns and rows
                    echo '<div id="colCount" style="display:none">'.$_SESSION["csvColsCnt"].'</div>
                          <div id="rowCount" style="display:none">'.$_SESSION["csvRowsCnt"].'</div>'; 
                    echo '<div class="container fluid">';
                        echo '<button id = "audification" class="btn btn-default"> Audification </button>
                              <button id = "pm_frequency" class="btn btn-default"> Parameter mapping: frequency </button>
                              <button id = "pm_loudness" class="btn btn-default"> Parameter mapping: loudness </button><br/><br/>';
                        echo '<p>*Please don\'t leave the tab while the sound is playing, as this will interrupt the sound flow</p>';
                        echo '<div class="btn-toolbar" role="toolbar">';
                            echo '<div class=btn-group> 
                                    <button class = "btn btn-default" id = "play"><div class="glyphicon glyphicon-play"></div><br/> Play </button>
                                    <button class = "btn btn-default" id = "pause"><div class="glyphicon glyphicon-pause"></div><br/> Pause </button>
                                    <button class = "btn btn-default" id = "stop"><div class="glyphicon glyphicon-stop"></div><br/> Stop </button>
                                    <button class = "btn btn-default" id = "reverse"><div class= "glyphicon glyphicon-play icon-flipped"></div><br/> Reverse </button>
                                    <button class = "btn btn-default" id = "bwd"><div class="glyphicon glyphicon-backward"></div><br/> Backward </button>
                                    <button class = "btn btn-default" id = "fwd"><div class="glyphicon glyphicon-forward"></div><br/> Forward </button>
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
                                    echo "<div class='col-xs-4 name-".$colNo."'><br/><b>$col</b></div>";
                                }else{
                                    echo "<div class='col-xs-4 value-".$colNo."'>$col</div>";
                                }
                            }
                            echo '</div>';
                        }
                    echo '</div>';
                }
            }   
        ?>
      
<?php require_once 'footer.php';?>
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="js/app.js"></script>