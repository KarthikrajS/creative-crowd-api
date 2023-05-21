import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { loginUser, regiserUser } from "../controllers/auth.controllers.js";

const router = express.Router();

// Login Route
router.post("/login", loginUser);

// Signup Route
router.post("/signup", regiserUser);

export default router;
