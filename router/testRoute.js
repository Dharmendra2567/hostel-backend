const { testFunction } = require("../Controller/testController");
const express= require('express')
const router = express.Router()


router.get('/test',testFunction)

module.exports= router