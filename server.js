const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const env = require('./env.js')
const flash = require('express-flash')
const session = require('express-session')
const passport= require('passport');
const LocalStrategy =  require('passport-local').Strategy

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:env.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
mongoose.connect(env.env.uri, { useNewUrlParser : true, useUnifiedTopology : true});

let userSchema = new mongoose.Schema({
    'name' : {type: String, required: true},
    'password' : {type: String, required: true},
    'username' : {type: String, required: true},
});
let User=mongoose.model('portfolioMaker', userSchema)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, async function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: "No user found"}); }
        
        try{
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }
            else{
                return  done(null,false, {message:'Password Incorrect'})
            }
        }
        catch(e){
            return done(e)
        }
        return done(null, user);
      });
    }
  ));
  
app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),(req, res)=> {
        res.redirect('/');
});

app.get('/',checkAuthenticated,(req,res)=>{        
    res.render('index.ejs',{username : req.user.name})
})

app.get('/login',(req,res)=>{
    res.render('login.ejs', {expressFlash: req.flash('message') })
})

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs', {expressFlash: req.flash('message') })
})


//--register--
app.post('/register',async (req,response)=>{
    try{
        let hashedPassword = await bcrypt.hash(req.body.password,10);
        console.log(hashedPassword)
        let newUser={
            name : req.body.name,
            username : req.body.username,
            password :hashedPassword
        };
        console.log(newUser);
        User.findOne(
            {username: newUser.username},
            (err,res)=>{
                if(err)
                    return console.error(err);
                if(res!=undefined)
                {
                    req.flash('message', 'User already exists.');
                    response.redirect('/register');
                    return;
                }
                let saveUser=new User(newUser);
                saveUser.save((err,savedUser)=>{
                    if(err)
                    return console.error(err);
                    req.flash('message', 'User saved sucessfully.');
                    response.redirect('/login');
                })
            }
        )
        
    } catch{
        res.redirect('/register')
    }
})
//--register--


app.post('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(5000)