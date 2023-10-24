import express from 'express';
const router = express.Router();
import {createBlog, deleteBlog, getAllBlogs, getSingleBlog, likeBlog, unlikeBlog, updateBlog} from "../controller/blogController.js"
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

router.post('/create-blog',authMiddleware, isAdmin,createBlog);
router.get('/',authMiddleware, getAllBlogs);
router.get('/:id',authMiddleware, getSingleBlog);
router.delete('/:id',authMiddleware, isAdmin, deleteBlog);
router.put('/:id',authMiddleware, isAdmin, updateBlog);
router.put('/like/:id', authMiddleware, likeBlog);
router.put('/dislike/:id',authMiddleware, unlikeBlog)
export default router