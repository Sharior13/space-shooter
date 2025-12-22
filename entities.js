class Player {
    constructor({ctx, position}){
        this.ctx = ctx;
        this.position = position;
        this.size = {
            width: 96,
            height: 96
        };
        this.speed = {
            x: 2,
            y: 2
        };
        this.color = "red";
        this.isMoving = false;
        this.adjustFill = 48;
        this.shipFull = new Image();
        this.shipFull.src = "./assets/player/shipFull.png";
        this.engine = new Image();
        this.engine.src = "./assets/player/engine.png";
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.drawImage(this.shipFull, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        if(this.isMoving){
            this.ctx.drawImage(this.engine, 0, 0, 48, 48, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        }
        else{
        }
        this.ctx.closePath();
    }

    update(keys, canvas) {
        if(keys.w || keys.ArrowUp){
            this.position.y-=this.speed.y;
        }
        if(keys.s || keys.ArrowDown){
            this.position.y+=this.speed.y;
        }
        if(keys.a || keys.ArrowLeft){
            this.position.x-=this.speed.x;
        }
        if(keys.d || keys.ArrowRight){
            this.position.x+=this.speed.x;
        }
        
        if(Object.values(keys).some( key =>{
            return key == true;
        })){
            this.isMoving = true;
        }
        else{
            this.isMoving = false;
        }

        this.position.x = Math.max(0, Math.min(canvas.width-this.size.width, this.position.x));
        this.position.y = Math.max(0, Math.min(canvas.height-this.size.height, this.position.y));
    }
}

class Bullet {
    constructor({ctx, position}){
        this.ctx = ctx;
        this.position = position;
        this.size = {
            width: 5,
            height: 50
        }
        this.speed = 3;
        this.isHit = false;
    }

    get left(){
        return this.position.x;
    }
    get right(){
        return this.position.x+this.size.width;
    }
    get top(){
        return this.position.y;
    }
    get bottom(){
        return this.position.y+this.size.height;
    }

    draw() {
        if(this.isHit){
            return;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.position.x+45, this.position.y-40, this.size.width, this.size.height);
        this.ctx.closePath();
    }

    update() {
        if(this.isHit){
            this.position.x = -100;
            this.position.y = -100;
            return;
        }
        this.position.y-= this.speed;
    }
}


class Alien {
    constructor({ctx, position}){
        this.ctx = ctx;
        this.position = position;
        this.size = {
            width: 64,
            height: 64
        };
        this.speed = {
            x: 1,
            y: 1
        };
        this.direction = {
            x: 1,
            y: 1
        };
        this.isDead = false;
    }
    
    get left(){
        return this.position.x;
    }
    get right(){
        return this.position.x+this.size.width;
    }
    get top(){
        return this.position.y;
    }
    get bottom(){
        return this.position.y+this.size.height;
    }

    draw() {
        if(this.isDead){
            return;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.closePath();
    }

    update(canvas) {
        if(this.isDead){
            this.position.x = -100;
            this.position.y = -100;
            return;
        }
        if(this.left < 0 || this.right > canvas.width){
            this.direction.x *= -1;
        }
        if(this.top < 0 || this.bottom > canvas.height/2){
            this.direction.y *= -1;
        }

        this.position.x+=this.speed.x*this.direction.x;
        this.position.y+=this.speed.y*this.direction.y;

    }
}


export {Player, Bullet, Alien};