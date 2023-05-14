const express = require("express");
const router = express.Router();
const { validateRegister,validateLogin } = require("../middlewares/validation");
const {
register,
login,
} = require("../controllers/authController");
// create new user
router.post("/register", validateRegister, register);
// Log in an existing user
router.post("/login", validateLogin,login);
module.exports = router;