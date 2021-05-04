var express=require("express");
var app=express();
app.use(express.static("public")) ;
app.get("/",function(req,res){
    res.render("index.ejs");
});
app.get("/:a/:b",function (req,res) {
    res.send(req.params.a);
})
app.get("*",function (req,res) {
    res.send("<h1>Wrong URL</h1>");
});
app.listen(3000,function() {
    console.log("Server Started!!");
    
});