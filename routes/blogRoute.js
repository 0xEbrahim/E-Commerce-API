import express from 'express';
const router = express.Router();
import {createBlog, deleteBlog, getAllBlogs, getSingleBlog, likeBlog, unlikeBlog, updateBlog, uploadImages} from "../controller/blogController.js"
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import { blogImgResize, uploadPhoto } from '../middlewares/uploadImaged.js';

router.post('/create-blog',authMiddleware, isAdmin,createBlog);
router.get('/',authMiddleware, getAllBlogs);
router.get('/:id',authMiddleware, getSingleBlog);
router.delete('/:id',authMiddleware, isAdmin, deleteBlog);
router.put('/:id',authMiddleware, isAdmin, updateBlog);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize, uploadImages)
router.put('/like/:id', authMiddleware, likeBlog);
router.put('/dislike/:id',authMiddleware, unlikeBlog)
export default router