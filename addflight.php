            <?php
            
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
			
            $error = false;
            $password = $_POST["password"];
            if($password == 'fifa2013'){

                  $email =  mysql_real_escape_string($_POST["email"]);
                  $leaving_from = mysql_real_escape_string($_POST["leaving_from"]);
                  $arriving_at = mysql_real_escape_string($_POST["arriving_at"]);
                  $price_floor= mysql_real_escape_string($_POST["price_floor"]);
                  $departing = mysql_real_escape_string($_POST["departing"]);
                  $departing_flexible = mysql_real_escape_string($_POST["departing_flexible"]);
                  $returning = mysql_real_escape_string($_POST["returning"]);
                  $returning_flexible = mysql_real_escape_string($_POST["returning_flexible"]);


                  $arriving_nearby = 0;
                  $leaving_nearby = 0;
                  if (isset($_POST['arriving_nearby'])) {
                      $arriving_nearby = 1;
                  }
                  if (isset($_POST['leaving_nearby'])) {
                      $leaving_nearby = 1;
                  }

                  if(filter_var($email, FILTER_VALIDATE_EMAIL)){
                        //TODO validate airport codes
                        //TODO validate dates
                              if(is_numeric($price_floor)){
                                    try{  
                                          $query = "INSERT INTO $usertable (departing, departing_flexible, returning, returning_flexible, leaving_from, leaving_nearby, arriving_at, arriving_nearby, price_floor, owners) VALUES ('$departing', '$departing_flexible', '$returning', '$returning_flexible', '$leaving_from', '$leaving_nearby', '$arriving_at', '$arriving_nearby', '$price_floor', '$email')";
                                          $result = mysql_query($query);
                                    }
                                    catch(Exception $e){
                                          echo("SQL Error");  
                                          throw new Exception( 'Something has really gone wrong', 0, $e);  
                                    }  
                              }else{
                                    echo("invalid price floor");
                                    $error = true;
                              }
                  }else{
                        echo("invalid email");
                        $error = true;
                  }
            }else{
                  echo("invalid password");
                  $error = true;
            }
                  
            mysql_close();

            if($error){
                  echo("<br> Invalid form <a href='http://arankhanna.com/flights.html'>try again</a>") ;
            }
            else{
                  header( 'Location: http://www.arankhanna.com/flights.html' ) ;
            }
            

            ?>