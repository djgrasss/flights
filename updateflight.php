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
            $logtable = "records";
        
            //Connecting to your database
            mysql_connect($hostname, $username, $password) OR DIE ("Unable to 
            connect to database! Please try again later.");
            mysql_select_db($dbname);
		
            //UPDATE table SET x=y, timestampColumn=timestampColumn WHERE a=b;

            $price =  mysql_real_escape_string($_POST["price"]);
            $id = $_POST["id"];
            if(is_numeric($id) && is_numeric($price)){
                  try{
                        $query = "UPDATE $usertable SET current_price='$price', last_updated=CURRENT_TIMESTAMP WHERE id='$id'";
                        mysql_query($query);

                        $query2 = "INSERT INTO $logtable (id, price) VALUES ('$id', '$price')";
                        mysql_query($query2);

                        echo("success");
                  }
                  catch(Exception $e){  
                        echo("sql fail");
                        throw new Exception( 'Something has really gone wrong', 0, $e);  
                  }       
            }
                  
            mysql_close();

            ?>