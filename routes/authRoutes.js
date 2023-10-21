import express from 'express';
const router = express.Router();
import {registerUser , login, getAllUsers, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser, deleteMyAccount} from '../controller/userController.js'
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'

router.post('/register', registerUser)
router.post('/login',login)
router.get('/all-users',authMiddleware, isAdmin, getAllUsers)
router.get('/:id',authMiddleware,isAdmin,getSingleUser);
router.delete('/delete-user/:id',authMiddleware,isAdmin, deleteSingleUser);
router.delete('/deleteMyAcount',authMiddleware,deleteMyAccount);
router.put('/updateProfile',authMiddleware, updateSingleUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unBlockUser)


export default router;