const express = require('express');
const app=express();
var passport=require("passport");
const mongoose = require('mongoose');
app.use(require("express-session")({
    secret:"sdarfsvav",
    resave:false,
    saveUninitialized:false
}));
const localstrategy=require("passport-local");
passportLocalMongoose=require("passport-local-mongoose");
const User=require("./model/user");
mongoose.connect("mongodb://localhost:27017/autho", { useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy({
    usernameField: 'email',
  },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",function (req,res) {
    res.render("indexx.ejs");
});
app.post("/",function (req,res) {
    User.register(new User({email:req.body.email}),req.body.password,function(error,us){
        if(!error){
            passport.authenticate("local")(req,res,function(){
                return res.redirect("./pitch");
            })}
        else{
            console.log(error);
            return res.redirect("./pitch");
        }}
    );
   
});
app.get("/pitch",function(req,res){
    res.render("pitch.ejs");
});
app.post("/pitch",passport.authenticate("local",{
    successRedirect:"/suc",
    failureRedirect:"/fail"
}),function(req,res){
});
app.get("/secret",isloggedin,function (req,res) {
    res.render("secret.ejs");
});
app.get("/suc",function(req,res){
    res.send("success");
});
app.get("/fail",function(req,res){
    res.send("failure");
});
app.get("/logout",function (req,res) {
    req.logout();
    res.redirect("./");
});
function isloggedin(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/pitch");
}
app.listen(3000,function (req,res) {
    console.log("Server started");
});