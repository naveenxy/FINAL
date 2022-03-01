const express=require('express')
const app =express()
const bodyParser=require('body-parser')
const Routes=require('../routes/user')
const Route=require('../routes/file')
const weatherRoute=require('../routes/weather')
const ip=require('../routes/ip')
const mongoose = require('mongoose')
const path = require('path')
const cronJob=require('../middlewares/cronJob')

require('dotenv').config({
   path: path.resolve(__dirname, '../.env')
})
//process.env.TZ = 'Canada/Newfoundland'
//d = new Date()
//console.log(d.getTimezoneOffset())
//console.log(d)
//console.log(d.toLocaleTimeString())
const mongourl = process.env.MONGO_DB
mongoose.connect(mongourl,{ useNewUrlParser: true,useUnifiedTopology: true },()=>     //connected to database
{
    console.log('DataBase Connected Successfully')
}) 

app.use(express.json()) 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/api/user',Routes,Route,weatherRoute,ip)
mongoose.set('useCreateIndex', true);
cronJob.otp()
app.listen(process.env.PORT,()=>    //Listening Server
{
    console.log('Server started at',process.env.PORT)
})
