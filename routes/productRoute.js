import express from 'express';
import { addToWishlist, createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controller/productController.js';
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/add-product',authMiddleware, isAdmin, createProduct);
router.post('/add-to-wishlist/:id', authMiddleware, addToWishlist)
router.get('/', getAllProducts)
router.get('/:id', getSingleProduct)
router.put('/:id',authMiddleware, isAdmin, updateProduct)
router.delete('/:id',authMiddleware, isAdmin, deleteProduct)
export default router;