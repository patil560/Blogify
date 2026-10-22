const mongoose = require("mongoose");
const env = require("./env");

async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10
  });
  console.log("MongoDB connected");
}

module.exports = { connectDatabase };
