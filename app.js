const express = require('express');
const mongoose= require('mongoose');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const secret="sdoeruencie3023";
const {User}=require('./models/user');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
mongoose
.connect(
  'mongodb://localhost:27017/users',{useUnifiedTopology:true,useNewUrlParser:true})
  .then(result=>{
      
      
      app.listen(3000 ) ;
      console.log('connected')  
  })
.catch(err=>{
  console.log(err)
})

// get all users based on role
app.get('/users',userfilter, (req, res) => {
    
    if(req.user.accountType=='admin'){
        User.find({accountType:{$ne:'admin'}},(e,d)=>{
            // all except admins
        //    const data=d.filter(e=>e.accountType!='admin')
           res.send({data:d});

        })

    }else{

      User.find({},(e,d)=>{
         //only sending that user
           res.send({data:req.user});

        })
    }
  
    
 

})
//login 
app.post('/login',authorization,(req,res)=>{
    //getting user after authrization
    const user=req.user;
    res.send({user,'message':'welcome back'})

})
//create user
app.post('/users',(req,res)=>{
   
    const x=  new User({
        name:req.body.name,
        password:req.body.password,
        accountType:req.body.type,
     })
     x.save();
    
    const user={
        name:req.body.name,
        password:req.body.password,
        accountType:req.body.type,
     }
      const accessToken=jwt.sign(user,secret)
    res.status(200);
    res.json({accessToken:accessToken,message:'created account'})
    


})
//filter midle ware
function userfilter(req,res,next){
    const auth=req.headers['authorization'];
   
    jwt.verify(auth,secret,(err,data)=>{
        if(err){
             res.status(403);
             res.send('Error ! Please send correct token');
             return;
        }
        //setting user in req after veriftying for further process
        req.user=data;
        next();

    })

}
// login authenticaton middlw are
function authorization(req,res,next){
    const auth=req.headers['authorization'];
   
    jwt.verify(auth,secret,(err,data)=>{
        if(err){
             res.status(403);
             res.send('Error Loging Please send correct token');
             return;
        }
        //setting user in req after veriftying for further process
        req.user=data;
        next();

    })

}
