const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/file");
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb

router.post("/", (req, res) => {
  //Upload File
  upload(req, res, async (err) => {
    //Validate data
    if (!req.file) {
      return res.status(401).json({ error: "All fields are required!" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //Save to Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    //Send response=>link
    const response = await file.save();
    return res.json({ file: `${process.env.APP_URL}/files/${response.uuid}` });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  //Validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required!" });
  }
  //Fetch data from database
  const file = await File.findOne({ uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent!" });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();
  //Send Email
  const sendMail = require("../services/sendEmail");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "fileEasy file sharing",
    text: `${emailFrom} shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_URL}/files/${file.uuid}`,
      size: `${file.size / 1000} KB`,
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});
module.exports = router;
