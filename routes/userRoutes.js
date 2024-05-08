import express from 'express';
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import {upload} from '../middlewares/image-upload-multer.js';

const router = express.Router()

// Route level Authentication middleware
router.use('/loggeduser', checkUserAuth)
router.use('/changepassword', checkUserAuth)
router.use('/all', checkUserAuth)

//Public Route
router.post('/register', upload.single('profileImage'),UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)
router.get('/test', checkUserAuth, UserController.userTest)


//Private Route
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)

router.get('/all', UserController.allUsers)

export default router