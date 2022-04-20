class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/spacesShip2.png');
        this.load.image('base','./assets/RocketPatrolBackground_Base.png');
        this.load.image('starfield0', './assets/RocketPatrolBackground_Layer00.png');
        this.load.image('starfield', './assets/RocketPatrolBackground_Layer01.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion2', './assets/explosion.png', {frameWidth: 64, frameHeight: 16, startFrame: 0, endFrame: 9});
    }

    create() {
        // change cursor image
        this.input.setDefaultCursor('url(./assets/RocketPatrolPointer.png), pointer');
        // place tile sprite
        this.base = this.add.tileSprite(0, 0, 640, 480, 'base').setOrigin(0, 0);
        this.starfield0 = this.add.tileSprite(0, 0, 640, 480, 'starfield0').setOrigin(0, 0);
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*7, borderUISize*5, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*4, borderUISize*6 + borderPadding*3, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*7, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship2(this, game.config.width, borderUISize*2 + borderPadding*5, 'spaceship2', 0, 50).setOrigin(0,0);
        if(this.ship01.direction == false) {
            this.ship01.flipX=true;
        }
        if(this.ship02.direction == false) {
            this.ship02.flipX=true;
        }
        if(this.ship03.direction == false) {
            this.ship03.flipX=true;
        }
        if(this.ship04.direction == false) {
            this.ship04.flipX=true;
        }

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        // initiate timer
        this.startingTime = this.time.now/1000;
        this.timer = game.settings.gameTimer/1000 + this.startingTime;

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.timerRight = this.add.text(game.config.width - borderUISize*4 - borderPadding, borderUISize + borderPadding*2, this.timer, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Paralax scrolling
        this.starfield0.tilePositionX -= 1;  // update tile sprite
        this.starfield.tilePositionX -= 2;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x4)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode2(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        // Game Over Check
        if(this.checkTimer() && Math.round(this.timer - this.time.now/1000) != -1)
        {
            this.timerRight.text = Math.round(this.timer - this.time.now/1000);
        }else {
            this.p1Rocket.alpha = 0;             // make assets disapear x5
            this.ship01.alpha = 0;           
            this.ship02.alpha = 0;
            this.ship03.alpha = 0;
            this.ship04.alpha = 0;
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu').setOrigin(0.5);
            this.gameOver = true;
        }

        // Re-orient ship on spawn change
        this.ship01.flipX = !this.ship01.direction;
        this.ship02.flipX = !this.ship02.direction;
        this.ship03.flipX = !this.ship03.direction;
        this.ship04.flipX = !this.ship04.direction;
    }

    checkTimer() {
        if (game.settings.gameTimer/1000 > this.time.now/1000 - this.startingTime)
        return true;
        else {
            false;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;  

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.dReset();                        // randomizes spawn direction
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;
        game.settings.gameTimer += 1000;
        this.timer += 1;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');

      }

      shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;  

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion2').setOrigin(0, 0);
        boom.anims.play('explode2');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.dReset();                        // randomizes spawn direction
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;
        game.settings.gameTimer += 1000;
        this.timer += 1;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');

      }
}