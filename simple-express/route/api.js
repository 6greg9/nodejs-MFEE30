const express = require("express");
const router = express.Router();

const connection = require("../util/db");

// TODO: router.use, router.get, ...
router.get("/", async (req, res) => {
    let result  = await connection.queryAsync("SELECT * FROM stock;");
    res.json(result);
});
module.exports = router;