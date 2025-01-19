const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    mongoose.set("debug", process.env.NODE_ENV === "development");

    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER_PASS}@social-media.jr4ep.mongodb.net/social-media-project`
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err.message);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
