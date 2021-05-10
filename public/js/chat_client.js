var submit=document.querySelector("#sendbutton");
var user1=prompt("Enter You name");
var room1=prompt("Enter room");
submit.addEventListener("click",function (e) {
    var chatinp=document.querySelector("input");
    e.preventDefault();
    socket.emit("chatMessage",({msg:chatinp.value,user:user1,room:room1}));
    chatinp.value="";
    chatinp.focus();
});
const socket=io();
socket.emit("joinRoom",({username:user1,room:room1}));
socket.on("hello", (arg) => {
    var newmsg=document.createElement("div");
    if(arg.username==user1){
    newmsg.classList.add("right");}
    else{
    newmsg.classList.add("left");}
    newmsg.classList.add("message");
    newmsg.innerHTML="<b>"+arg.username+"  "+arg.time+"</b><br>"+arg.text;
    var cont=document.getElementsByClassName("container")[0];    
    cont.appendChild(newmsg);
    cont.scrollTop=cont.scrollHeight;
    console.log(arg);
});
console.log("client connnecrt");