class Bullet {
    constructor({position}){
        this.position = position;
        this.size = {
            width: 32,
            height: 64
        }
        this.speed = 3;
        this.isHit = false;
        this.imageIndex = 0;
        this.image = new Image();
        this.image.src = "./assets/bullet/laser.png"
        this.laser = new Audio("./assets/audio/laser.ogg");
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
        if(this.isHit){
            return;
        }
        ctx.beginPath();
        // ctx.fillStyle = "green";
        // ctx.fillRect(this.position.x+32, this.position.y-32, this.size.width, this.size.height);
        ctx.drawImage(this.image, this.imageIndex*32, 0, 32, 32, this.position.x+this.size.width, this.position.y-this.size.height/2, this.size.width, this.size.height);
        ctx.closePath();
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

class EnemyBullet extends Bullet{
    constructor({position, size, speed, isHit, imageIndex, image}){
        super({position, size, speed, isHit, imageIndex, image});
        this.image.src= "./assets/bullet/enemyLaser.png";
        this.laser = new Audio("./assets/audio/enemyBullet.ogg");
    }

    draw(ctx) {
        if(this.isHit){
            return;
        }
        ctx.beginPath();
        // ctx.fillStyle = "green";
        // ctx.fillRect(this.position.x+this.size.width/2, this.position.y+this.size.height-10,  this.size.width, this.size.height);
        ctx.drawImage(this.image, this.imageIndex*18, 0, 18, 38, this.position.x+this.size.width/2, this.position.y+this.size.height-10, this.size.width, this.size.height);
        ctx.closePath();
    }

    update() {
        if(this.isHit){
            this.position.x = -300;
            this.position.y = -300;
            return;
        }
        this.position.y+= this.speed;
    }
}

export {Bullet, EnemyBullet};