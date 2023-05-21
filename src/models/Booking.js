import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentUrl: {
    type: String,
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "docModel",
  },
  tutorUrl: {
    type: String,
    required: true,
  },
  docModel: {
    type: String,
    required: true,
    enum: ["Student", "Tutor"],
    default: "Student",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  meetingId:{
    type : String,
  },
  meetingDetails: {
    type: Object,
  },
  // duration: {
  //   type: Number,
  //   required: true,
  // },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  // date: {
  //   type: Date,
  //   required: true,
  // },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// module.exports = mongoose.model('Booking', bookingSchema);
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
