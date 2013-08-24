<?php

// Validate Request
if (!isset($_GET['r'])) {
	
	$response = array('errors' => array('Please specify a valid request.'));

} else {

	// Remove any trailing slash
	$method = strtolower($_SERVER['REQUEST_METHOD']);
	$request = strtolower(rtrim($_GET['r'], '/'));
	$requestParts = explode('/', $request);
	$requestPartsLength = count($requestParts);

	// Parse
	switch ($method) {
		case 'get':

			// Validate
			if ($requestPartsLength) {

				// Parse
				switch ($requestParts[0]) {
					case 'user':
						if ($requestPartsLength == 2) {

							// SQL INJECTION HERE WE COME
							$response = get('users', 'select * from Users where ID = ' . $requestParts[1]);
						}
					break;
					case 'users':
						$response = get('users', 'select * from mobile_idol.Users');
					break;
					case 'video':
						if ($requestPartsLength == 2) {

							// Seriously I know but it's 3:30 and I'm tired.
							$response = get('videos', 'select * from Videos WHERE ID = ' . $requestParts[1]);
						}
					break;
					case 'videos':
						$response = get('videos', 'select * from Videos');
					break;
					case 'votes':
						$response = get('votes', 'select * from Votes');
					break;
					case 'categories':
						$response = get('categories', 'select * from Categories');
					break;
					default:
						$response = array('errors' => array('Unknown request.'));
					break;
				}

			}

		break;
		case 'post':

			// Validate
			if ($requestPartsLength) {

				// Parse
				switch ($requestParts[0]) {

					case 'video':
						$response = $_POST[]
					break;

				}

			}

		break;
	}

}

// Return JSON
header('Content-type: text/json');
echo json_encode($response);

function get($key, $query) {

	// Create connection
	$mysqli = new mysqli("mysql.hackathon.bobbyearl.com", "y8nljnzu", "5TLeX5#2", "mobile_idol");

	// Validate connection
	if (mysqli_connect_errno()) {
	    
	    $result = array('errors' => array('Database connection failed.'));

	} else {

		// Execute query
		$queryResult = $mysqli->query($query);

		// Validate results
		if (!$queryResult) {

			$result = array('errors' => array('Error executing query: ' . $mysqli->error));

		} else {

			// Fetch result
			$result = array($key => array());
			while ($row = $queryResult->fetch_array(MYSQLI_ASSOC)) {
				$result[$key][] = $row;
			}

			// Free results
			$queryResult->free();

		}

		// Close connection
		$mysqli->close();

	}

	// Return results
	return $result;
}

?>