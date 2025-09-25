const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
    this.load.image('background', 'assets/background.png');
    this.load.image('bird', 'assets/hatchling.png');
}

function create () {
    // Add the background
    this.add.image(400, 300, 'background');

    // Create an invisible ground
    ground = this.add.rectangle(400, 580, 800, 40, 0x000000, 0); // Last param is alpha
    this.physics.add.existing(ground, true);

    // Create the bird
    bird = this.physics.add.sprite(100, 450, 'bird');
    bird.setScale(0.2); // Slightly larger bird
    bird.body.setCollideWorldBounds(true);
    bird.body.setBounce(0.4);
    bird.body.setCircle(bird.width / 3, bird.width / 6, bird.height / 6); // Adjust physics body

    // Add collision between bird and ground
    this.physics.add.collider(bird, ground);

    // Create a target crate
    const target = this.add.rectangle(600, 500, 60, 60, 0x8B4513); // Brown color for a crate
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