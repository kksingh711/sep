const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/wechat", { useNewUrlParser: true,useUnifiedTopology: true });
var topicdbSchema=new mongoose.Schema({
    name:String,
    imgurl:String
});
var topicdb=new mongoose.model("topicdb",topicdbSchema);
// var ab=new cat({
//     name:"mayank",
//     age:90
// });
// ab.save(function(error,v){
//     if(error){
//         console.log("Some error occured");
//     }
//     else{
//         console.log("done");
//         console.log(v);
//     }
// });
var int=[
    {"name":"politics","image":"/res/politics.jpg"},{"name":"cricket","image":"/res/cricket.jpg"},{"name":"bollywood","image":"/res/bollywood.jpeg"},{"name":"economy","image":"/res/economy.jfif"},{"name":"history","image":"/res/history.jfif"},{"name":"videoGame","image":"/res/videogame.jfif"}];
int.forEach(function(ini){
    topicdb.create({
        name:ini.name,
        imgurl:ini.image
    },function(error,cat){
        if(error){
            console.log("Error");
        }
        else{
            console.log(cat);
        }
    })
});
