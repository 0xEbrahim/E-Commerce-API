import express from 'express';
const router = express.Router();
import {registerUser , login, getAllUsers} from '../controller/userController.js'

router.post('/register', registerUser)
router.post('/login',login)
router.get('/',getAllUsers)
export default router;