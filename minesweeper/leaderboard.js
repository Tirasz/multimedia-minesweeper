
// initialized in preload()
//Array of users, every user has a difficulty-time pair for each difficulty they managed to win on
var leaderboardData; 
var maxRows = 10;

function secondsToString(seconds){
    let minutes = Math.floor(seconds / 60);
    let s = seconds-(minutes*60);
    return `${((minutes < 10)? "0":"") + minutes}:${((s < 10)? "0":"") + s}`;
}



function displayLeaderboard(difficulty){
    $.getJSON("assets/leaderboard.json", (data) => {leaderboardData = data});
    //Displays the leaderboard of the given difficulty

    //Clear current records from the page.
    $(".record").remove();
    let dict = {};

    for(let i = 0; i < leaderboardData.length; i++){
        let name = leaderboardData[i].name;
        let score = leaderboardData[i].records[difficulty];
        if(typeof(score) !== 'undefined' ){
            //Player has a record on the given (current) difficulty
            dict[name] = int(score);
        }
    }

    // Turn dictionary into array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });
    
    // Sort the array based on the second element (time)
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    //inside #records:
    // <div class="col-6 record">Name</div><div class="col-6 record">Time</div>
    for(let i = 0; i < Math.min(maxRows, items.length); i++){
        let text = `<div class="col-2 record">${i+1} :</div><div class="col-4 record">${items[items.length - i-1][0]}</div><div class="col-6 record">${secondsToString(items[items.length - i-1][1])}</div>`;
        $("#records").append(text);
    }
}
function submitRecord(){
    let userName = $('#name').val();
    if(userName.length > 10){
        userName = userName.substring(0,8) + "..";
    }
    let score = board.timer.value;
    let difficulty = $( "#leaderboard-difficulty" ).text();

    addNewRecord(userName, difficulty, score);
    displayLeaderboard(difficulty);
    board.resetBoard();
    playSound("submit_score");
    $( "#leaderboard-submit" ).removeClass("revealed");
    $( "#leaderboard-submit" ).addClass("hidden");
}

function addNewRecord(userName, difficulty, newTime){
   
    var userExists = false;
    for(let i = 0; i < leaderboardData.length; i++){
        let name = leaderboardData[i].name;
        if(name.toLowerCase() === userName.toLowerCase()){
            userExists = true;
            //User already in leaderboards
            let score = leaderboardData[i].records[difficulty];
            if(typeof(score) == 'undefined' || newTime < score){
                //User didn't have a score for this difficulty, or his score was worse
                leaderboardData[i].records[difficulty] = newTime;
            }
            break;
        }
    }
    if(!userExists){
        leaderboardData[leaderboardData.length] = {
            "name": userName,
            "records": {[difficulty] : newTime}
        };
    }

    //console.log(`Saved ${userName}' score: ${newTime}`)
    $.post( "updateLeaderboard.php", JSON.stringify(leaderboardData))
}