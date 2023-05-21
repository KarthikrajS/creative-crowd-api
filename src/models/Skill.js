import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
