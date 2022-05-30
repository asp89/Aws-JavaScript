const AWS = require("aws-sdk");

exports.readObject = async (bucket, key) => {
  const s3client = new AWS.S3();
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    return await s3client.getObject(params).promise();
  } catch (err) {
    throw new Error(`Could not retrieve file from S3: ${err.message}`);
  }
};

exports.getObjectPresignedUrl = async (bucket, key) => {
  const s3client = new AWS.S3();
  try {
    const s3Params = {
      Bucket: bucket,
      Key: key,
      Expires: 60,
    };

    return await s3client.getSignedUrl("getObject", s3Params);
  } catch (err) {
    throw new Error(`Could not generate presigned url: ${err.message}`);
  }
};
