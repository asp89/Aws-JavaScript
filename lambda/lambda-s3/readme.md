# AWS Lambda - S3

The basic agenda of the project is to create a library to consume S3 APIs to read the S3 object, generate presigned URL, and much more.

Consumed AWS services- 
* Lambda
* S3 

Create lambda function using AWS CLI
```
    aws lambda create-function \
    --function-name test_s3ObjectReader \
    --runtime nodejs16.x \
    --zip-file fileb://awsDeploy/test_s3ObjectReader.zip \
    --handler index.handler \
    --role arn:aws:iam::082706691922:role/Lambda-Demo-Role
```
