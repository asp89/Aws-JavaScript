const { readObject, getObjectPresignedUrl } = require("./lib/awsS3");

exports.handler = async (s3RequestBody, context) => {
  // NOTE: Request Body contains file name and bucket.

  const { bucketName, fileName } = s3RequestBody;

  if (!bucketName || !fileName) return;

  // NOTE: Read S3 Object file
  const s3Fileresponse = await readObject(bucketName, fileName);
  const responseBody = s3Fileresponse.Body.toString("utf-8");

  if (exceededLimit(responseBody))
    return await getObjectPresignedUrl(bucketName, fileName);

  return JSON.parse(responseBody);
};

const exceededLimit = (data) => {
  if (data.length > 6291456) return true;
  else return false;
};
