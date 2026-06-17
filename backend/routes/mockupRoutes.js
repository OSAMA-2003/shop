import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import {
  addMockup,
  removeMockup,
  listMockups,
} from "../controllers/mockupController.js";

const mockupRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

mockupRouter.post("/add", upload.single("image"), addMockup);
mockupRouter.delete("/remove/:id", removeMockup);
mockupRouter.get("/list", listMockups);

export default mockupRouter;