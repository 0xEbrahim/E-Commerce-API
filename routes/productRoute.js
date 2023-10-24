import express from 'express';
import { addToWishlist, createProduct, deleteProduct, getAllProducts, getSingleProduct, rating, updateProduct, uploadImages } from '../controller/productController.js';
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'
import { productImgResize, uploadPhoto } from '../middlewares/uploadImaged.js';
const router = express.Router();

router.post('/add-product',authMiddleware, isAdmin, createProduct);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.post('/add-to-wishlist/:id', authMiddleware, addToWishlist)
router.get('/', getAllProducts)
router.get('/:id', getSingleProduct)
router.put('/rate/:id', authMiddleware, rating)
router.put('/:id',authMiddleware, isAdmin, updateProduct)
router.delete('/:id',authMiddleware, isAdmin, deleteProduct)
export default router;