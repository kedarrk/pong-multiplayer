module.exports={
    createGameState,init,ballPosFn,getCanvasHeight,getCanvasWidth,stickPosFn,initialBallFn,makeid
}
var canvasWidth=1000;
var canvasHeight=600;
function initialBallFn(){
    return ({
        x:250,
        y:200,
        vx:10,
        vy:0,
        radius:20,
        draw : function(){
            ctx.beginPath();
            ctx.rect(ball.x, ball.y, ball.radius,ball.radius);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        }
    });
}
function getCanvasHeight(){
    return canvasHeight;
}
function getCanvasWidth(){
    return canvasWidth;
}
function createGameState(){
    return {
     stick:[{
        x:50,
        y:250,
        width:120,
        height:20,
        stickVelocity:0,
        drawStick : function(){
            ctx.beginPath();
            ctx.fillStyle="white";
            ctx.rect(stick.x,stick.y,stick.height,stick.width);
            ctx.fill();
            ctx.closePath();
            
        }
    }],
      stick2:[{
        x:720,
        y:250,
        width:120,
        height:20,
        drawStick : function(){
            ctx.beginPath();
            ctx.fillStyle="white";
            ctx.rect(stick2.x,stick2.y,stick2.height,stick2.width);
            ctx.fill();
            ctx.closePath();
            
        }
    }],
    
    
    ball:[{
    x:250,
    y:200,
    vx:10,
    vy:0,
    radius:20,
    draw : function(){
        ctx.beginPath();
        ctx.rect(ball.x, ball.y, ball.radius,ball.radius);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
    }],
    score:[{
        p1:0,
        p2:0,
    }]
    };
} 
var state;
function init(){
     state= createGameState();
     console.log(state);
     return state;
}

function ballPosFn(data){
    state=data;
    if(state.ball[0].y <= 0){
        state.ball[0].vy = -state.ball[0].vy;
    }
    if(state.ball[0].y + state.ball[0].radius >= canvasHeight){
        state.ball[0].vy = -state.ball[0].vy;
    }
    if(state.ball[0].x>=canvasWidth){
        state.ball[0].vx=-state.ball[0].vx;
    }
    if(state.ball[0].x<=0){
        state.ball[0].vx=-state.ball[0].vx;
    }
    if(state.ball[0].x  <= state.stick[0].x + state.stick[0].height){
        if(state.ball[0].y+state.ball[0].radius >= state.stick[0].y && state.ball[0].y  <= state.stick[0].y + state.stick[0].width){
            state.ball[0].vx=-state.ball[0].vx;
            var randN= Math.random();
            if(randN<=0.5){
                randN=-1;
            }else{
                randN=1;
            }
            state.ball[0].vy= (randN)*(5+Math.floor((Math.random() * 10 )));
        }
    }
    if(state.ball[0].x + state.ball[0].radius >= state.stick2[0].x ){
        if(state.ball[0].y+state.ball[0].radius >= state.stick2[0].y && state.ball[0].y  <= state.stick2[0].y + state.stick2[0].width){
            state.ball[0].vx=-state.ball[0].vx;
            var randN= Math.random();
            if(randN<=0.5){
                randN=-1;
            }else{
                randN=1;
            }
            state.ball[0].vy= (randN)*(5+Math.floor((Math.random() * 10 )));  
        }
    }
    return state;
}
// move sticks
var moveLen=40;
function stickPosFn(statecopy,flag,data){
    state=statecopy;
    if(flag===1){
        if(data===38){
            if(state.stick[0].y-5 >=0){
                state.stick[0].y-=moveLen;
            }
        }else{
            if(state.stick[0].y+state.stick[0].width + 5 <= canvasHeight){
                state.stick[0].y+=moveLen;
            }
        }
    }else if(flag===2){
        if(data===38){
            if(state.stick2[0].y+5 >=0){
                state.stick2[0].y-=moveLen;
            }
        }else{
            if(state.stick2[0].y+state.stick[0].width + 5 <= canvasHeight){
                state.stick2[0].y+=moveLen;
            }
        }
    }
    return state;
}

// server

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }