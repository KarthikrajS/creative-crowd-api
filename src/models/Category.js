import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
