require("dotenv").config();
const {
  readObject,
  listObjects,
  deleteObject,
  getObjectPresignedUrl,
  deleteAllObjects,
} = require("./lib/awsS3");

exports.handler = async (s3RequestBody, context) => {
  const { operationType, bucketName, fileName } = s3RequestBody;

  if (!bucketName || !fileName) return;

  let s3BucketPrefix = s3RequestBody.directoryPrefix ?? "";
  let result = "";

  switch (operationType) {
    case "get-object":
      result = await getS3Object(bucketName, fileName);
      break;
    case "delete-object":
      result = await deleteObject(bucketName, fileName);
      break;
    case "list-all-objects":
      result = await getAllObjects(bucketName, s3BucketPrefix);
      break;
    case "delete-all-objects":
      result = await removeS3BucketObjects(bucketName, s3BucketPrefix);
      break;
    default:
      break;
  }
  return result;
};

async function getS3Object(bucket, key) {
  const s3Fileresponse = await readObject(bucket, key);
  const responseBody = s3Fileresponse.Body.toString("utf-8");

  if (exceededLimit(responseBody))
    return await getObjectPresignedUrl(bucket, key);

  return JSON.parse(responseBody);
}

async function getAllObjects(bucket, prefix) {
  try {
    const response = await listObjects(bucket, prefix);
    return JSON.parse(JSON.stringify(response.Contents));
  } catch (err) {
    console.log(err);
  }
}

async function removeS3BucketObjects(bucket, prefix) {
  return (await deleteAllObjects(bucket, prefix)).Deleted;
}

const exceededLimit = (data) =>
  data.length > process.env.LAMBDA_RESPONSE_PAYLOAD_LIMIT ? true : false;
