const express = require('express')
const { addRoom, getAllRooms } = require('../Controller/RoomController')
// const upload = require('../utils/fileUpload')
const upload = require('../utils/fileUpload')
const router = express.Router()

router.post('/addroom',upload.single('room_image'),addRoom)
router.get('/getallrooms', getAllRooms)

module.exports=router