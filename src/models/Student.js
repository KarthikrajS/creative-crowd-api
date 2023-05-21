import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    //
    type: String,
    required: false,
  },
  bannerImage: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skills",
      proficiency: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
    },
  ],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  // resources: [
  //   {
  //     title: { type: String, required: true },
  //     url: { type: String, required: true },
  //   },
  // ],
  bookedTutors: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
      },
      date: {
        type: Date,
        required: true,
      },
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      likedSubjects: [
        {
          type: String,
        },
      ],
      subscribedTopics: [
        {
          type: String,
        },
      ],
    },
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  booking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

// module.exports = mongoose.model('Student', studentSchema);

const Student = mongoose.model("Student", studentSchema);

export default Student;
