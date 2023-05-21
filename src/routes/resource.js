import express from "express";
import expressAsyncHandler from "express-async-handler";
import { createResource } from "../controllers/resource.controllers.js";
import Resource from "../models/Resource.js";
import Student from "../models/Student.js";

const router = express.Router();

//create a new resourse by student - default user
router.post(
  "/:id/createResource",
  expressAsyncHandler(async (req, res) => {
    console.log("called");
    console.log(req.body);
    // const { title, description, url, type } = req.body;
    const resource = await createResource(req.body);
    const userId = req.params.id;
    const user = await Student.findOne({ user: userId });
    console.log(user);
    user.resources.push(resource);
    const newUser = await user.save();
    return res.status(201).json(newUser.resources);
  })
);

//get all resources
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const student = await Student.findOne({ user: id }).populate("resources");
    console.log(student)
    // const resources = await Resource.find({ user: id });
    // console.log(resources)
    res.json(student);
  })
);

export default router;
