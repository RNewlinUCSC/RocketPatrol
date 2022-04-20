let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    autoCenter: true,
    scene: [ Menu, Play ],
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

//Points Breakdown:
//Create and implement a new weapon(w/ new behavior) (20)
//Implement Mouse control for player movement and mouse click to fire (20)
//Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
//Create a new spaceship type (w/ new artwork) that smaller, moves faster, and is worth more (20)
//Implement parallax scrolling (10)
//Display the time remaining (in seconds) on the screen (10)
//Randomize each spaceship's movement direction at the start of each play (5)

//Robert Newlin, Rocket Mod Patrol, 4/20/22, ~10hours (however there was an entire day that I'm not counting,
//figuring out how to track the moouse and fire the rocket at an angle to the mouse location)