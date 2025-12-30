const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    },
    tags: {
        type: String,
    },
    email: {
        type: String,
    }
});


fileSchema.post("save", async function (doc) {
    try {
        console.log("DOC Saved:", doc);

        // 1. Create transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,       
            port: 587,                              
            secure: false,
            auth: {
                user: process.env.MAIL_USER,   
                pass: process.env.MAIL_PASS    
            }
        });

        // 2. Send Email
        let info = await transporter.sendMail({
            from: `XYZ`,
            to: doc.email,
            subject: "New File Uploaded on Cloudinary",
            html: `<h2>Hello ${doc.name} </h2> 
            <p>File has been successfully Uploaded </p>
            <p>View here: <a href="${doc.url}">${doc.url}</a></p>
            `,
        });

        console.log("INFO of mail", info);


    } catch (err) {
        console.error("Mail Error:", err);
    }
});



const File = mongoose.model("File",fileSchema);
module.exports = File;