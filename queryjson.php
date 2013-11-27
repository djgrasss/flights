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
			
            //Fetching from your database table.

            // TODO order by date and limit to a threshold
            $query = "SELECT * FROM $usertable";
            $result = mysql_query($query);

           while($e=mysql_fetch_assoc($result))
              $output[]=$e;
			
		    print(json_encode($output));
          
		    mysql_close();
			

            ?>