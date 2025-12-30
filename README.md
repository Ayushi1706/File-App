# File-App
A File Upload Application developed using Node.js, Express.js, MongoDB, and Cloudinary.  
The application supports image upload, video upload, compressed image upload, and local file storage. File details are stored in MongoDB, and an automatic email notification is sent after successful upload.

---

## Features

- Upload images to Cloudinary
- Video upload with size and format validation
- Compressed image upload with quality reduction
- Local file upload support
- File details stored in MongoDB
- Email alert on successful upload
- Secure validation for file size and format
- Structured and scalable backend architecture

---

## Tech Stack

| Technology | Purpose |
|----------|----------|
| Node.js | Backend environment |
| Express.js | Server-side framework |
| MongoDB + Mongoose | Database and schema modeling |
| Cloudinary | Cloud storage for media files |
| Nodemailer + Mailtrap | Email notifications |
| express-fileupload | Handling uploads |
| JavaScript | Primary programming language |

---

## Project Structure
File-App/
├── config/
│   ├── cloudinary.js
│   ├── database.js
├── controllers/
│   └── fileUpload.js
├── models/
│   └── File.js
├── routes/
│   └── fileUpload.js
├── .env
├── index.js


---

## Preview

Email notification generated after file upload:



---
