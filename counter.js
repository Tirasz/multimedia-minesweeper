class Counter{
    static digitWidth = 13;
    static digitHeight = 23;
    constructor(x,y,height,value){
        this.value = value;
        this.x = x;
        this.y = y;
        this.digits = [];
        this.height = height;
        
    }

    update(){
        let tempval = this.value;
        if(tempval < 0)
            tempval = 0;
        
        this.digits = [((tempval - tempval%100)/100), ((tempval - tempval%10)%100/10), (tempval%10)]
    }

    display(){
        for(let i = 0; i < 3; i++){
            let digitW = (this.height * (Counter.digitWidth / Counter.digitHeight));
            let digitX = this.x + digitW*i;
            image(sprites, digitX, this.y, digitW, this.height, this.digits[i] * Counter.digitWidth,0,Counter.digitWidth,Counter.digitHeight);
        }
    }

}