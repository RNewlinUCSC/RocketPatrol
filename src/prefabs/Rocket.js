// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 4;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
        
    }
    

    update() {
        // Mouse Control Aim
        if(!this.isFiring) {
            this.angle = (Phaser.Math.Angle.Between(this.x, this.y, game.input.mousePointer.x,game.input.mousePointer.y) * 180/Math.PI) + 90;
        }

        // fire button
        if(game.input.mousePointer.isDown && !this.isFiring) {
            this.angleSave = Math.abs((Phaser.Math.Angle.Between(this.x, this.y, game.input.mousePointer.x,game.input.mousePointer.y)));
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {

            if(this.angleSave > 0) {
                this.x += Math.cos(this.angleSave) * this.moveSpeed;
                this.y -= Math.sin(this.angleSave) * this.moveSpeed;
            }
            if(this.angleSave < 0) {
                this.x -= Math.abs(Math.cos(this.angleSave) * this.moveSpeed);
                this.y += Math.abs(Math.sin(this.angleSave) * this.moveSpeed);
            }
        }
        
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding || this.x <= 0 + borderPadding|| this.x >= 640 - borderPadding){
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
        this.x = game.config.width/2;
    }
}
