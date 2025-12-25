class Buff{
    constructor({position}){
        this.position = position;
        this.size = {
            width: 100,
            height: 100
        };
        this.speed = 2;
        this.isPicked = false;
        this.image = new Image();
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
        if(this.isPicked){
            return;
        }
        ctx.beginPath();
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.closePath();
    }
    update(){
        if(this.isPicked){
            return;
        }
        this.position.y += this.speed;
    }
}

class Health extends Buff{
    constructor({position, size, speed, image}){
        super({position, size, speed, image});
        this.image.src = "./assets/buff/health.png";
        this.audio = new Audio("./assets/audio/health.ogg");
    }
}

export {Health};