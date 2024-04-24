const express = require('express')
const { addUser, emailVerify, forgetPassword, resetPassword, SignIn, signOut, resendVerification, getAllUsers } = require('../Controller/userController')
const router = express.Router()

router.post('/register',addUser)
router.get('/confirm/:token',emailVerify)
router.post('/resendverification',resendVerification)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.post('/signin',SignIn)
router.get('/signout',signOut)
router.get('/users', getAllUsers)


 module.exports= router