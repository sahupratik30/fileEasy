const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const path = require("path");
connectDB();
app.use(express.json());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/download"));
app.use("/files/download", require("./routes/download-file"));
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
