            <?php

            header('Access-Control-Allow-Origin: *');
            
            //Variables for connecting to your database.
            //These variable values come from your hosting account.
            $hostname = "flightwatch.db.2169805.hostedresource.com";
            $username = "flightwatch";
            $dbname = "flightwatch";

            //These variable values need to be changed by you before deploying
            $password = "Aran1025@";
            $usertable = "queries";
        
            //Connecting to your database
            mysql_connect($hostname, $username, $password) OR DIE ("Unable to 
            connect to database! Please try again later.");
            mysql_select_db($dbname);
			

            $email =  mysql_real_escape_string($_POST["email"]);
            if(filter_var($email, FILTER_VALIDATE_EMAIL)){
                  if(is_numeric($_POST["id"])){
                        $id = $_POST["id"];
                        try{  
                              $query = "SELECT owners FROM $usertable WHERE id='$id'";
                              $result = mysql_query($query);

                              $oldowner = mysql_result($result, 0);

                              $owner = $oldowner.",".$email;

                              $newquery = "UPDATE $usertable SET owners='$owner' WHERE id='$id'";
                              mysql_query($newquery);

                        }
                        catch(Exception $e){
                              echo("Error");  
                              throw new Exception( 'Something has really gone wrong', 0, $e);  
                        }  
                  }
            }
                  
            mysql_close();

            ?>