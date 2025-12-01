import crypto from "crypto";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendResetPassword from "../utils/sendResetPassword.js";

const setAuthCookie = (res, token) => {
  res.cookie(process.env.COOKIE_NAME || "token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });
};

export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.status(201).json({ message: "User created", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.json({ message: "Logged in", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie(process.env.COOKIE_NAME || "token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: "Logged out" });
};

export const getProfile = (req, res) => {
  res.json({ user: req.user });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
    await sendResetPassword(email, resetURL);

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

export const adminGetUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
