$functionName="test_s3ObjectReader"
$zipName="$functionName.zip"

cd ..

Compress-Archive -Path "lambda-s3\*"  -DestinationPath "lambda-s3\awsDeploy\$zipName" -Force

aws s3 cp "awsDeploy\$zipName" "s3://my-learners-bucket/$zipName"

aws lambda update-function-code --function-name $functionName --s3-bucket my-learners-bucket --s3-key $zipName