const router = require("express").Router();
const { builtinModules } = require("module");
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  //Check for file in database
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.status(404).render("download", { error: "Link has expired!" });
  }
  const filePath = `${__dirname}/../${file.path}`;
  return res.download(filePath);
});
module.exports = router;
