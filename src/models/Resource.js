import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "video", "audio"],
    required: true,
    default: "image",
  },
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "published", "archived", "deleted"],
    required: true,
    default: "pending",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  subjects: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  categorys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Resource = mongoose.model("Resource", ResourceSchema);

export default Resource;
