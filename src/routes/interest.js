import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Skill from "../models/Skill.js";
import Subject from "../models/Subject.js";
import {
  categoryCreate,
  skillCreate,
  subjectCreate,
} from "../controllers/interest.controllers.js";

const router = express.Router();

router.post("/createCategory", categoryCreate);

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const categoryList = await Category.find().populate(["subjects", "skills"]);
    res.json({ success: true, categoryList });
  })
);
router.post(
  "/createSkills",
  expressAsyncHandler(async (req, res) => {
    const { category, skills } = req.body;
    const cat = await Category.find({ title: category.title });
    const _docs = skills?.map((s) => {
      if (s.__isNew__) {
        return { title: s.title, category: cat[0]._id };
      }
    });

    const newSkills = await Skill.insertMany(_docs);
    cat[0].skills.push(
      ...newSkills.map((s) => {
        return s._id;
      })
    );
    const newCatagoty = await cat[0].save();
    res.json({ success: true, message: "Skills created", newCatagoty });
  })
);

router.post(
  "/createSubjects",
  expressAsyncHandler(async (req, res) => {
    const { category, subjects } = req.body;
    const cat = await Category.find({ title: category.title });
    const _docs = subjects?.map((s) => {
      if (s.__isNew__) {
        return { title: s.title, category: cat[0]._id };
      }
    });
    const newSubjects = await Skill.insertMany(_docs);
    cat[0].subjects.push(
      ...newSubjects.map((s) => {
        return s._id;
      })
    );
    const newCatagoty = await cat[0].save();
    res.json({ success: true, message: "Subjects created", newCatagoty });
  })
);
export default router;
