

var canvas= document.getElementById("myCanvas");
var ctx=canvas.getContext("2d");
var raf;
var canvasWidth=1000;
var canvasHeight=600;
var socket=io();
var ball;
var gameStarted=0;
var stick,stick2;
var displayRoom=document.getElementById("displayRoom-txt");
document.addEventListener("keydown", handleKeyDown);

// room creation 
var input= document.getElementById("inputRoom");
var submit= document.getElementById("submit");
var createRoom = document.getElementById("createRoom");
createRoom.addEventListener("click", handleGameStart.bind(event,0));
submit.addEventListener("click", handleGameStart.bind(event,1));
document.getElementById("game-body").style.display="none";
function handleGameStart(flag){
    if(flag===0){
        console.log(flag);
        socket.emit("create room",0);
    }else if(flag===1){

        socket.emit("join room",input.value);
        input.value="";
    }
}
socket.on("display room id",(data)=>{
    displayRoom.innerHTML=`<p>You have joined room <span>${data}</span></p> `;
    document.getElementById("displayRoom").style.display="block";
})
var dispX= document.getElementById("display-exit");
dispX.addEventListener("click" , ()=>{
    document.getElementById("displayRoom").style.display="none";
});
// .....
// starting game
var timer=document.getElementById("timer");
var menu=document.getElementById("menu");
socket.on("game is starting",()=>{
    menu.style.display="none";
    document.getElementById("game-body").style.display="flex";
    
    gameStarted=1;
});


// rendering function
socket.on("render objects", (data)=>{
    ball=data.ball[0];
    stick=data.stick[0];
    stick2=data.stick2[0];
    drawBall();
});

function drawBall(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle="white";
    ctx.fillRect(ball.x,ball.y,ball.radius,ball.radius);
    ctx.fillStyle="white";
    ctx.fillRect(stick.x,stick.y,stick.height,stick.width);
    ctx.fillStyle="white";
    ctx.fillRect(stick2.x,stick2.y,stick2.height,stick2.width);
    raf= window.requestAnimationFrame(drawBall);
}
// key press function 
function handleKeyDown(event){
    if(gameStarted===0){

    }
    else if(event.keyCode===38){
        socket.emit("key down",event.keyCode   );

        console.log(38);
    }else if(event.keyCode===40){
        console.log(40);
        socket.emit("key down",event.keyCode  );
    }
}
 //score
 var score= document.getElementById("score"); 
 socket.on("score emit",(p1,p2)=>{  
    score.innerText=`${p1} | ${p2}`;
 })
  // result

  var result=document.getElementById("result");
  socket.on("result emit", (data)=>{
      result.innerText=`${data}`;
      var resultb=document.getElementById("result-body");
      resultb.style.display="flex";
      resultb.style.position="absolute";
      resultb.style.flexDirection="column";
      resultb.style.justifyContent="center";
      resultb.style.alignItems="center";
      resultb.style.top="0px";
      resultb.style.right="0px";
    document.getElementById("res-score").innerText=score.innerText;
      console.log(data);
  });
  // exit game
  var leave=document.getElementById("leave");
  leave.addEventListener("click" , ()=>{
    //   location.reload();
      menu.style.display="flex";
      var resultb=document.getElementById("result-body");
      resultb.style.display="none";
      
      score.innerText=`0 | 0`;
      document.getElementById("displayRoom").style.display="none";
      ctx.clearRect(0,0,canvasWidth,canvasHeight);
      socket.emit("left room");
  });
 

  // span copy
// invalid rooms 
var error=document.getElementById("error");
socket.on("invalid room", (data)=>{
    error.innerText=`${data}`;
    error.style.color="red";
    error.style.fontStyle="italic";
});

//timer

socket.on("timer",(data)=>{
    timer.innerText=`${data}...`;
})