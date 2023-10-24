import express from "express"
import {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} from "../controller/colorController.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);
router.get("/:id", getColor);
router.get("/", getallColor);

export default router