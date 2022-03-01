const express=require('express')

const router =express.Router()
 const ipService=require('../services/ipService')
 router.post('/saveip',ipService.saveIP)
 router.get('/checkip',ipService.checkIP)
 module.exports=router