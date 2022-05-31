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

exports.deleteObject = async (bucket, key) => {
  const s3client = new AWS.S3();
  try {
    const s3Params = {
      Bucket: bucket,
      Key: key,
    };
    return await s3client.deleteObject(s3Params).promise();
  } catch (err) {
    throw new Error(`Could not delete object: ${err.message}`);
  }
};

exports.listObjects = async (bucket, prefixDirectory) => {
  const s3client = new AWS.S3();
  try {
    const s3Params = {
      Bucket: bucket,
      Prefix: prefixDirectory,
    };
    return await s3client.listObjectsV2(s3Params).promise();
  } catch (err) {
    throw new Error(`Could not delete object: ${err.message}`);
  }
};

exports.deleteAllObjects = async (bucket, prefixDirectory) => {
  const s3client = new AWS.S3();

  try {
    const listedObjects = await this.listObjects(bucket, prefixDirectory);

    if (listedObjects.Contents.length === 0) return "no object in the bucket!";

    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    const res = await s3client.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated)
      await deleteAllObjects(bucket, prefixDirectory);

    return res;
  } catch (err) {
    throw new Error(`Could not delete objects: ${err.message}`);
  }
};
