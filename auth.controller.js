const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.json({ success: true, message: "User registered" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN (IMPORTANT FIX HERE)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // ❌ USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // ❌ WRONG PASSWORD
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ SUCCESS RESPONSE
    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PROTECTED ROUTES
exports.adminPage = (req, res) => {
  res.json({ message: "Welcome Admin" });
};

exports.userPage = (req, res) => {
  res.json({ message: "Welcome User" });
};