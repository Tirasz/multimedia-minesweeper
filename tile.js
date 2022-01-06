  
class Tile{
    constructor(_x, _y, _size){
        //Position
        this.x = _x;
        this.y = _y;
        this.size = _size;
        this.spriteCoordinates = [0,0,0,0];//sx, sy, sw, sw, sh
        //States
        this.isMine = false;
        this.hovered = false;
        this.clicked = false;
        this.marked = false;
        this.safe = false;
        this.value = 0;
        
    }

    mouseOver(){
        return((mouseX > this.x) && (mouseX < this.x+this.size) && (mouseY > this.y) && (mouseY < this.y+this.size));
    }

    update(){
       this.spriteCoordinates = [0,39,16,16];
       if(this.clicked){
           if(this.isMine){
               this.spriteCoordinates = [32,39,16,16];
               return;
           }
           this.spriteCoordinates = [this.value*16,23,16,16];
           return
       }
       if(this.marked){
        this.spriteCoordinates = [16,39,16,16];
        return;
        }
       if(this.hovered){
           this.spriteCoordinates = [96,39,16,16];
            return;
       }
       
    }

    display(){
        image(sprites, this.x, this.y, this.size, this.size, this.spriteCoordinates[0],this.spriteCoordinates[1],this.spriteCoordinates[2],this.spriteCoordinates[3]);
    }
}