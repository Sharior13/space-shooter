class Alien {
    constructor({position}){
        this.position = position;
        this.size = {
            width: 64,
            height: 64
        };
        this.speed = {
            x: 1,
            y: 0.5
        };
        this.direction = {
            x: (Math.round(Math.random())*2)-1,
            y: (Math.round(Math.random())*2)-1
        };
        this.health = 100;
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

    draw(ctx) {
        if(this.isDead){
            ctx.drawImage(this.enemy1, this.imageIndex*64, 0*64, 64, 64, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.fillRect(this.position.x+16, this.position.y-5, this.health/3, 10);
        ctx.drawImage(this.enemy1, this.imageIndex*64, 0*64, 64, 64, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        ctx.closePath();
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
        this.position.y+=this.speed.y;

    }
}

export default Alien