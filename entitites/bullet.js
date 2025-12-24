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
        // ctx.fillRect(this.position.x+45, this.position.y-40, this.size.width, this.size.height);
        ctx.drawImage(this.image, this.imageIndex*32, 0, 32, 32, this.position.x, this.position.y, this.size.width, this.size.height);
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

export default Bullet;