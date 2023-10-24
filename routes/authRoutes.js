import express from 'express';
const router = express.Router();
import {registerUser , login, getAllUsers, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser, deleteMyAccount, handleRefreshToken, logOut, forgotPasswordToken, changePassword, resetPassword} from '../controller/userController.js'
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'


router.post('/register', registerUser)
router.post('/login',login)
router.post('/forgot-password', forgotPasswordToken)
router.get('/refresh', handleRefreshToken)
router.get('/logout',logOut)
router.get('/all-users',authMiddleware, isAdmin, getAllUsers)
router.get('/:id',authMiddleware,isAdmin,getSingleUser);
router.delete('/delete-user/:id',authMiddleware,isAdmin, deleteSingleUser);
router.delete('/deleteMyAcount',authMiddleware,deleteMyAccount);
router.put('/updateProfile',authMiddleware, updateSingleUser)
router.put('/change-password',authMiddleware,changePassword);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unBlockUser)
router.put('/reset-password/:token', resetPassword);

export default router;