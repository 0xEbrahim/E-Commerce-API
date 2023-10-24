import express from 'express';
const router = express.Router();
import {createCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon} from "../controller/couponController.js"
import {isAdmin, authMiddleware} from "../middlewares/authMiddleware.js"

router.post('/create', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons)
router.get('/:id', authMiddleware, isAdmin, getSingleCoupon)
router.put('/:id', authMiddleware, isAdmin, updateCoupon)
router.delete('/:id' ,authMiddleware, isAdmin, deleteCoupon)

export default router