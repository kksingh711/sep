var express=require("express");
var app=express();
const request = require('request');
app.use(express.static("public")) ;
const http=require("http");
const server=http.createServer(app);
const formatMessage=require("./utils/mesageform");
const {userJoin, getCurrentUser}=require("./utils/users");
const socketio=require("socket.io");
const io=socketio(server);
app.get("/",function(req,res){
    res.render("index.ejs");
});
app.get("/news",function(req,res){
    let topic=req.query.newval;
    console.log(topic);
    var url="https://newsapi.org/v2/everything?q="+topic+"&sortBy=popularity&apiKey=fca7abc7e5334b0fb7bd9f9ae7b347af"
    request(url,function (error,response,body) {
       if(!error){
           data=JSON.parse(body);
           res.render("news.ejs",{data:data});
       }
       else{
           res.send(error);
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
app.get("/reqnews",function (req,res) {
    res.render("reqnews.ejs");
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
    res.render("selection.ejs");
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
app.get("*",function (req,res) {
    res.render("notfound.ejs");
});
server.listen(3000,function() {
    console.log("Server Started!!");
    
});