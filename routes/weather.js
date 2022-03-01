const express=require('express')
const router =express.Router()
const weatherService=require('../services/weatherService')
router.post('/location',weatherService.findweather)
module.exports=router