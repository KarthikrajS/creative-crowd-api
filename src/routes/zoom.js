import express from "express";
import { generate } from "../controllers/zoom.controllers.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();


router.post("/generate", middleware.generateToken ,generate)
export default router;
