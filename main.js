const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth-100;
canvas.height = window.innerHeight-100;


import { Player } from "./entities.js";
import { Alien } from "./entities.js";
import { Bullet } from "./entities.js";

let hasStarted = false;
const player = new Player({
    ctx,
    position:{
        x: canvas.width/2-48,
        y: canvas.height-96
    }
});
const bullet = [];
const alien = [];
const alienBullet = [];
for(let i=0; i<10;i++){
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
});
window.addEventListener("keyup",(event)=>{
    if(event.key in keys){
        keys[event.key] = false;
    }
});

const gameStart = ()=>{
    window.removeEventListener("keydown", gameStart);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStarted = true;
    animate();
};

const titleScreen = ()=>{
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
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

    if(keys[" "]){
        bullet.push(new Bullet({
            ctx,
            position:{
                x: player.position.x,
                y: player.position.y
            }
        }));    
    }

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
                alien[i].isDead = true;
                bullet[j].isHit = true; 
            }
        }

        alien[i].draw();
        alien[i].update(canvas);
    }

    for(let i=0;i<bullet.length;i++){
        bullet[i].draw();
        bullet[i].update();
    }

    player.update(keys, canvas);
    player.draw();
    requestAnimationFrame(animate);
};