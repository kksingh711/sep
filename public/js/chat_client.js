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
    var indd=arg.text.indexOf("jh44gffs");
    if(ind!=-1){
        newmsg.classList.add("middle");
        newmsg.innerHTML="<b><i>"+arg.username.toUpperCase()+" joined the chat</i></b>";
    }else if(indd!=-1){
        newmsg.classList.add("middle");
        newmsg.innerHTML="<b><i> Welcome "+arg.username.toUpperCase()+" please follow the community guidelines while chatting.</i></b>";
    }
    else{
        if(arg.username==user1){
            newmsg.classList.add("right");}
        else{
            newmsg.classList.add("left");}
        newmsg.innerHTML="<b>"+arg.username+"  "+arg.time+"</b><br>"+arg.text;
    }    
    newmsg.classList.add("message");
    
    var cont=document.getElementsByClassName("container")[0];    
    cont.appendChild(newmsg);
    cont.scrollTop=cont.scrollHeight;
    console.log(arg);
});