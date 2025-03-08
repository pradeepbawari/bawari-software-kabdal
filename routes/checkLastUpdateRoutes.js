// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const { getLastUpdatedTimestamp } = require("../controllers/checkLastUpdateController");

router.post("/checkLastUpdate", getLastUpdatedTimestamp);

module.exports = router;
