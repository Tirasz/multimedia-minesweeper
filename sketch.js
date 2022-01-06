var board;
var sprites;
var maxOffset = 5;
var effectsEnabled = false;
var musicEnabled = false;
var sounds = {};
var controlsRevealed = false;



function showControls(){
    $("#controls").stop();
    if(!controlsRevealed){
        $( "#controls" ).removeClass("controlsHidden");
        $( "#controls" ).addClass("controlsRevealed");
        controlsRevealed = true;
    }else{
        $( "#controls" ).removeClass("controlsRevealed");
        $( "#controls" ).addClass("controlsHidden");
        controlsRevealed = false;
    }
}


function peekControls(){
    if(!controlsRevealed){
        $( "#controls" ).animate({height: '40px'}, 300, );
    }
}

function hideControls(){
    if(!controlsRevealed){
        $( "#controls" ).animate({height: '0px'}, 100, );
    }
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

function playSound(name, mode="sustain"){
    sounds[name].playMode(mode)
    if(effectsEnabled)
        sounds[name].play();
}



function preload(){
    sounds["win"] = loadSound("assets/win.mp3")
    sounds["lose"] = loadSound("assets/lose.mp3")
    sounds["main_theme"] = createAudio("assets/main_theme.mp3"); //loadSound("assets/main_theme.mp3")
    sounds["submit_score"] = loadSound("assets/submit_score.mp3")
    sounds["clear_tile"] = loadSound("assets/clear_tile.mp3")
    sounds["flag"] = loadSound("assets/flag.mp3")
    sounds["deflag"] = loadSound("assets/deflag.mp3")
    sounds["new_tile"] = loadSound("assets/new_tile.mp3")
    $.getJSON("assets/leaderboard.json", (data) => {leaderboardData = data});
    //song = loadSound("assets/main_theme.mp3");
    
}


function setup() {
    var canvas = createCanvas(600,650);
    sprites = loadImage("assets/garfield_sprites.png");
    canvas.parent('canvas-container')
    board = new Board(600,600,2);
    displayLeaderboard( $( "#leaderboard-difficulty" ).text());
    //disables the default broswer right-click event on the canvas.
    document.getElementById("defaultCanvas0").addEventListener('contextmenu', event => event.preventDefault());
    //disables middleclick scroll
    document.body.onmousedown = function(e) { if (e.button === 1) return false; }

    $( ".button" ).click(function() {
        let before = board.gameState;
        let temp = true;
        switch($(this).children()[0].text){
            case "Easy":
                board = new Board(600,600,1)
                break;
            case "Medium":
                board = new Board(600,600,2)
                break;
            case "Hard":
                board = new Board(600,600,3)
                break;
            case "Extreme":
                board = new Board(600,600,4)
                break;
            case "Insane":
                board = new Board(600,600,5)
                break;
            default:
                temp = false;
            break;
        }
       if(temp){
           if(before === 1){ //if he won, but resets the game
            $( "#leaderboard-submit" ).removeClass("revealed");
            $( "#leaderboard-submit" ).addClass("hidden");
           }
        $( "#leaderboard-difficulty" ).text($(this).children()[0].text) 
        playSound("new_tile");
        displayLeaderboard( $( "#leaderboard-difficulty" ).text());
       }
    });
   
    $( "#sfx" ).click(function(){
        effectsEnabled = !effectsEnabled;
        if(effectsEnabled){
            $(this).children()[0].text = "🔔";
            sounds["new_tile"].play();
        }
        else
            $(this).children()[0].text = "🔕";
    });
    
    $( "#music" ).click(function(){

        if(musicEnabled){
            sounds["main_theme"].stop();
            $(this).children()[0].text = "🔇";
            musicEnabled = false;
        }else{
            sounds["main_theme"].loop()
            $(this).children()[0].text = "🔊";
            musicEnabled = true;
        }
        
    });

  
}

function draw() {
    //
    strokeWeight(0);
    fill(color("#ffbf74"))
    rect(0,0,width,height);
    strokeWeight(5)
    stroke(color("#ffdf9c"))
    line(0,0,width,0);
    line(0,0,0,height);
    stroke(color("#bf7400"))
    line(width,0,width,height);
    line(0,height,width,height);
    let canvasXOffset = ((windowWidth - width)/2) 
    let canvasYOffset = ((windowHeight - height)/2)
    let directionX = map(mouseX, (-canvasXOffset), (width + canvasXOffset-1),-maxOffset,maxOffset);
    let directionY = map(mouseY, (-canvasYOffset), (height + canvasYOffset-1),-maxOffset,maxOffset);
    $( '#bckg' ).css("background-position-x",`${directionX % 100}%` )
    $( '#bckg' ).css("background-position-y",`${directionY % 100}%` )
    
 
    board.update();
    board.display();

}


function mousePressed(){
    board.onHover(mouseX, mouseY);
}

function mouseReleased(){
    board.onClick(mouseX, mouseY);
}