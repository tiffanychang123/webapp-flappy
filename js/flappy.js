// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var player;
var score = 0;
var labelscore;
var pipes = [];
var pipeInterval;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var gapSize = 150;
var gapMargin = 60;
var blockHeight = 50;
var pipeEndHeight=25;
var pipeEndExtraWidth=10;
var gapStart;
var pipeEnd;
var gameGravity;
var balloons = [];
var weight = [];
var diceRoll;
var bonus;
/*
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function (event_details) {

    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    alert(greeting_message);
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");

    //event_details.preventDefault();
});

function preload() {
    game.load.image("smileyface", "../assets/smileyface.jpg");
    game.load.image("clouds giff", "../assets/clouds giff.gif");
    game.load.image("smile", "../assets/Smile-11.jpg");
    game.load.audio("point", "../assets/point.ogg");
    //game.load.image("ball", "../assets/ball.png");
    game.load.image("ball", "../assets/flappy.png")
    game.load.image("pipe", "../assets/pipe.png");
    game.load.image("pipe-end","../assets/pipe-end.png");
    game.load.image("balloons","../assets/balloons.png");
    game.load.image("weight","../assets/weight.png");
}

/*
 * Initialises the game. This function is only called once.
 */

function create() {
    game.stage.setBackgroundColor("#CCEEFF");
    var cloudsgiff = game.add.image(0, 0, "clouds giff");
    cloudsgiff.width = 790;
    cloudsgiff.height = 400;
    game.add.text(200, 10, "Hello,how are you?",
        {font: "60px Algerian", fill: "#FFFF00"});
    var smileyface = game.add.sprite(0, 0, "smileyface");
    smileyface.width = 50;
    smileyface.height = 50;
    var smileyface1 = game.add.sprite(0, 350, "smileyface");
    smileyface1.width = 50;
    smileyface1.height = 50;


    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(20, 200, "ball");
    game.physics.arcade.enable(player);
    player.body.velocity.x = 20;
    player.body.gravity.y = 10;


   /* game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(40, 200, "ball");
    game.physics.arcade.enable(player);
    player.body.velocity.x = 20;
    player.body.gravity.y = 10;*/


    pipeInterval = 2;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveup);

    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(movedown);

    /*game.input
        .onDown
        .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);*/

    // pointer.rightButton
    alert(score);
    labelscore = game.add.text(80, 10, "0")
    labelscore.setText(score.toString());
    /*game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveleft);*/



    player.anchor.setTo(0.5,0.5);
    //makes the player jump when spacebar is pressed

   /*game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);*/



    // set the background colour of the scene
}

function clickHandler(event) {
    var smile = game.add.sprite(event.x, event.y, "smile");
    smile.width = 100;
    smile.height = 100;
}

function spaceHandler(event) {
    game.sound.play("point");
    changescore();
}
function changescore() {
    score += 10;
    labelscore.setText(score.toString());
    // var score = 0;
   if (score < 1) {
        score += 1;
    }
    if (score >= 1 && score <= 100) {
        score += 2;
    }

}
 /*function moveRight() {
    player.x += 100;
}

function moveleft() {
    player.x -= 100;
}*/

function moveup() {
    player.y -= 20;
}


function movedown() {
    player.y += 20;
}



function addPipeBlock(x, y) {
    // create a new pipe block
    var pipeBlock = game.add.sprite(x, y, "pipe");
    // insert it in the 'pipes' array
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}


function generatePipe() {
   var gapStart = game.rnd.integerInRange(gapMargin,  height- gapSize  - gapMargin );

   addPipeEnd(width-(pipeEndExtraWidth/2), gapStart);
    for (var y = gapStart; y>0;  y-=blockHeight ) {
                          addPipeBlock(width ,y- blockHeight)}



   addPipeEnd(width-(pipeEndExtraWidth/2), gapStart+gapSize-pipeEndHeight);
    for (var y = gapStart + gapSize; y< height ;y+= blockHeight) {

            addPipeBlock(width, y);
        }
    changescore();
}

/*function playerJump() {
    player.body.velocity.y = -70;

}*/


$.get("/score", function (scores) {
    console.log("Data: ", scores);
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        if (i == 0) {
            $("#scoreBoard").append(
                "<li> The highest score is: "+scores[i].name + ": " + scores[i].score +
                "</li>" +
                "<li> You are great! </li>");
        }

    }
});


/* This function updates the scene. It is called for every new frame.
 */




function update() {
    /*game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);*/


    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);



        if(player.body.y < 0) {
            gameOver();
        }
        if(player.body.y > 400){
            gameOver();
        }

        player.rotation += 1;
        player.rotation = Math.atan(player.body.velocity.y / 200);
    }

    for(var i=weight.length - 1; i >= 0; i--){

        game.physics.arcade.overlap(player,weight[i], function(){
            changeGravity(60);
            weight[i].destroy();
            weight.splice(i,1);


        });
    }


    for(var i=balloons.length - 1; i >= 0; i--) {
        game.physics.arcade.overlap(player, balloons[i], function () {
            gapSize += 25;
            balloons[i].destroy();
            balloons.splice(i, 1);


        });
    }
}

function addPipeEnd(x,y)
{
    var pipeEnd = game.add.sprite(x, y, "pipe-end");
    // insert it in the 'pipes' array
    pipes.push(pipeEnd);
    game.physics.arcade.enable(pipeEnd);
    pipeEnd.body.velocity.x =-200;
}

function gameOver() {
    //   location.reload();
  //  game.destroy();
    game.paused = true;
    $("#score").val(score.toString());
    $("#greeting").show();
    game.state.restart();


}
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}
function generateBalloons()
{
    var bonus=game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function generateWeight()
{
    var bonus = game.add.sprite(width, height, "weight");
    weight.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);

}
function generate()
{var diceRoll = game.rnd.integerInRange(1,8);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}
function checkBonus(bonusArray, bonusEffect){
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,bonusArray[i], function(){
            changeGravity(bonusEffect);
            bonusArray[i].destroy();
            bonusArray.splice(i,1);
        });
    }
}

