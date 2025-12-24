class Player {
    constructor({position}){
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
        this.adjustFill = 48; //to fit ship into hitbox
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

    draw(ctx) {
        ctx.beginPath();
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
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
        
        ctx.drawImage(this.ship, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);


        if(this.isMoving){
            ctx.drawImage(this.engine, this.imageIndex*48, 48, 48, 48, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        }
        else{
            ctx.drawImage(this.engine, this.imageIndex*48, 0, 48, 48, this.position.x-this.adjustFill/2, this.position.y-this.adjustFill/2, this.size.width+this.adjustFill, this.size.height+this.adjustFill);
        }
        ctx.closePath();
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

export default Player;