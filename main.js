const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false; // Chrome, Safari

canvas.width = window.innerWidth-100;
canvas.height = window.innerHeight-100;
canvas.style.width = `${window.innerWidth-100}px`;
canvas.style.height = `${window.innerHeight-100}px`;

import { Player } from "./entities.js";

let hasStarted = false;
let keys = {
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


const player = new Player({
    position:{
        x: canvas.width/2-48,
        y: canvas.height-96
    }
})
const animate = ()=>{
    if(!hasStarted){
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update(keys);
    player.draw(ctx);
    requestAnimationFrame(animate);
};