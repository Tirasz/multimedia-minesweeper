class Board{
    static tileSize = 20;
    static xOffset = 0;
    static yOffset = 0;
    constructor(width, height, difficulty){
       
        if(width % Board.tileSize != 0 || height % Board.tileSize != 0){
            throw new Error(`Board width and height must be a multiple of ${this.tileSize}!`)
        }

        switch(difficulty){
            case 1:
                this.mineChanche = 0.12;
                this.rows = 9;
                this.columns = 9;
                break;
            case 2:
                this.mineChanche = 0.16;
                this.rows = 16;
                this.columns = 16;
                break;
            case 3:
                this.mineChanche = 0.20;
                this.rows = 16;
                this.columns = 30;
                break;
            case 4:
                this.mineChanche = 0.20;
                this.rows = 25;
                this.columns = 30;
                break;
            case 5:
                this.mineChanche = 0.25;
                this.rows = height / Board.tileSize;
                this.columns = width / Board.tileSize;
                break;
        }
        Board.xOffset = ((width -(Board.tileSize*this.columns))/2);
        Board.yOffset = ((height -(Board.tileSize*this.rows))/2) + 50;
        this.initialized = false;
        this.lastClicked = null;
        this.gameState = 0;
        this.timer = new Counter(25,8,Counter.digitHeight*1.5,0);
        this.pointCounter = new Counter(width - 85,8,Counter.digitHeight*1.5,0);
        this.garfield = new Tile((width/2)-15, 0, 50);
        this.garfield.spriteCoordinates = [1,56,25,25];
        //StackOverflow one-liner to create 2D array. 
        this.tiles = Array.from(Array(this.columns), () => new Array(this.rows));
        //Initializing tiles
        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y] = new Tile(x*Board.tileSize + Board.xOffset, y*Board.tileSize + Board.yOffset, Board.tileSize);
            }
        }
        
    }

    resetBoard(){
        if(this.gameState === 1){
            $( "#leaderboard-submit" ).removeClass("revealed");
            $( "#leaderboard-submit" ).addClass("hidden");
        }
        playSound("new_tile");
        this.initialized = false;
        this.lastClicked = null;
        this.gameState = 0;
        this.timer = new Counter(25,8,Counter.digitHeight*1.5,0);
        this.pointCounter = new Counter(width - 85,8,Counter.digitHeight*1.5,0);
        this.tiles = Array.from(Array(this.columns), () => new Array(this.rows));
        this.garfield = new Tile((width/2)-15, 0, 50);
        this.garfield.spriteCoordinates = [1,56,25,25];
            
        //Initializing tiles
        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y] = new Tile(x*Board.tileSize + Board.xOffset, y*Board.tileSize + Board.yOffset, Board.tileSize);
            }
        }
    }

    initialize(firstTile){//TODO DIFF INPUT
        //Puts mines on the board, making sure the first tile is "safe"
        firstTile.safe = true;
        this.forAllNeighbours(firstTile, (tile) => {tile.safe = true;})
        let sum = 0;
        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                //this.tiles[x][y].clicked = true;
                this.tiles[x][y].marked = false;
                if(Math.random() <= this.mineChanche && !this.tiles[x][y].safe){
                    this.tiles[x][y].isMine = true;
                    this.forAllNeighbours(this.tiles[x][y],(tile) => {tile.value += 1;})
                    sum++;
                }
                    
            }
        }
        this.initialized = true;
        this.pointCounter.value = sum;
        this.startTime = new Date().getTime();
    }

    update(){
        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y].update();
            }
        }

        switch(this.gameState){
            case 0:
                if(this.initialized){ //update time
                    let currentTime = new Date().getTime();
                    this.timer.value = Math.floor(((currentTime - this.startTime) ) / 1000);
                }
                this.timer.update();
                this.pointCounter.update();
                break;
            case 1: //WIN
                this.garfield.spriteCoordinates = [104,56,25,25];
                break;
            case -1: //LOSE
                if(!(this.lastClicked === this.garfield))
                    this.garfield.spriteCoordinates = [79,56,25,25];
                for(let x = 0; x < this.columns; x++){
                    for(let y = 0; y < this.rows; y++){
                        this.tiles[x][y].clicked = true;
                    }
                }
                break;
        }

        if(this.pointCounter.value == 0 && this.gameState != 1 && this.initialized){
            // Player wins when all tiles are clicked, except mines, that need to be marked
            for(let x = 0; x < this.columns; x++){
                for(let y = 0; y < this.rows; y++){
                    if(!this.tiles[x][y].clicked){
                        if(this.tiles[x][y].isMine && !this.tiles[x][y].marked || !this.tiles[x][y].isMine)
                            return;
                   }
                }
            }
            this.gameState = 1;
            $( "#leaderboard-submit" ).removeClass("hidden");
            $( "#leaderboard-submit" ).addClass("revealed");
            playSound("win");
            $( "#leaderboard-difficulty" )[0].scrollIntoView();
        }
    }

    display(){
        this.timer.display();
        this.pointCounter.display();
        this.garfield.display();
        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y].display();
            }
        }
    }

    
    forAllNeighbours(tile, func){
        // Given a tile, and a function, execute that function (that takes a tile as the only parameter) for the given tiles neighbours
        let xi = Math.floor((tile.x - Board.xOffset)/Board.tileSize);
        let yi = Math.floor((tile.y - Board.yOffset)/Board.tileSize);
        let sum = 0;
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                if(this.isValidIndex(xi+x, yi+y) && !(x==0 && y==0)){
                    sum += func(this.tiles[xi+x][yi+y]);
                }
            }
        }
        return sum;
    }


    tileFromCoordinates(x,y){
        //returns the tile based on the coordinates on the canvas
        let xi = Math.floor((x - Board.xOffset) /Board.tileSize);
        let yi = Math.floor((y - Board.yOffset) / Board.tileSize);
        if(this.isValidIndex(xi,yi)){
            return this.tiles[xi][yi];
        }
        return null;
    }

    onHover(x,y){
        //gets called when a mouse button is pressed down.
        
        let current = this.tileFromCoordinates(x,y);
        if(current == null){
            if(this.garfield.mouseOver()){
                this.lastClicked = this.garfield;
                this.garfield.spriteCoordinates = [26,56,25,25]
            }
            return;
        }
        
        if (this.gameState == 0){
            this.garfield.spriteCoordinates = [53,56,25,25]
        }
        if(!current.clicked && !current.marked){
            current.hovered = true;
        }
        if(mouseButton == CENTER){
            this.forAllNeighbours(current,(tile) => {tile.hovered = true;})
        }
        this.lastClicked = current
    }

    explore(tile){
        //gets called, when a tile gets "clicked" with the middle mouse button
        //reveals all neighbouring tiles, if the tile's value equals the number of tiles marked next to it.
        let marked = this.forAllNeighbours(tile, (tileX) => {return (tileX.marked * 1)})
        if(marked == tile.value)
            this.forAllNeighbours(tile, (tileX) => {this.revealTile(tileX)})
        
    }


    revealTile(tile){
        //Reveals the tile. If the tile has no mine neighbours, reveals all the neighbours, recursively.
        if(tile.clicked || tile.marked)
            return;
        tile.clicked = true;
        if(tile.isMine){
            //clicking on a mine loses the game
            this.gameState = -1;
            playSound("lose");
            return;
        }
        playSound("clear_tile");
        sleep(100).then(() => {
            if(tile.value == 0){
                this.forAllNeighbours(tile,(tileX) =>{this.revealTile(tileX)})
            }
        })
        
        
        
    }

    isValidIndex(x,y){
        return(x >= 0 && x < this.columns && y >= 0 && y < this.rows)
    }

    onClick(x,y){
        // gets called on a mouse button release. 
        let current = this.tileFromCoordinates(x,y)
        
        if(current != null && this.lastClicked === current && this.gameState == 0){
            // Lets the user cancel the click by dragging the mouse after clicking on a tile
            switch(mouseButton){
                case LEFT:
                //Reveal the tile, and all neighboring tiles recursively.
                    if(!this.initialized)
                        this.initialize(current)//TODO DIFF INPUT
                    this.revealTile(current);
                break;
                case RIGHT:
                //Mark/Flag the tile
                    if(!current.clicked){
                        current.marked = !current.marked;
                        if(current.marked){
                            this.pointCounter.value -= 1;
                            playSound("flag");
                        }
                        else{
                            this.pointCounter.value += 1;
                            playSound("deflag");
                        }
                            
                    }
                break;
                case CENTER:
                //Try to reveal all neighbour tiles
                    if(this.lastClicked.value > 0)
                        this.explore(this.lastClicked);
            }    
        }

        for(let x = 0; x < this.columns; x++){
            for(let y = 0; y < this.rows; y++){
                this.tiles[x][y].hovered = false;
            }
        }
        if(this.lastClicked === this.garfield && this.garfield.mouseOver()){
            this.resetBoard();
        }
        this.garfield.spriteCoordinates = [1,56,25,25];
        this.lastClicked = null;
    }

}