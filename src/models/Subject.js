import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // value: {
  //   type: Number,
  //   required: true,
  // },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
