const crypto=require('crypto')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
 })
const key = process.env.CRYPTO_SECRET_KEY;


function encrypt(plainText) {
    const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
    const result= Buffer.concat([cipher.update(plainText), cipher.final()]).toString('base64');
return result

}


 function decrypt(text) {
    function de (text){
        const cipherText=Buffer.from(text,"base64")
        const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
        const result = Buffer.concat([cipher.update(cipherText), cipher.final()]).toString('utf8');
        return result
      }
  return ( text===undefined? "Missing": de(text))

 
}


















module.exports.encrypt=encrypt
module.exports.decrypt=decrypt
/*var CryptoJS = require("crypto-js");
 function encrypt(text){
    console.log(text)
    const encryptedtext=   CryptoJS.AES.encrypt(text, 'secret key 123').toString();
    console.log(encryptedtext)
   return encryptedtext
   //return 'U2FsdGVkX1+zal/axZLL7xOPaxG12pSFvLiABa1pzvhPf4f3TAb7geo9Q6mtzyoE'
   

    
}

function decrypt(text){
    console.log(text)
 const bytes= CryptoJS.AES.decrypt(text, 'secret key 123');
const originalText =  bytes.toString(CryptoJS.enc.Utf8);
return  originalText
}*/