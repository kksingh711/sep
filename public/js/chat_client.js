const socket=io();
var submit=document.querySelector("#sendbutton");
var user1=prompt("Enter You name");
var room1=window.location.href;
console.log(room1);
submit.addEventListener("click",function (e) {
    var chatinp=document.querySelector("input");
    e.preventDefault();
    socket.emit("chatMessage",({msg:chatinp.value,user:user1,room:room1}));
    chatinp.value="";
    chatinp.focus();
});
socket.emit("joinRoom",({username:user1,room:room1}));
socket.on("hello", (arg) => {
    var newmsg=document.createElement("div");
    var ind=arg.text.indexOf("jpmk%?00");
    if(ind==-1){
        if(arg.username==user1){
            newmsg.classList.add("right");}
        else{
            newmsg.classList.add("left");}
        newmsg.innerHTML="<b>"+arg.username+"  "+arg.time+"</b><br>"+arg.text;
    }else{
        newmsg.classList.add("middle");
        newmsg.innerHTML="<b>"+arg.username+" joined the chat</b>";
    }    
    newmsg.classList.add("message");
    
    var cont=document.getElementsByClassName("container")[0];    
    cont.appendChild(newmsg);
    cont.scrollTop=cont.scrollHeight;
    console.log(arg);
});