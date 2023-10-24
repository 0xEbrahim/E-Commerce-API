import express from 'express';
const router = express.Router();
import {registerUser , login, getAllUsers, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser, deleteMyAccount, handleRefreshToken, logOut, forgotPasswordToken, changePassword, resetPassword, adminLogin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus} from '../controller/userController.js'
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'


router.post('/register', registerUser)
router.post('/login',login)
router.post('/admin-login', adminLogin)
router.post('/cart', authMiddleware, userCart)
router.post('/cart/create-order',authMiddleware, createOrder)
router.post('/cart/apply-coupon',authMiddleware, applyCoupon)
router.post('/forgot-password', forgotPasswordToken)
router.get('/refresh', handleRefreshToken)
router.get('/get-cart',authMiddleware, getUserCart)
router.get('/wishlist', authMiddleware, getWishlist)
router.get('/logout',logOut)
router.get('/all-users',authMiddleware, isAdmin, getAllUsers)
router.get('/cart/orders',authMiddleware, getOrders)
router.get('/:id',authMiddleware,isAdmin,getSingleUser);
router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete('/delete-user/:id',authMiddleware,isAdmin, deleteSingleUser);
router.delete('/deleteMyAcount',authMiddleware,deleteMyAccount);
router.put('/address', authMiddleware, saveAddress)
router.put('/updateProfile',authMiddleware, updateSingleUser)
router.put('/change-password',authMiddleware,changePassword);
router.put('/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unBlockUser)
router.put('/reset-password/:token', resetPassword);

export default router;