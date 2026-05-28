const express = require("express");
const router = express.Router();

const {
  register,
  login,
  adminPage,
  userPage,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/admin", authMiddleware, roleMiddleware("admin"), adminPage);
router.get("/user", authMiddleware, roleMiddleware("user"), userPage);

module.exports = router;