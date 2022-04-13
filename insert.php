<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Insert Page</title>
</head>

<body>
	<center>
        <?php
  			$username = $_POST['username'];
			$password = $_POST['password'];
        // servername => localhost
        // username => root
        // password => empty
        // database name => staff
        $conn = mysqli_connect("localhost", "root", "", "survey");
          
        // Check connection
        if($conn === false){
            die("ERROR: Could not connect. " 
                . mysqli_connect_error());
        }
          
		$username = $_REQUEST['username'];
		$password = $_REQUEST['password'];
		
		$sql = "INSERT INTO info VALUES ('$username', '$password')";
		
		 if(mysqli_query($conn, $sql)){
            echo "<h3>Data stored in a database successfully.";
  
            echo nl2br("\n$username\n $password");
        } else{
            echo "ERROR: Hush! Sorry $sql. " 
                . mysqli_error($conn);
        }
          
        // Close connection
        mysqli_close($conn);
        ?>
</body>
</html>