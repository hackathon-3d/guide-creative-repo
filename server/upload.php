<?php
// In PHP versions earlier than 4.1.0, $HTTP_POST_FILES should be used instead
// of $_FILES.

$uploaddir = './uploads/';
$uploadfile = $uploaddir . time() . '-' . basename($_FILES['file']['name']);

echo '<pre>';
if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    echo "File is valid, and was successfully uploaded.\n";
} else {
    echo "Possible file upload attack!\n";
}

echo 'Here is some more debugging info:';
print_r($_FILES);

print "</pre>";

?>