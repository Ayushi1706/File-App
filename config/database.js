const mongoose =  require("mongoose");
require("dotenv").config();
exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Database Connection Established"))
    .catch((err) => {
        console.log("Connection Issues with Database");
        console.error("Error ->", err.message);
    });
};