
        <?php

        // servername => localhost
        // username => root
        // password => empty
        // database name => staff
        $conn = mysqli_connect("localhost", "root", "", "survey");
          
        // Check connection
        if($conn === false){
            die("ERROR: Could not connect. ". mysqli_connect_error());
        }

		$stmt = $conn->prepare("SELECT username, password FROM info WHERE username = ?");
		$stmt->bind_param('s', $username);

		$username = $_POST['username'];
		$password = $_POST['password']; 

		/*$user_results = "SELECT * FROM info WHERE username LIKE '%$username%'";
		$pass_results = "SELECT * FROM info WHERE username LIKE '%$password%'";*/
		
		$stmt->execute();
		$stmt->bind_result($username, $password);
		$row = $stmt->fetch();
		
		// $records = $conn->query($results);

		if (!empty($row)) 
		{
			if(password_verify($POST['password'], $row['password']))
			{
				echo 'success'; // password_verify success
			}
			else
			{
				echo 'failed'; // password does not match
			}
		}
		else
		{
			echo "This user does not exist"; // user entered does not exist in DB
		}
	
		
		/*if(($row = $records->fetch_assoc()) > 0)
		{
		while ($row = $records->fetch_assoc())
		{
			echo "This username: " .$row['username']. " is taken.";
		}
		}
		else
		{
			echo "This username is available!";
		}*/
		
	/*
	$sql = "SELECT * FROM 'info' WHERE('username' LIKE '%".$search."%')";

		
	$results = $conn->query($sql);

	   if($is_query_run = mysqli_query($results))
			 {
		   while($results_executed = mysqli_fetch_assoc($is_query_run))
		   {
				   echo "The username: " .$results['username']. " is taken.";
			  }
	   }
			else
			{
				echo "This username is available!";
			}*/

        // Close connection
		$stmt->close();
        mysqli_close($conn);
        ?>