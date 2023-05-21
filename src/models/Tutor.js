import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  availability: [
    {
      dayOfWeek: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  // resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "disabled"],
    required: true,
    default: "pending",
  },
  booking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;
