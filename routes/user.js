const express = require("express");
const router = express.Router();
const { isAdmin} = require("../middlewares/authorization");
const { getUsers } = require("../controllers/userController");
router.get("/user", isAdmin, getUsers);
module.exports = router;
