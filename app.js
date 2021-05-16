var express=require("express");
var app=express();
var passport=require("passport");
const mongoose=require("mongoose");
const request = require('request');
const http=require("http");
const server=http.createServer(app);
const formatMessage=require("./utils/mesageform");
const localstrategy=require("passport-local");
passportLocalMongoose=require("passport-local-mongoose");
const User=require("./model/user");
app.use(require("express-session")({
    secret:"Any Random String",
    resave:false,
    saveUninitialized:false
}));
// mongoose.connect("mongodb://localhost:27017/wechat", { useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connect("mongodb+srv://newuser:Whyuseaws1@cluster0.hmde5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public")) ;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy({
    usernameField: 'email',
  },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const {userJoin, getCurrentUser}=require("./utils/users");
const socketio=require("socket.io");
const io=socketio(server);


app.get("/",function(req,res){
    if(req.user){
        res.redirect("/selection");
    }else{
    res.render("index.ejs",{curUser:req.user});}
});
var topicdbSchema=new mongoose.Schema({
    name:String,
    imgurl:String
});
var topicdb=new mongoose.model("topicdb",topicdbSchema);
app.get("/news/:id",isloggedin,function(req,res){
    var idd=req.params.id;
    topicdb.find({_id:idd},function(err,ff){
        if(!err && ff.length>0){
            let topic=ff[0]["name"];
            var url="https://newsapi.org/v2/everything?q="+topic+"&sortBy=popularity&apiKey=fca7abc7e5334b0fb7bd9f9ae7b347af"
    request(url,function (error,response,body) {
       if(!error){
           data=JSON.parse(body);
           res.render("news.ejs",{data:data});
       }
       else{
           res.render("notfound.ejs");
       }
    });
        }
        else{
            res.render("notfound.ejs");
        }
    });
    
});
io.on("connection",(socket) => {
socket.on("joinRoom",({username,room})=>{

    const user=userJoin(socket.id,username,room);
    socket.join(user.room);
    socket.emit("hello",formatMessage(username,"jh44gffs"));
    socket.broadcast.to(user.room).emit("hello",formatMessage(username,"jpmk%?00 has joined"));
});
socket.on("chatMessage",({msg,user,room})=>{
    io.to(room).emit("hello",formatMessage(user,msg));
});
// socket.on("disconnect",()=>{
//     io.emit("hello",formatMessage("fas","has left"));
// });
});
app.get("/chat/:id",function(req,res){
    res.render("chat.ejs");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/selection",
    failureRedirect:"/login"
}),function(req,res){
    res.render("login.ejs");
});
app.get("/contact",function(req,res) {
    res.render("contact.ejs");
});
app.get("/login",function(req,res) {
    res.render("login.ejs");
});
app.get("/selection",isloggedin,function(req,res) {
    topicdb.find({},function(error,topics){
        if(error){
            console.log("Error");
        }
        else{
            res.render("selection.ejs",{inte:topics,currUser:req.user});
        }
    });
    
});
app.post("/selection",isloggedin,function(req,res){
    var newtopic=req.body.topic;
    var newimg=req.body.imgurl;
    topicdb.create({
        name:newtopic,
        imgurl:newimg
    },function(error,top){
        if(error){
            console.log("Error occured");
        }
        else{
            console.log("Donr");
        }
    });
    res.redirect("/selection");
});
app.get("/signup",function(req,res) {
    res.render("signup.ejs");
});
app.post("/signup",function(req,res){


    User.register(new User({email:req.body.email,name:req.body.username}),req.body.password,function(error,us){
        if(!error){
            passport.authenticate("local")(req,res,function(){
                return res.redirect("./selection");
            })}
        else{
            console.log(error);
            return res.redirect("./signup");
        }}
    );
});
app.get("/admin",function(req,res)
{
    topicdb.find({},function(error,topics){
        if(error){
            res.send("Error");
        }
        else{
            res.render("adminselection.ejs",{inte:topics});
        }
    });
});
app.get("/change/:id",function(req,res){
    id=req.params.id;
    
    
});
app.get("/remove/:id",function(req,res){
    id=req.params.id;
    topicdb.deleteOne({_id:id},function(error){
        if(!error){
            res.redirect("/admin");
        }
        else{
            res.send("Some Error Occured");
        }
    });
});
app.get("/logout",function (req,res) {
    req.logout();
    res.redirect("./");
});
app.get("/team",function(req,res) {
    res.render("team.ejs",{curUser:req.user}); 
});
// app.get("/verified",function(req,res) {
//     res.render("verified.ejs");
// });
app.get("/addnew",isloggedin,function(req,res){
    res.render("addnew.ejs");
});
app.get("*",function (req,res) {
    res.render("notfound.ejs");
});
server.listen(process.env.PORT || 3000,function() {
    console.log("Server Started!!");
    
});
function isloggedin(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}