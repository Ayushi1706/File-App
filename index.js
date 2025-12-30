// ---------------------- IMPORTS ---------------------- //
const express = require("express");
const app = express();
require("dotenv").config();   // Load .env

const PORT = process.env.PORT || 3000;
const fileUpload = require("express-fileupload");

// ---------------------- MIDDLEWARE ---------------------- //
app.use(express.json());

// IMPORTANT: tempFilePath required for cloudinary uploads
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// ---------------------- DATABASE CONNECTION ---------------------- //
const db = require("./config/database");
db.connect();

// ---------------------- CLOUDINARY CONNECTION ---------------------- //
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// ---------------------- ROUTES ---------------------- //
const Upload = require("./routes/fileUpload");
app.use('/api/v1/upload', Upload);

// ---------------------- START SERVER ---------------------- //
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
