const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function imageUploadUtil(buffer, mimetype) {
  const base64 = Buffer.from(buffer).toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    resource_type: "auto",
  });
  return result;
}

module.exports = { upload, imageUploadUtil };
