// Spaceship prefab
class Spaceship2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed + 2;         // pixels per frame
        this.direction = Math.random() < 0.5;
    }

    update() {

        // move spaceship left
        if(this.direction) {
            this.x -= this.moveSpeed;

            // wrap around from left edge to right edge
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        }
        // move spaceship right
        else {
            this.x += this.moveSpeed;
            // wrap around from right edge to left edge
            if(this.x >= game.config.width)
            {
                this.reset();
            }
        }

    }

    // position reset
    reset() {
        if(this.direction) {
            this.x = game.config.width;
        }
        else {
            this.x = 0;
        }
    }

    // direction reset
    dReset() {
        this.lastd = this.direction;
        this.direction = Math.random() < 0.5;
    }

    // check orientation
    dcheck() {
        if(this.lastd != this.direction) {
            return false;
        }else {
            true;
        }
    }
}
