const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let bird;
let isDragging = false;
let ground;

function preload () {
    // No assets to load yet
}

function create () {
    // Create the ground
    ground = this.add.rectangle(400, 580, 800, 40, 0x654321);
    this.physics.add.existing(ground, true); // true for static

    // Create the bird
    bird = this.add.circle(100, 450, 20, 0xff0000);
    this.physics.add.existing(bird);
    bird.body.setCollideWorldBounds(true);
    bird.body.setBounce(0.5);

    // Add collision between bird and ground
    this.physics.add.collider(bird, ground);

    // Create a target
    const target = this.add.rectangle(600, 500, 50, 100, 0x00ff00);
    this.physics.add.existing(target);
    target.body.setCollideWorldBounds(true);

    // Add collision between bird and target
    this.physics.add.collider(bird, target);

    // Make the bird draggable
    bird.setInteractive();
    this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === bird) {
            isDragging = true;
        }
    });

    this.input.on('pointermove', (pointer) => {
        if (isDragging) {
            bird.setPosition(pointer.x, pointer.y);
            bird.body.setAllowGravity(false);
            bird.body.setVelocity(0, 0);
        }
    });

    this.input.on('pointerup', (pointer) => {
        if (isDragging) {
            isDragging = false;
            bird.body.setAllowGravity(true);
            // Calculate velocity based on drag distance/direction
            const launchVelocityX = (100 - pointer.x) * 5;
            const launchVelocityY = (450 - pointer.y) * 5;
            bird.body.setVelocity(launchVelocityX, launchVelocityY);
        }
    });
}

function update () {
    // Reset bird position if it goes off-screen
    if (bird.y > 600) {
        resetBird();
    }
}

function resetBird() {
    bird.setPosition(100, 450);
    bird.body.setVelocity(0, 0);
    bird.body.setAllowGravity(false); // Initially no gravity until launched
    // A little trick to make it static until launched again
    setTimeout(() => {
        if (!isDragging) {
            bird.body.setAllowGravity(true);
        }
    }, 100);
}