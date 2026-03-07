const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3") // client S3
const { v4: uuidv4 } = require('uuid') 



// s3 credentials
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

const uploadToS3 = async (file) => {

  const fileKey = `photos/${uuidv4()}.jpg` 

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET, 
    Key: fileKey, 
    Body: file.buffer, 
    ContentType: file.mimetype 
  })

  await s3.send(command) // send  AWS

  //  URL public
  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
}

module.exports = uploadToS3