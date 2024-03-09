const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
const users = require("./routes/user.routes");
const videos = require("./routes/video.routes");
const shorts = require("./routes/short.routes");
app.use("/api/v1/user", users);
app.use("/api/v1/video", videos);
app.use("/api/v1/short", shorts);

module.exports = app;
