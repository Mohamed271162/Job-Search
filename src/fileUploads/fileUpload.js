/*import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../utils/appError.js";

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "_" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new AppError("PDF files only", 401, false));
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
  });

  return upload;
};

export const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);

export const uploadMixOfFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);*/
//////////////////////////////////////////////////////////////////////////////////////////
/*import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../utils/appError.js";
import fs from "fs"; // To check or create directories

const fileUpload = (folderName) => {
  // Ensure the uploads folder exists, or create it
  const folderPath = `uploads/${folderName}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "_" + file.originalname);
    },
  });

  // File filter for accepting only PDFs
  function fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF files are allowed!"));
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      // Restrict file size to 10 MB for testing (can be adjusted)
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });

  return upload;
};

// Upload a single file
export const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);

// Upload multiple files
export const uploadMixOfFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);*/

import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadResume = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "resumes",
    });
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { uploadResume };
