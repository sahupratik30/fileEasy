require("dotenv").config();
const router = require("express").Router();
const File = require("../models/file");
router.get("/:uuid", async (req, res) => {
  //Check if file present in database.
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has expired!" });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    res.status(500).render("download", { error: "Something went wrong" });
  }
});
module.exports = router;
