const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


import Player from "./player.js";
import Bullet from "./bullet.js";
import Alien from "./alien.js";

let hasStarted = false, canFire = true, timer = 60, score = 0, stage = 1;
const player = new Player({
    position:{
        x: canvas.width/2-48,
        y: canvas.height-96
    }
});
let bullet = [];
let alien = [];
const alienBullet = [];

//map user inputs
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

//listen to user input
window.addEventListener("keydown",(event)=>{
    if(event.key in keys){
        keys[event.key] = true;
    }
    //spawn bullets on pressing space & ensure it doesnt spawn continously
    if(keys[" "] && canFire){
        bullet.push(new Bullet({
            position:{
                x: player.position.x,
                y: player.position.y
            }
        }));
        bullet[0].laser.play();
        canFire = false;
        setTimeout(()=>{
            canFire = true;
        },150);
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

    //spawn aliens in random positions with no overlapping by checking collision beforehand
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
        
        //check for alien-to-alien collision
        for(let j=0;j<alien.length;j++){
            if(collisionDetection(alien[i], alien[j])){
                
                alien[i].direction.x *= -1;
                alien[i].direction.y *= -1;
                
                alien[j].direction.x *= -1;
                alien[j].direction.y *= -1;
                
            }
        }
        
        //check for bullet to aliemn collision
        for(let j=0;j<bullet.length;j++){
            if(collisionDetection(alien[i], bullet[j])){
                bullet[j].isHit = true; 
                alien[i].hitCount++;
                alien[i].imageIndex++;
                alien[i].audio.enemyHit.play();
                if(alien[i].hitCount==3){
                    alien[i].isDead = true;
                    alien[i].audio.enemyDead.play();
                    score+=Math.floor(Math.random()* (10-4) + 4);
                }
            }
        }

        //check for player to alien collision
        if(collisionDetection(alien[i], player)){
            player.audio.playerHit.play();
            setTimeout(()=>{
                player.health-=10/100;
        },500);
        }

        alien[i].draw(ctx);
        alien[i].update(canvas);
    }

    for(let i=0;i<bullet.length;i++){
        bullet[i].draw(ctx);
        bullet[i].update();
    }

    //lose condition
    if(player.health<=0 || timer<=0){
        gameLose();
    }
    //win condition
    else if(alien.every((aelin)=>{
        return aelin.isDead == true;
    })){
        gameWin();
    }

    player.update(keys, canvas);
    player.draw(ctx);

    showTimer();
    showScore();
    requestAnimationFrame(animate);
};

const collisionDetection = (A, B) =>{
    if(A.right >= B.left && A.left <= B.right  && A.bottom >= B.top && A.top <= B.bottom){
        return true;
    }
    else{
        return false;
    }
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
    
    //goto titlescreen after 2 sec
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
    
    //goto titlescreen after 2 sec
    setTimeout(()=>{
        stage++;
        resetVal();
        titleScreen();
    },2000);
};

//reset all stats and bullet & alien arrays
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
    //check for alien dying to play dead animation
    for(let i=0; i<alien.length; i++){
        if(alien[i].isDead){
            alien[i].imageIndex++;
            if(alien[i].imageIndex>=18){
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

    //check for player movement to play idle or moving engine animation
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