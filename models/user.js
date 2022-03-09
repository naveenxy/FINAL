const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')
const validator=require('validator')
const Schema = mongoose.Schema;
const { encrypt}= require('../middlewares/crypto');
const { decrypt}= require('../middlewares/crypto');


    const User = new Schema({

   FirstName: {
        type: String,
      required:true,
        trim:true
    },
    LastName: {
        type: String,
        trim:true,
        required:true
     },
    username:{
        type: String,
       required: true,
        trim:true,
        minlength:5,
        unique:true
    },
    EmailId: {
        type:String,
        required: true,
        trim: true,
        set: encrypt,
        get: decrypt,
        
    },
    PhoneNumber:{
           type:String,
           required: true,
           trim: true,
           maxLenght:10,
          unique:true,
          set: encrypt,
          get: decrypt, 
   },
    password: 
         {
             type:String,
             validate(value){
                 if(!validator.isStrongPassword(value)){
                    throw new Error('strong is invalid')

                 }
             },
               },
   file:
    {
        type:[Schema.Types.ObjectId]
      
    },
    OTP:{
        type:String
    },
    OtpStatus:{
        type:String
    },
    Location:{
        type:String
    }

},{ 
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    //runSettersOnQuery: true
})

    module.exports=mongoose.model("User",User)
