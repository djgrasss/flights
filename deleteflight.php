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

            $id = mysql_real_escape_string($_POST['id']);

            if(is_numeric($id)){
                  try{  
                        $query = "DELETE FROM $usertable WHERE id='$id'";
                        $result = mysql_query($query);
                  }
                  catch(Exception $e){
                        echo("SQL Error");  
                        throw new Exception( 'Something has really gone wrong', 0, $e);  
                  }  
            }
                  
            mysql_close();


            header( 'Location: http://www.arankhanna.com/flights.html' ) ;
            

            ?>