const express = require("express");
const router = express.Router();

const {
    receiveSoftwareData,
} = require("../controllers/fetchSoftware");

router.post("/software", receiveSoftwareData);

module.exports = router;