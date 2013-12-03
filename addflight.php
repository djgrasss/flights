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
			
            $error = false;
            $password = $_POST["password"];
            $email =  mysql_real_escape_string($_POST["email"]);
            if($password == 'fifa2013'){
                  if(filter_var($email, FILTER_VALIDATE_EMAIL)){
                        if($_POST["batch_routes"]!=''){
                              $batch_routes = explode(',', mysql_real_escape_string($_POST["batch_routes"]));
                        }else{
                              $batch_routes = array();
                        }
                        if($_POST["batch_dates"]!=''){
                              $batch_dates = explode(',', mysql_real_escape_string($_POST["batch_dates"]));
                        }
                        else{
                              $batch_dates=array();
                        }

                        $leaving_from = mysql_real_escape_string($_POST["leaving_from"]);
                        $arriving_at = mysql_real_escape_string($_POST["arriving_at"]);
                        $price_floor= mysql_real_escape_string($_POST["price_floor"]);
                        $arriving_nearby = '0';
                        $leaving_nearby = '0';
                        if (isset($_POST['arriving_nearby'])) {
                            $arriving_nearby = '1';
                        }
                        if (isset($_POST['leaving_nearby'])) {
                            $leaving_nearby = '1';
                        }

                        array_push($batch_routes, $leaving_from, $arriving_at, $price_floor, $leaving_nearby, $arriving_nearby);


                        $departing = mysql_real_escape_string($_POST["departing"]);
                        $departing_flexible = mysql_real_escape_string($_POST["departing_flexible"]);
                        $returning = mysql_real_escape_string($_POST["returning"]);
                        $returning_flexible = mysql_real_escape_string($_POST["returning_flexible"]);
                        
                        array_push($batch_dates, $departing, $returning, $departing_flexible, $returning_flexible);

                        for ($i=0; $i<count($batch_routes); $i+=5){

                              $leaving_from = $batch_routes[$i];
                              $arriving_at = $batch_routes[$i+1];
                              $price_floor= $batch_routes[$i+2];
                              $arriving_nearby = $batch_routes[$i+3];
                              $leaving_nearby = $batch_routes[$i+4];

                              if(strlen($leaving_from)!=3 || strlen($arriving_at)!=3){
                                    continue;
                              }


                              if(!is_numeric($price_floor) || !is_numeric($arriving_nearby) || !is_numeric($leaving_nearby)){
                                    continue;
                              }

                              for ($j=0; $j<count($batch_dates); $j+=4){

                                    $departing = $batch_dates[$j];
                                    $returning = $batch_dates[$j+1];
                                    $departing_flexible = $batch_dates[$j+2];
                                    $returning_flexible = $batch_dates[$j+3];
                                    
                                    if($departing=='' || $returning==''){
                                          continue;
                                    }

                                    if($departing_flexible=='' || $returning_flexible==''){
                                          continue;
                                    }


                                    try{  
                                          $query = "INSERT INTO $usertable (departing, departing_flexible, returning, returning_flexible, leaving_from, leaving_nearby, arriving_at, arriving_nearby, price_floor, owners) VALUES ('$departing', '$departing_flexible', '$returning', '$returning_flexible', '$leaving_from', '$leaving_nearby', '$arriving_at', '$arriving_nearby', '$price_floor', '$email')";
                                          $result = mysql_query($query);
                                    }
                                    catch(Exception $e){
                                          echo("SQL Error");  
                                          throw new Exception( 'Something has really gone wrong', 0, $e);  
                                    }  

                              }

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