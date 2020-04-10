<?php
$username = 'gitfit';
$password = 'gitfit!';
$host = 'localhost:3306';
$dbname = 'gitfit';

$dsn = "mysql:host=$host;dbname=$dbname";

/** connect to the database **/
try 
{
   $db = new PDO($dsn, $username, $password);   
   //echo "<p>You are connected to the database</p><br/>";

   // Set up db. Check to see if routines table has been created. From: https://stackoverflow.com/questions/6432178/how-can-i-check-if-a-mysql-table-exists-with-php
   $test = $db->prepare( "DESCRIBE `routines`" );
    if ( $test->execute() ) {
       // Table exists.
       //echo "<p>Table exists.</p>";
   } else {
       // Table does not exist. Create the table.
       // echo "<p>Table does not exist.</p>";
       $query = "CREATE TABLE routines ( title VARCHAR(50) NOT NULL , exercises VARCHAR(1000) NOT NULL , user VARCHAR(50) NOT NULL )";
       $statement = $db->prepare($query);
       $statement->execute();
       $statement->closeCursor();
   }
   $test->closeCursor();
}
catch (PDOException $e)     // handle a PDO exception (errors thrown by the PDO library)
{
   // Call a method from any object, 
   // use the object's name followed by -> and then method's name
   // All exception objects provide a getMessage() method that returns the error message 
   $error_message = $e->getMessage();        
   //echo "<p>An error occurred while connecting to the database: $error_message </p>";
}
catch (Exception $e)       // handle any type of exception
{
   $error_message = $e->getMessage();
   //echo "<p>Error message: $error_message </p>";
}
?>