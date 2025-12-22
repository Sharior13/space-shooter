class Player {
    constructor({position}){
        this.position = position;
        this.size = {
            width: 96,
            height: 96
        };
        this.speed = {
            x: 1,
            y: 1
        };
        this.color = "red";
        this.isMoving = false;
        this.adjustsFill = 48;
        this.shipFull = new Image();
        this.shipFull.src = "./assets/player/shipFull.png";
        this.engine = new Image();
        this.engine.src = "./assets/player/engine.png";
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.drawImage(this.shipFull, this.position.x-this.adjustsFill/2, this.position.y-this.adjustsFill/2, this.size.width+this.adjustsFill, this.size.height+this.adjustsFill);
        if(this.isMoving){
            ctx.drawImage(this.engine, 0, 0, 48, 48, this.position.x-this.adjustsFill/2, this.position.y-this.adjustsFill/2, this.size.width+this.adjustsFill, this.size.height+this.adjustsFill);
        }
        else{
        }
        ctx.closePath();
    }
    update(keys) {
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
        if(keys[" "]){
            this.position.y-=this.speed.y;
        }

        if(Object.values(keys).some( key =>{
            return key == true;
        })){
            this.isMoving = true;
        }
        else{
            this.isMoving = false;
        }
    }
}

export {Player};