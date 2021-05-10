var express=require("express");
var app=express();
const request = require('request');
app.use(express.static("public")) ;
const http=require("http");
const server=http.createServer(app);
const formatMessage=require("./utils/mesageform");
const bodyParser=require("body-parser");
const {userJoin, getCurrentUser}=require("./utils/users");
const socketio=require("socket.io");
const io=socketio(server);
app.use(bodyParser.urlencoded({extended:true}));
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/wechat", { useNewUrlParser: true,useUnifiedTopology: true });
const port=3000 || process.env.PORT;
app.get("/",function(req,res){
    res.render("index.ejs");
});
var topicdbSchema=new mongoose.Schema({
    name:String,
    imgurl:String
});
var topicdb=new mongoose.model("topicdb",topicdbSchema);
app.get("/news/:id",function(req,res){
    idd=req.params.id;
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
io.on("connection",(socket) => {console.log("new web socket created");
socket.on("joinRoom",({username,room})=>{

    const user=userJoin(socket.id,username,room);
    socket.join(user.room);

    console.log(username);
    socket.emit("hello",formatMessage(username,"Welcome"));
    socket.broadcast.to(user.room).emit("hello",formatMessage(username," has joined"));
});
socket.on("chatMessage",({msg,user,room})=>{
    io.to(room).emit("hello",formatMessage(user,msg));
});
socket.on("disconnect",()=>{
    io.emit("hello",formatMessage("fas","has left"));
});
});
app.get("/chat",function(req,res){
    res.render("chat.ejs");
});
app.post("/login",function(req,res){
    res.render("login.ejs");
});
app.get("/contact",function(req,res) {
    res.render("contact.ejs");
});
app.get("/login",function(req,res) {
    res.render("login.ejs");
});
app.get("/selection",function(req,res) {
    let opt=req.query.opt;
    topicdb.find({},function(error,topics){
        if(error){
            console.log("Error");
        }
        else{
            res.render("selection.ejs",{inte:topics});
        }
    });
    
});
app.post("/selection",function(req,res){
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
app.get("/team",function(req,res) {
    res.render("team.ejs"); 
});
app.get("/verified",function(req,res) {
    res.render("verified.ejs");
});
app.get("/addnew",function(req,res){
    res.render("addnew.ejs");
});
app.get("*",function (req,res) {
    res.render("notfound.ejs");
});
server.listen(port,function() {
    console.log("Server Started!!");
    
});