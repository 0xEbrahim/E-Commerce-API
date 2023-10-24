import express from "express"
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} from "../controller/brandController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);

export default router