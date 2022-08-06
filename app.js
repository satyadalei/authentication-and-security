require('dotenv').config() ;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

// console.log(process.env.SECRETKEY);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/loginDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});
// DO NOT CHANGE THIS KEY ---- DO NOT CHANGE THIS KEY ---- DO NOT CHANGE THIS KEY
// DO NOT CHANGE THIS KEY ---- DO NOT CHANGE THIS KEY ---- DO NOT CHANGE THIS KEY 
// userSchema.plugin(encrypt , {secret:process.env.SECRETKEY, encryptedFields:["password"]});
const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register", function(req,res){
   const newUser = new User({
    email : req.body.username,
    password : md5(req.body.password)
   });
   newUser.save();
   res.render("secrets");
});


app.post("/login", function(req,res){
    const userEmail = req.body.username;
    const userPassword = md5(req.body.password);
    User.findOne({email : userEmail}, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(userPassword === foundUser.password){
                    res.render("secrets");
                }else{
                    res.send("You have entered wrong password");
                }   
            }else{
                res.send("You do not have account");
            } 
        }
    });
});

app.listen(3000, function(){
    console.log("Server started at 3000 port successfully");
});