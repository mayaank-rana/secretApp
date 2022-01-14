require('dotenv').config();
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require("ejs")
const app=express()
const mongoose=require('mongoose')

// we use hashing...so removing mongoose encryption
//const encrypt=require('mongoose-encryption')
//const md5=require('md5')
const bcrypt=require('bcrypt')
const saltRounds=10;

mongoose.connect("mongodb://localhost:27017/userDB")

//console.log(process.env.API_KEY)



const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

//const secret="thisisasecret.";

//using .env secret here
//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User= new mongoose.model("User",userSchema)

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser=new User({
            email:req.body.username,
            password:hash
        })
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        })
    })

    
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password= req.body.password;
    
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result===true){
                        res.render("secrets");
                    }
                })
            }
        }
    })
     
})



app.listen(5000,function(){
    console.log('server listening at port 5000.....');
})