import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CONSTANTS } from "../config/constants.js";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${CONSTANTS.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CONSTANTS.R2.ACCESS_KEY_ID,
    secretAccessKey: CONSTANTS.R2.SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (file: Express.Multer.File): Promise<string> => {
  const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, "-")}`;

  const command = new PutObjectCommand({
    Bucket: CONSTANTS.R2.BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return `https://${CONSTANTS.R2.ACCOUNT_ID}.r2.cloudflarestorage.com/${CONSTANTS.R2.BUCKET_NAME}/${fileName}`;
};