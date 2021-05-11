var mongoose=require("mongoose");
var pls=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    email:String,
    password:String,
    //name is for the wechat app and for auth app you should remove it
    name:String
});
userSchema.plugin(pls,{usernameField:"email"});
module.exports=mongoose.model("User",userSchema);