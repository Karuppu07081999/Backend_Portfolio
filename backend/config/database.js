
const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  
  console.log(MONGO_URI,"DB")

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully, Connected to Database !!!!!");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};


