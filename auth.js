var express=require("express");
const passport = require("passport");
var app=express();
var bodyPaeser=require("body-parser");
var user=require("./model/user");
app.use(express.static("public"));
app.use(passport.initialize());
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/autho", { useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyPaeser.urlencoded({extended:true}));
app.use(passport.session());
app.use(require("express-session")({
    secret: "Hello this can be anything and is used to encode and decode",
    resave:false,
    saveUninitialized:false
}));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


var topicdb=new mongoose.model("topicdb",topicdbSchema);
app.get("/",function (req,res) {
    res.render("signupp.ejs");
});
app.post("/",function(req,res){
    console.log(req.body.username);
    console.log(req.body.password);
    user.register(new user({user:req.body.username}),req.body.password,function(err,use) {
        if(!err){
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secret");
            })
        }else{
            console.log("errir");
            res.render("signupp.ejs");
        }
    });
});
app.get("/secret",function (req,res) {
    res.render("notfound.ejs");
});
app.listen(3000,function () {
    console.log("Server started");
});