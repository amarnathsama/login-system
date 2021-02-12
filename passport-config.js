const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

mongoose.connect(env.env.uri, { useNewUrlParser : true, useUnifiedTopology : true});

let userSchema = new mongoose.Schema({
    'name' : {type: String, required: true},
    'password' : {type: String, required: true},
    'username' : {type: String, required: true},
});
let User=mongoose.model('portfolioMaker', userSchema)
  

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser  = async (email,password,done)=>{
        // User.findOne({username: })
        const user = getUserByEmail(email)
        if(user == null){
            return done(null,false, {message:'No user with that username'})
        }

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
    }
    passport.use(new LocalStrategy({usernameField: 'username', passwordField:'password'}, authenticateUser))
    passport.serializeUser((user,done)=>done(null, user.id))
    passport.deserializeUser((user,done)=>{ })
}

module.exports = initialize