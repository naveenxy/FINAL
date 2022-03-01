const express=require('express')
const mongoose = require('mongoose')
const IPrules=require('../models/ipModel')

const SaveIPaddr=async(req,res)=>{
       const ip =new IPrules({
        Address:req.body.Address,
        Start_Address:req.body.Start_Address,
        End_Address:req.body.End_Address,
        Star_Address:req.body.Star_Address
 })
    ip.save(function(err,result){
            if (err){
                console.log('error in db')
            }
         res.send("Ip Saved")
        } )}

const checkIPaddr=async(req,res)=>{

  const result=  await IPrules.find()
return result}
module.exports={SaveIPaddr,checkIPaddr}
 