//  if (s) {
//     sErr = "Skill already exists";
// } else {
//   const newSkill = new Skill({ title: s, category: cat._id });
//   cat.skills.push(newSkill);
//   isChangeMade = true;
// }
// if (su) {
//   suErr = "Subject already exists";
// } else {
//   const newSubject = new Subject({ title: su, category: cat._id });
//   cat.subjects.push(newSubject);
//   isChangeMade = true;
// }

import expressAsyncHandler from "express-async-handler";
import Skill from "../models/Skill.js";
import Subject from "../models/Subject.js";
import Category from "../models/Category.js";

export const categoryCreate = expressAsyncHandler(async (req, res) => {
  const { category } = req.body;
  console.log(category.title);
  const cat = await Category.find({ title: category.title });
  console.log(cat);
  if (cat.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: `${category.title} already exists` });
  }

  const newcat = new Category({ title: category.title });
  const newCat = await newcat.save();
  res.json({
    message: `${category.title} category created`,
    success: true,
    newCat,
  });
});

export const skillCreate = expressAsyncHandler(async (data) => {
  const { skillTitle, category } = data;
  const skill = Skill.find({ title: skillTitle });
  if (skill) {
    return { errMsg: "Skill already exists" };
  } else {
    const newSkill = new Skill({ title: skill, category: category._id });
    const ski = await newSkill.save();
    category.skills.push(ski);
    return ski;
  }
});

export const subjectCreate = expressAsyncHandler(async (data) => {
  const { subjectTitle, category } = data;
  const subject = Subject.find({ title: subjectTitle });
  if (subject) {
    return { errMsg: "Subject already exists" };
  } else {
    const newSubject = new Subject({ title: subject, category: category._id });
    const sub = await newSubject.save();
    category.subjects.push(sub);
    return sub;
  }
});
