const express= require("express");
const app= express();
const http=require("http");
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);
const {createGameState,init , ballPosFn , getCanvasHeight,getCanvasWidth , stickPosFn,initialBallFn , makeid} = require("./data.js");
var canvasHeight,canvasWidth;
const port=process.env.PORT || 3000;
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/main.html');

})
app.use("/static", express.static('./static/'));
var rooms=[];
var cnt=0;
var roomArray=[];
var cnt=0;
var state=[];
io.on("connection", (socket)=>{
//    const UserID= await fetchUserId(socket);
// create server
//console.log(cnt);
    var userID;
   
    //console.log(cnt);
    userID=socket.id;
    var roomID;
    console.log(rooms);
    //console.log(userID);
    canvasHeight=getCanvasHeight();
    canvasWidth=getCanvasWidth();
    socket.on("create room", (data)=>{
        roomID = makeid(6);
        //console.log(roomID);
        roomArray[cnt]=roomID;
        cnt++;
        socket.join(roomID);
        rooms[roomID]=[];
        rooms[roomID][0]=userID;
        
   //     player1=socket.id;
        io.to(roomID).emit("game is starting");
        io.to(roomID).emit("display room id", roomID);
    });
  //  console.log(canvasHeight + "  " + canvasWidth);
// join server
    socket.on("join room", (data)=>{
        var flag=0;
        for(var i=0;i<roomArray.length ;i++){
            if(roomArray[i]=== data){
                flag=1;
            }
        }
        if(flag===0 || rooms[data]===null){
            io.to(socket.id).emit("invalid room" , "invalid Room ID");
        }else if(rooms[data]  && rooms[data].length >= 2){
            io.to(socket.id).emit("invalid room" , "Room is full!");
        }else{
        socket.join(data);
        roomID=data;
        rooms[roomID][1]=userID;
        roomID=data;
    //    player2=socket.id;
        io.to(roomID).emit("display room id", roomID);
  //      console.log(rooms[roomID]);
        if(rooms[roomID].length ===2){
            startGame();
        }
        }
    });
    // if(roomID!=null && rooms[roomID].length === 2){
    var interval;
    function timeoutFn(){
        return new Promise(resolve => {setTimeout((resolve), 1000)});
    }
    async function startGame(){
        io.to(roomID).emit("game is starting");
        state[roomID]=init();
         await timeoutFn();
         interval=setInterval(()=>{
            const initialBall=initialBallFn();
            state[roomID].ball[0].x+=state[roomID].ball[0].vx;
            state[roomID].ball[0].y+=state[roomID].ball[0].vy;
            if( state[roomID].ball[0].x >= state[roomID].stick2[0].x + 50 ) {
                state[roomID].score[0].p1++;
                state[roomID].ball[0]=initialBall;
               // console.log(state[roomID].ball[0]);
              //  console.log(initialBall);
                //console.log( state[roomID].score[0].p1 + " - " +state[roomID].score[0].p2);
                // state[roomID].ball[0].vx=-state[roomID].ball[0].vx;
                io.to(roomID).emit("score emit", state[roomID].score[0].p1, state[roomID].score[0].p2);
            }
            if( state[roomID].ball[0].x <=state[roomID].stick[0].x - 50){
                state[roomID].score[0].p2++;
                state[roomID].ball[0]=initialBall;
                io.to(roomID).emit("score emit", state[roomID].score[0].p1, state[roomID].score[0].p2);
             //   console.log( state[roomID].score[0].p1 + " - " +state[roomID].score[0].p2);
            }
             state[roomID]= ballPosFn(state[roomID]);
            io.to(roomID).emit("render objects" , state[roomID]);
            checkScore();
        },20);
        // handle score
        
     }
     function checkScore(){
        if(state[roomID].score[0].p1 ===15){
            clearInterval(interval);
        //    console.log(player1+ " " + socket.id);
            if(socket.id===rooms[roomID][0]){
                io.to(socket.id).emit("result emit" ,"You won!");
                io.to(rooms[roomID][1]).emit("result emit" ,"You Lost.");
           //     console.log("player 1 won lol ");
            }else if(socket.id===rooms[roomID][1]){
                io.to(rooms[roomID][0]).emit("result emit" ,"You won!");
                io.to(socket.id).emit("result emit" ,"You Lost.");
            }
        }else if(state[roomID].score[0].p2 === 15){
            clearInterval(interval);
          //  console.log(player2+ " " + socket.id);
            if(socket.id===rooms[roomID][1]){
                io.to(socket.id).emit("result emit" ,"You won!");
                io.to(rooms[roomID][0]).emit("result emit" ,"You Lost.");
            //    console.log("player 2 won lol");
            }else{
                io.to(rooms[roomID][0]).emit("result emit" ,"You Lost.");
                io.to(socket.id).emit("result emit" ,"You won!");
            }
        }
     }
     // key press event
     socket.on("key down" ,(data)=>{
        if(socket.id ===rooms[roomID][0]){
    
         //   console.log(socket.id + " " + player1);
            state[roomID]=stickPosFn(state[roomID],1,data);
        }else if(socket.id===rooms[roomID][1]){
        //    console.log(socket.id + " " + player2);
            state[roomID]=stickPosFn(state[roomID],2,data);
        }
        io.to(roomID).emit("render objects", state[roomID]);
     });
     console.log(cnt + " cnt") ;
     // left room
     socket.on("left room", ()=>{
         roomID="";
     })
});

server.listen(port,()=>{
    
});