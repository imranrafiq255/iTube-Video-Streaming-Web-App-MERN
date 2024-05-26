const app = require("./app");
const databaseConnection = require("./config/database.config");
const cloudinary = require("cloudinary");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
databaseConnection(process.env.MONGO_URI);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.get("/", (req, res) => {
  res.send("deployed");
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`The server is running on: ${process.env.SERVER_PORT}`);
});
