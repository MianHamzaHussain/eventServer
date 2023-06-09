const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("name email _id");
    res.json({ users, message: "Events Fetched Succesfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers };
