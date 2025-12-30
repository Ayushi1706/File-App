const File = require("../models/File");
const cloudinary = require('cloudinary').v2;

// ---------------- Local Upload ----------------
exports.localFileUpload = async (req,res) =>{
  try{
      if(!req.files || !req.files.file){
          return res.status(400).json({success:false,message:"No file uploaded"});
      }

      const file = req.files.file;
      const fileExt = file.name.split(".").pop();
      let path = `${__dirname}/files/${Date.now()}.${fileExt}`;

      file.mv(path,(err)=>{
          if(err){
              console.log("FILE MOVE ERROR:",err);
              return res.status(500).json({success:false,message:"Upload failed"});
          }
      });

      res.json({success:true,message:"File uploaded successfully",path});
  }
  catch(err){
      console.log(err);
      res.status(500).json({success:false,message:"Server Error"});
  }
}

// ---------------- Utils ----------------
function isSupported(type, SupportedType){
    return SupportedType.includes(type);
}

async function uploadFiletoCloudinary(file, folder){
    return await cloudinary.uploader.upload(file.tempFilePath,{
        folder
    });
}

async function uploadVideoToCloudinary(file, folder){
    return await cloudinary.uploader.upload(file.tempFilePath,{
        folder,
        resource_type:"video"        // REQUIRED FOR VIDEOS
    });
}

function isLargeFile(fileSize){
    return (fileSize / (1024*1024)) > 5;   // >5MB
}

// ---------------- Image Upload ----------------
exports.imageUpload = async (req,res) =>{
    try{
        const {name ,url, tags ,email} = req.body;
        const file = req.files.imageFile;

        const SupportedType = ["jpg","jpeg","png"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if(!isSupported(fileType, SupportedType)){
            return res.status(400).json({success:false,message:"File format not supported"});
        }

        const response = await uploadFiletoCloudinary(file,"File-App");

        await File.create({ name,tags,email,url:response.secure_url });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully Uploaded",
        });

    }catch(err){
        console.log("ERROR:",err);
        res.status(500).json({success:false,message:err.message});
    }
};

// ---------------- Video Upload ----------------
exports.videoUpload = async (req,res)=>{
    try{
        const { name,tags,email } = req.body;
        const file = req.files.videoFile;

        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split(".").pop().toLowerCase();

        if(!isSupported(fileType,supportedTypes)){
            return res.status(400).json({success:false,message:"Only MP4/MOV allowed"});
        }

        if(isLargeFile(file.size)){
            return res.status(400).json({success:false,message:"Max video limit = 5MB"});
        }

        console.log("Uploading Video...");
        const response = await uploadVideoToCloudinary(file,"File-App");

        await File.create({ name,tags,email,url:response.secure_url });

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"Video Successfully Uploaded"
        });

    }catch(error){
        console.log("UPLOAD ERROR:",error);
        res.status(500).json({success:false,message:"Video upload failed"});
    }
}
//imageSizeReducer handler
// Upload compressed image to Cloudinary
async function uploadCompressedImage(file, folder, quality = 80){
    return await cloudinary.uploader.upload(file.tempFilePath,{
        folder,
        quality,
        resource_type: "image", 
        transformation: [{ quality }]
    });
}

exports.imageSizeReducer = async (req, res) => {
    try {
        const { name, tags, email } = req.body;
        const file = req.files.imageFile;

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        // 5MB size check
        if (isLargeFile(file.size)) {
            return res.status(400).json({
                success: false,
                message: "File too large (Limit: 5MB)",
            });
        }

        console.log("Compressing & uploading image");

        // Upload with compression
        const response = await uploadCompressedImage(file, "File-App", 70); 
        // reduce 70% quality → smaller size

        await File.create({ name, tags, email, url: response.secure_url });

        return res.json({
            success: true,
            compressedUrl: response.secure_url,
            message: "Compressed Image Uploaded Successfully",
        });

    } catch (error) {
        console.log("Compression Error:", error);
        return res.status(500).json({
            success: false,
            message: "Image compression failed",
        });
    }
};
