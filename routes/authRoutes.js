import { Router } from "express";
import { body } from "express-validator";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  adminGetUsers
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

const signupValidation = [
  body("name").isLength({ min: 2 }).withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  body("role").optional().isIn(["user", "admin"]).withMessage("Role invalid")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

const forgotValidation = [body("email").isEmail().withMessage("Valid email required")];
const resetValidation = [body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")];

router.post("/signup", signupValidation, signup);
router.post("/login", loginLimiter, loginValidation, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotValidation, forgotPassword);
router.post("/reset-password/:token", resetValidation, resetPassword);
router.get("/profile", protect, getProfile);
router.get("/admin/users", protect, authorizeRoles("admin"), adminGetUsers);

export default router;
