import express from "express";
const router = express.Router();

// Import the Tutor model
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";
// import Course from '../models/course';
import Review from "../models/Review.js";
import Student from "../models/Student.js";
import Booking from "../models/Booking.js";
import Course from "../models/Course.js";
import { createResource } from "../controllers/resource.controllers.js";
import expressAsyncHandler from "express-async-handler";
import Subject from "../models/Subject.js";

// Search for tutors based on subject and availability
router.get("/search", async (req, res) => {
  try {
    const subject = req.query.subject;
    const availability = req.query.availability;
    const searchTerm = req.query.searchTerm;

    // Query the database for tutors matching the given criteria
    const tutors = await Tutor.find({
      subjects: { $in: [subject] },
      availability: { $in: [availability] },
    });

    const users = await User.find({ username: { $regex: searchTerm } });
    // console.log(searchTerm, users);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET tutor details by ID - working - reviews yet to integrate
router.get("/:id", async (req, res) => {
  try {
    // console.log(req.params);
    let courses = [];
    const tutor_details = await Tutor.findOne({ user: req.params.id });
    tutor_details?.courses?.forEach(async (course) => {
      //   console.log(course.toString());
      const course1 = await Course.findById(course.toString());
      courses.push(course1);
    });

    const reviews = await Review.find({ tutorId: req.params.id });
    const user = await User.findById(req.params.id);

    if (!tutor_details) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    return res.json({ tutor: { user, tutor_details, reviews, courses } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Create a new tutor - working as expected
router.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.id);
    user.userType = "tutor";
    const subs = req.body.subjects;

    const _docs = subs?.new?.map((s) => ({ title: s.label }));
    const subjects = await Subject.insertMany(_docs);

    const tutor = new Tutor({
      user: user,
      name: req.body.name,
      email: req.body.email,
      subjects: [...subs.existing, ...subjects.map((s) => s._id)],
      availability: req.body.availability,
      // resources: req.body.resources,
      location: req.body.location,
    });

    const newTutor = await tutor.save();
    const newUser = await user.save();
    res.status(201).json({ newTutor, newUser });
  })
);

//create new course - working as expected
router.post("/:id/createCourse", async (req, res) => {
  console.log(req.params.id);
  try {
    const tutor = await Tutor.findOne({ user: req.params.id });

    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      subject: req.body.subject,
      tutor: req.params.id,
    });
    try {
      const newCourse = await course.save();
      //   console.log("tutor", tutor);
      const existing_courses = tutor.courses;

      //   console.log("existing_courses", existing_courses);
      existing_courses.push(newCourse);
      //   console.log(existing_courses);
      tutor.courses = existing_courses;
      const updatedTutor = await tutor.save();

      res.status(201).json({ newCourse, updatedTutor });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a tutor by id
router.patch("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (req.body.name != null) {
      tutor.name = req.body.name;
    }

    if (req.body.email != null) {
      tutor.email = req.body.email;
    }

    if (req.body.subjects != null) {
      tutor.subjects = req.body.subjects;
    }

    if (req.body.courses != null) {
      const existing_courses = req.body.courses;
      tutor.courses[0] = tutor.courses[0].append(existing_courses);
    }

    if (req.body.availability != null) {
      tutor.availability = req.body.availability;
    }

    if (req.body.resources != null) {
      tutor.resources = req.body.resources;
    }

    const updatedTutor = await tutor.save();
    res.json(updatedTutor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a tutor by id - working as expected
router.delete("/:id", async (req, res) => {
  try {
    await Tutor.findOneAndUpdate(
      { user: req.params.id },
      { $set: { status: "disabled" } },
      { upsert: true }
    );
    res.json({ message: "Tutor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tutors - working as expected
router.get("/", async (req, res, next) => {
  const tutors = await Tutor.find({
    status: { $nin: ["pending", "disabled"] },
  }).populate(["courses","subjects","user"]);
  res.json(tutors);
});

// Get courses by tutor id
// router.get("/:id/courses", async (req, res) => {
//   try {
//     const courses = await Course.find({ tutor: req.params.id });
//     res.json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Add tutor - not tested - later on
router.post("/", async (req, res) => {
  const user = User.findById(req.params.id);
  const tutor = new Tutor({
    name: user.username,
    email: user.email,
    // about: req.body.about,
    // hourlyRate: req.body.hourlyRate,
  });
  try {
    const newTutor = await tutor.save();
    res.status(201).json(newTutor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add course to tutor
// router.post("/:id/courses", async (req, res) => {
//   const course = new Course({
//     title: req.body.title,
//     description: req.body.description,
//     tutor: req.params.id,
//   });
//   try {
//     const newCourse = await course.save();
//     const tutor = await Tutor.findById(req.params.id);
//     tutor.courses.push(newCourse._id);
//     await tutor.save();
//     res.status(201).json(newCourse);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Get reviews by tutor id
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get all subjects
router.get("/subjects", async (req, res) => {
  const subjects = await Subject.find({});
  res.json(subjects);
});

router.post("/subject", async (req, res) => {
  console.log(req.body);
  const subject = await Subject(req.body);
  res.json(subject);
});

// Add review to tutor
router.post("/reviews", async (req, res) => {
  const review = new Review({
    studentId: req.body.studentId,
    tutorId: req.body.tutorId,
    rating: req.body.rating,
    reviewText: req.body.reviewText,
  });
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//booking a tutor - later on
router.post("/:id/book", async (req, res) => {
  const { studentId, date, time, courses } = req.body;

  try {
    const tutor = await Tutor.findById(req.params.id);
    const student = await Student.findById(studentId);

    const booking = new Booking({
      tutor: tutor.id,
      student: student.id,
      date,
      time,
      courses,
    });

    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;

class TutorError extends Error {
  constructor(message = "Something went wrong...", status = 500) {
    super(message);

    this.message = message;
    this.statusCode = status;
  }
}
