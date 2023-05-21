import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import Tutor from "../models/Tutor.js";

export const regiserUser = asyncHandler(async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create a new user
    const user = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    const newUser = await user.save();

    //create a new Student
    const student = new Student({
      user: newUser,
      name: username,
      email: email,
    });

    //save the student to database
    await student.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Send the token and user details in the response
    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    const student = await Student.find({ user: user._id });
    const tutor = await Tutor.find({ user: user._id });

    if (!user && !student)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    if (student !== null) {
      // console.log(student);
      // Create and assign token
      const payload = {
        email: user.email,
        _id: user._id,
        userType: user.userType,
        username: user.username,
        student: student,
        tutor: tutor,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res
        .header("auth-token", token)
        .json({ success: true, message: "Logged In", token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
