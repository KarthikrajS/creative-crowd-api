// routes/student.js

import express from "express";
import expressAsyncHandler from "express-async-handler";

import Student from "../models/Student.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Booking from "../models/Booking.js";
import Tutor from "../models/Tutor.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

//get all subjects
router.get("/subjects", async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

// GET all friends
router.get(
  "/not-friends/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);
    const friends = student.friends;
    const _stud = await Student.find({
      $and: [{ _id: { $nin: friends } }, { _id: { $nin: id } }],
    });
    res.json(_stud);
  })
);

// GET all non-friends
router.get(
  "/friends/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);
    const friends = student.friends;
    // console.log("friends", friends);
    const _stud = await Student.find({ _id: { $in: friends } });
    // console.log(students.length, resultArr.length);
    res.json(_stud);
  })
);

// GET student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.find({ user: req.params.id });
    const user = await User.findById(req.params.id);

    if (!student && user)
      return res.status(404).json({ msg: "Student not found" });
    res.json({ student, user });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Student not found" });
    res.status(500).send("Server Error");
  }
});

// POST create student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// PUT update student by ID
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Student not found" });
    res.status(500).send("Server Error");
  }
});

// DELETE student by ID
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.json({ msg: "Student deleted" });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Student not found" });
    res.status(500).send("Server Error");
  }
});

router.post("/addFriend", async (req, res) => {
  const { studentId, friendId } = req.body;
  const student = await Student.findById(studentId);
  const friend = await Student.findById(friendId);

  // console.log("student", student);
  // console.log("friend", friend);

  student.friends.push(friend);
  const newStudent = await student.save();

  res
    .status(200)
    .json({ success: true, message: "Friend added successfully.", newStudent });
});

router.post("/removeFriend", async (req, res) => {
  const { studentId, friendId } = req.body;
  const student = await Student.findById(studentId);

  // Remove the friend from the student's friend list
  student.friends = student.friends.filter((friend) => friend._id != friendId);

  // Save the changes to the student document
  await student.save();

  res.status(200).json({ message: "Friend removed successfully." });
});

router.get(
  "/getBookedSession/:id",
  expressAsyncHandler(async (req, res) => {
    const bookings = await Booking.find({ tutor: req.params.id }).populate([
      "student",
      "tutor",
    ]);

    const studentBookings = await Booking.find({
      student: req.params.id,
    }).populate(["student", "tutor"]);
    // console.log(studentBookings);
    res.json([...bookings, ...studentBookings]);
  })
);

router.get(
  "/getMeetingDetails/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const meeting = await Booking.findOne({ meetingId: id }).populate([
      "student",
      "tutor",
    ]);
    res.json(meeting);
  })
);

router.post(
  "/bookSession",
  middleware.generateToken,
  expressAsyncHandler(async (req, res) => {
    const data = req.body;
    const meetingData = req.meeting.data;
    let tutorType = null;
    const newData = data.map((book) => {
      const { start, end, student, tutor, title, docModel } = book;
      // console.log(docModel)
      tutorType = docModel;
      return {
        student: student,
        studentUrl: meetingData.start_url,
        tutor: tutor,
        tutorUrl: meetingData.join_url,
        startTime: start,
        endTime: end,
        title: title,
        docModel: docModel,
        meetingDetails: meetingData,
        meetingId: meetingData.id,
      };
    });
    var student = data.map((book) => {
      return book.student;
    });

    student = student.filter((item, index) => student.indexOf(item) === index);

    var tutor = data.map((book) => book.tutor);
    tutor = tutor.filter((item, index) => {
      return tutor.indexOf(item) === index;
    });

    const findStudent = await Student.findById(student);

    // console.log("tutorType", tutorType);
    const findTutor =
      tutorType === "Student"
        ? await Student.findById(tutor)
        : await Tutor.findById(tutor);

    // console.log("student -->", findStudent, "tutor--->", findTutor);

    const newBooking = await Booking.insertMany(newData);
    newBooking.forEach((book) => {
      // console.log("book", book);
      findStudent.booking.push(book._id);
      findTutor.booking.push(book._id);
    });

    const newStudent = await findStudent.save();
    const newTutor = await findTutor.save();

    res.json({
      newBooking,
      success: true,
      message: "Bookings created successfully",
    });
  })
);
export default router;
