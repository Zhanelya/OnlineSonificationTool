<?php require_once 'header.php';?>
            <h1>Sonification</h1>
            <table width="600">
            <form action="upload.php" method="post" enctype="multipart/form-data">
            <tr>
            <td width="30%">Please select csv file</td>
            <td width="80%"><input type="file" name="csv" value="" /></td>
            </tr>

            <tr>
            <td>Upload</td>
            <td><input type="submit" name="submit" value="Upload" /></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <?php 
                        if($_GET&&$_GET['err']){
                            if($_GET['err']==1){
                                echo 'Something went wrong, please try again';
                            }else if($_GET['err']==2){
                                echo 'Incorrect file format, please try again';
                            }
                        }
                    ?>
                </td>
            </tr>
            </form>
            </table>
            <br/> <br/> 
            <?php 
                session_start();
                if(count($_SESSION["csvArr"])>0){
                    echo '<table>';
                    //print_r($_SESSION["csvArr"]);
                    for($i=0; $i<count($_SESSION["csvArr"]);$i++){
                        $row = $_SESSION["csvArr"][$i];
                        echo '<tr>';
                        foreach ($row as $col){
                            if($i==0){
                                echo "<th>$col</th>";
                            }else{
                                echo "<td>$col</td>";
                            }
                        }
                        echo '</tr>';
                    }
                    echo '</table>';
                }
            ?>
      
<?php require_once 'footer.php';?>