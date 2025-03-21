import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",  // Handles both images & videos
      });
      if (response) {
          fs.unlinkSync(localFilePath);  // Delete local file after upload
      }
      return response.secure_url;
  } 
  catch (error) {
      // console.error("Cloudinary Upload Error:", error);

      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      }
      return null;
  }
};

export { uploadToCloudinary };
