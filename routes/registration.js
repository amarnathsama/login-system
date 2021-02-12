// var express = require('express');
// var router = express.Router();
// const bcrypt = require('bcrypt')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
// const env = require('./env.js')
// const app=express()

// router.set('view-engine','ejs')
// router.use(express.urlencoded({extended:false}))

// mongoose.connect(env.env.uri, { useNewUrlParser : true, useUnifiedTopology : true});

// let userSchema = new mongoose.Schema({
//     'name' : {type: String, required: true},
//     'password' : {type: String, required: true},
//     'username' : {type: String, required: true},
// });
// let User=mongoose.model('portfolioMaker', userSchema)
  

// router.post('/register',async (req,response)=>{
//     try{
//         let hashedPassword = await bcrypt.hash(req.body.password,10);
//         console.log(hashedPassword)
//         let newUser={
//             name : req.body.name,
//             username : req.body.username,
//             password :hashedPassword
//         };
//         console.log(newUser);
//         User.findOne(
//             {username: newUser.username},
//             (err,res)=>{
//                 if(err)
//                     return console.error(err);
//                 if(res!=undefined)
//                 {
//                     response.json('user already exists');
//                     return;
//                 }
//                 let saveUser=new User(newUser);
//                 saveUser.save((err,savedUser)=>{
//                     if(err)
//                     return console.error(err);
//                     response.json('user saved sucessfully');
//                     return;
//                 })
//             }
//         )
        
//     } catch{
//         res.redirect('/register')
//     }
// })
// module.exports = router

