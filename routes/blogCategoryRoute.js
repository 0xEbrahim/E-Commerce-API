import express from "express"
import {createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory} from "../controller/blogCategoryController.js"
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/create',authMiddleware, isAdmin, createCategory)
router.get('/', authMiddleware, getAllCategories);
router.get('/:id',authMiddleware, getSingleCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

export default router