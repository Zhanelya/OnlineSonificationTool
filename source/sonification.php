<?php require_once 'header.php';?>
    <div class="container fluid">
        <h1>Sonification</h1>
        <form action="upload.php" method="post" enctype="multipart/form-data">
        <div class="row">
            <div class="col-md-4"><h4>Please select csv file</h4></div>
            <div class="col-md-4"><h4><input type="file" name="csv" value="" /><h4></div>
        </div>
        <div class="row">
            <div class="col-md-4"><h4>Upload</h4></div>
            <div class="col-md-4"><h4><input type="submit" name="submit" value="Upload" /></h4></div>
        </div>
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <?php 
                    if($_GET&&$_GET['err']){
                        if($_GET['err']==1){
                            echo 'Something went wrong, please try again';
                        }else if($_GET['err']==2){
                            echo 'Incorrect file format, please try again';
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
        session_start();
        if(isset($_SESSION['csvArr']) && !empty($_SESSION['csvArr'])) {
            if(count($_SESSION["csvArr"])>0){
                echo '<div class="container fluid">';
                //print_r($_SESSION["csvArr"]);
                for($i=0; $i<count($_SESSION["csvArr"]);$i++){
                    $row = $_SESSION["csvArr"][$i];
                    echo '<div class="row">';
                    foreach ($row as $col){
                        if($i==0){
                            echo "<div class='col-md-4'><b>$col</b></div>";
                        }else{
                            echo "<div class='col-md-4'>$col</div>";
                        }
                    }
                    echo '</div>';
                }
                echo '</div>';
            }
        }   
    ?>
      
<?php require_once 'footer.php';?>