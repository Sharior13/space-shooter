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
        this.health = 100;
        this.color = "red";
        this.isMoving = false;
        this.adjustFill = 48;
        this.imageIndex = 0;
        this.ship = new Image();
        this.engine = new Image();
        this.engine.src = "./assets/player/engine.png";
        this.audio = {
            playerDead: new Audio("./assets/audio/playerDead.ogg"),
            playerHit: new Audio("./assets/audio/playerHit.ogg"),
            stageClear: new Audio("./assets/audio/stageClear.ogg")
        };
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
        this.ctx.beginPath();
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        if(this.health <= 100 && this.health>75){
            this.ship.src = "./assets/player/shipFull.png";
        }
        else if(this.health<=75 && this.health>50){
            this.ship.src = "./assets/player/shipQuarter.png";
        }
        else if(this.health<=50 && this.health>25){
            this.ship.src = "./assets/player/shipHalf.png";
        }
        else if(this.health<=25){
            this.ship.src = "./assets/player/shipAlmost.png";
        }
        
        this.ctx.drawImage(this.ship, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);


        if(this.isMoving){
            this.ctx.drawImage(this.engine, this.imageIndex*48, 48, 48, 48, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        }
        else{
            this.ctx.drawImage(this.engine, this.imageIndex*48, 0, 48, 48, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
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
        this.image = new Image();
        this.image.src = "./assets/bullet/laser.png"
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
        // this.ctx.fillRect(this.position.x+45, this.position.y-40, this.size.width, this.size.height);
        this.ctx.drawImage(this.image, 0, 0, 32, 32, this.position.x+45, this.position.y-40, this.size.width, this.size.height);
        this.ctx.closePath();
    }

    update() {
        if(this.isHit){
            this.position.x = -300;
            this.position.y = -300;
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
        this.hitCount = 0;
        this.isDead = false;
        this.adjustFill = 32;
        this.imageIndex = 0;
        this.enemy1 = new Image();
        this.enemy1.src = "./assets/enemy/enemy1.png";
        this.audio = {
            enemyDead: new Audio("./assets/audio/enemyDead.ogg"),
            enemyHit: new Audio("./assets/audio/enemyHit.ogg"),
        };
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
            this.ctx.drawImage(this.enemy1, this.imageIndex*64, 0*64, 64, 64, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
            return;
        }
        this.ctx.beginPath();
        // this.ctx.fillStyle = "orange";
        // this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.drawImage(this.enemy1, this.imageIndex*64, 0*64, 64, 64, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        this.ctx.closePath();
    }

    update(canvas) {
        if(this.isDead){
            return;
        }
        if(this.left < 0 || this.right > canvas.width){
            this.direction.x *= -1;
        }
        if(this.top < 0 || this.bottom > canvas.height){
            this.direction.y *= -1;
        }

        this.position.x+=this.speed.x*this.direction.x;
        this.position.y+=this.speed.y*this.direction.y;

    }
}

class Asteroid {
    constructor() {}
}

export {Player, Bullet, Alien, Asteroid};