var express = require("express");
var router = express.Router();
const cors = require("cors");

router.use(cors());

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
