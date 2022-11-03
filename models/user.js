const mongoose=require('mongoose')
 const user= mongoose.Schema({
    name:String ,
    password:String,
    accountType:String
 })

 const User=  mongoose.model('user',user)
 module.exports={User}