import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import {
  addMockup,
  removeMockup,
  listMockups,
  addCustomizedMockup,
  listCustomizedMockups,
  updateMockup,
} from "../controllers/mockupController.js";
import authMiddleware from "../middleware/auth.js";

const mockupRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

mockupRouter.post("/add", upload.fields([
  { name: "imageFront", maxCount: 1 },
  { name: "imageBack", maxCount: 1 }
  ]), addMockup);
mockupRouter.delete("/remove/:id", removeMockup);
mockupRouter.get("/list", listMockups);
mockupRouter.put("/update/:id", upload.fields([
  { name: "imageFront", maxCount: 1 },
  { name: "imageBack", maxCount: 1 }
]), updateMockup);

// Customized Mockups APIs
mockupRouter.post("/custom/save", authMiddleware, addCustomizedMockup);
mockupRouter.get("/custom/list", authMiddleware, listCustomizedMockups);

export default mockupRouter;
