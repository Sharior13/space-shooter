const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


import { Player } from "./entities.js";
import { Alien } from "./entities.js";
import { Bullet } from "./entities.js";

let hasStarted = false, canFire = true, timer = 60, score = 0, stage = 1;
const player = new Player({
    ctx,
    position:{
        x: canvas.width/2-48,
        y: canvas.height-96
    }
});
let bullet = [];
let alien = [];
const alienBullet = [];

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    " ": false
};

window.addEventListener("keydown",(event)=>{
    if(event.key in keys){
        keys[event.key] = true;
    }
    if(keys[" "] && canFire){
        bullet.push(new Bullet({
            ctx,
            position:{
                x: player.position.x,
                y: player.position.y
            }
        }));   
        canFire = false;
        setTimeout(()=>{
            canFire = true;
        },100);
    }
});
window.addEventListener("keyup",(event)=>{
    if(event.key in keys){
        keys[event.key] = false;
    }
});

const gameStart = ()=>{
    window.removeEventListener("keydown", gameStart);
    hasStarted = true;

    for(let i=0; i<10*stage;i++){
        let x = Math.floor(Math.random()* ((canvas.width-64)-64)+64);
        let y = Math.floor(Math.random()* ((canvas.height/2-64)-64)+64);

        for(let j=0; j<alien.length; j++){
            if(x+64 >= alien[j].left && x <= alien[j].right && y+100 >= alien[j].top && y <= alien[j].bottom){
                x = Math.floor(Math.random()* ((canvas.width-64)-64)+64);
                y = Math.floor(Math.random()* ((canvas.height/2-64)-64)+64);
                j = 0;
            }
        }

        alien.push(new Alien({
            ctx,
            position: {
                x, y
            }
        }));
    }
    animate();
};

const titleScreen = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.lineWidth = 9;
    ctx.strokeStyle = "black";
    ctx.strokeText(`Stage ${stage}`, canvas.width/2-100, canvas.height/2 - 100, 200);
    ctx.fillStyle = "white";
    ctx.fillText(`Stage ${stage}`, canvas.width/2-100, canvas.height/2 - 100, 200);
    ctx.strokeText("Press any key to start", canvas.width/2-250, canvas.height/2, 500);
    ctx.fillStyle = "white";
    ctx.fillText("Press any key to start", canvas.width/2-250, canvas.height/2, 500);
    ctx.closePath();
    window.addEventListener("keydown", gameStart);
};
titleScreen();


const animate = ()=>{
    if(!hasStarted){
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i=0;i<alien.length;i++){
        
        for(let j=0;j<alien.length;j++){
            if(alien[i].right >= alien[j].left && alien[i].left <= alien[j].right  && alien[i].bottom >= alien[j].top && alien[i].top <= alien[j].bottom){
                
                alien[i].direction.x *= -1;
                alien[i].direction.y *= -1;
                
                alien[j].direction.x *= -1;
                alien[j].direction.y *= -1;
                
            }
        }
        
        for(let j=0;j<bullet.length;j++){
            if(alien[i].right >= bullet[j].left && alien[i].left <= bullet[j].right  && alien[i].bottom >= bullet[j].top && alien[i].top <= bullet[j].bottom){
                bullet[j].isHit = true; 
                alien[i].hitCount++;
                alien[i].audio.enemyHit.play();
                if(alien[i].hitCount==3){
                    alien[i].isDead = true;
                    alien[i].audio.enemyDead.play();
                    score+=Math.floor(Math.random()* (10-4) + 4);
                }
            }
        }

        if(alien[i].right >= player.left && alien[i].left <= player.right  && alien[i].bottom >= player.top && alien[i].top <= player.bottom){
            setTimeout(()=>{
                player.health-=10/100;
                player.audio.playerHit.play();
        },500);
        }

        alien[i].draw();
        alien[i].update(canvas);
    }

    for(let i=0;i<bullet.length;i++){
        bullet[i].draw();
        bullet[i].update();
    }


    if(player.health<=0 || timer<=0){
        gameLose();
    }
    else if(alien.every((aelin)=>{
        return aelin.isDead == true;
    })){
        gameWin();
    }

    player.update(keys, canvas);
    player.draw();

    showTimer();
    showScore();
    requestAnimationFrame(animate);
};

const gameLose = () =>{
    hasStarted = false;
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.lineWidth = 9;
    ctx.strokeStyle = "black";
    ctx.strokeText("Game Over", canvas.width/2-150, canvas.height/2, 300);
    ctx.fillStyle = "red";
    ctx.fillText("Game Over.", canvas.width/2-150, canvas.height/2, 300);
    ctx.closePath();
    player.audio.playerDead.play();
    
    setTimeout(()=>{
        score = 0;
        stage = 1;
        resetVal();
        titleScreen();
    },2000);
};

const gameWin = ()=>{
    hasStarted = false;
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.lineWidth = 9;
    ctx.strokeStyle = "black";
    ctx.strokeText("Stage Clear!", canvas.width/2-150, canvas.height/2, 300);
    ctx.fillStyle = "green";
    ctx.fillText("Stage Clear!", canvas.width/2-150, canvas.height/2, 300);
    ctx.closePath();
    player.audio.stageClear.play();
    
    setTimeout(()=>{
        stage++;
        resetVal();
        titleScreen();
    },2000);
};

const resetVal = () =>{
        player.position = {
            x: canvas.width/2-48,
            y: canvas.height-96
        };
        player.health = 100;
        bullet = [];
        alien = [];
        timer = 60;
};

const showTimer = () =>{
    ctx.beginPath();
    ctx.font = "40px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 9;
    ctx.strokeText(`Time Left: ${timer}`, canvas.width-240, 40, 240);
    ctx.fillStyle = "red";
    ctx.fillText(`Time Left: ${timer}`, canvas.width-240, 40, 240);
};
const showScore = () =>{
    ctx.beginPath();
    ctx.font = "40px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 9;
    ctx.strokeText(`Score: ${score}`, 10, 40, 300);
    ctx.fillStyle = "red";
    ctx.fillText(`Score: ${score}`, 10, 40, 300);
};

setInterval(()=>{
    for(let i=0; i<alien.length; i++){
        if(alien[i].isDead){
            alien[i].imageIndex++;
            if(alien[i].imageIndex>=16){
                alien[i].position = {
                    x: -100,
                    y: -100
                };
                alien[i].speed = {
                    x:0,
                    y:0
                };
            }
        }
    }
    player.imageIndex++;
    if(player.isMoving){
        if(player.imageIndex>=3){
            player.imageIndex = 0;
        }
    }
    else{
        if(player.imageIndex>=2){
            player.imageIndex = 0;
        }
    }
},100);

setInterval(()=>{
    timer--;
},1000);