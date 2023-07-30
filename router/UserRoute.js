const express = require('express')
const { addUser } = require('../Controller/userController')
const router = express.Router()

router.post('/register',addUser)
 module.exports= router