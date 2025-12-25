class Asteroid {
    constructor({position, direction}){
        this.position = position;
        this.size = {
            width: 300,
            height: 200
        }
        this.speed = {
            x: 2,
            y: 3
        }
        this.direction = direction;
        this.isDestroyed = false;
        this.image = new Image();
        this.image.src = "./assets/asteroid/asteroid.png"
        this.boom = new Audio("./assets/audio/asteroid.ogg");
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

    draw(ctx){
        if(this.isDestroyed){
            return;
        }
        ctx.beginPath();
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.drawImage(this.image, 0, 0, 64, 64, this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.closePath();
    }
    update(){
        if(this.isDestroyed){
            return;
        }
        this.position.x += this.speed.x*this.direction.x;
        this.position.y += this.speed.y*this.direction.y;
    }
}

export default Asteroid;