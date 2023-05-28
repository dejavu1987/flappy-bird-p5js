const width = 400;
const height = 600;

let score;

let gameState;
let img = {};
let posPlatformX;
let posPlatformY;
let widthPlatform;
let heightPlatform;

function preload() {
  img.player1 = loadImage("./bf-player1.png");
  img.player2 = loadImage("./bf-player2.png");
}

class Player {
  constructor(x, y, playerName, vx, vy) {
    this.x = x;
    this.y = y;
    this.name = playerName;
    this.velX = vx;
    this.velY = vy;
  }

  updatePosition() {
    this.y += this.velY;
    this.x += this.velX;
    // hit top wall
    if (this.y <= 0) {
      this.y = 0;
      this.velY = -this.velY / 2;
    }
    // hit left wall
    if (this.x <= 0) {
      this.x = 0;
      this.velX = -this.velX / 2;
    } else if (this.x + 20 >= width) {
      // hit right wall
      this.x = width - 20;
      this.velX = -this.velX / 2;
    }
  }

  checkCollision(otherPlayer) {
    if (
      Math.abs(this.x - otherPlayer.x) < 20 &&
      Math.abs(this.y - otherPlayer.y) < 32
    ) {
      this.velX = -this.velX;
      otherPlayer.velX = -otherPlayer.velX;
    }
  }

  draw() {
    image(img[this.name], this.x, this.y);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.playersOnPlatform = {};
  }

  draw() {
    rect(this.x, this.y, this.width, this.height);
  }

  playerOnPlatform(player) {
    return this.playersOnPlatform[player.name];
  }

  checkCollision(player) {
    if (
      player.velY >= 0 &&
      player.y + 32 >= this.y &&
      player.y + 32 <= this.y + 15 &&
      player.x + 20 > this.x &&
      player.x < this.x + this.width
    ) {
      this.playersOnPlatform[player.name] = true;
      player.velX /= 1.05;
      player.y = this.y - 32;
    } else {
      this.playersOnPlatform[player.name] = false;
      if (
        player.y + 32 >= this.y &&
        player.y <= this.y + this.height &&
        player.x + 20 > this.x &&
        player.x < this.x + this.width
      ) {
        if (Math.abs(player.x + 20 - this.x) < 10) {
          player.x = this.x - 20;
          player.velX = -player.velX;
        } else if (Math.abs(player.x - (this.x + this.width)) < 10) {
          player.x = this.x + this.width;
          player.velX = -player.velX;
        }

        if (Math.abs(player.y - (this.y + this.height)) < 10) {
          player.y = this.y + this.height;
          player.velY = -player.velY;
        }
      }
    }
  }
}

const dumpVals = () => {
  textSize(10);
  text("px: " + player.x, 20, 30);
  text("py: " + player.y, 20, 40);
  text("pvx: " + player.velX, 20, 50);
  text("pvy: " + player.velY, 20, 60);
  text("pop1: " + JSON.stringify(platform1.playersOnPlatform), 20, 70);
  text("pop2: " + JSON.stringify(platform2.playersOnPlatform), 20, 80);
};

const platform1 = new Platform(100, 500, 200, 40);
const platform2 = new Platform(100, 200, 200, 40);

const platforms = [platform1, platform2];

const player = new Player(80, 150, "player1", 0, 3);
const player2 = new Player(180, 150, "player2", 0, 3);

const players = [player, player2];

function setup() {
  createCanvas(width, height);
  gameInit();
}

function draw() {
  background(10, 200, 250);

  stroke(100);
  strokeWeight(2);
  fill(0, 100, 0);
  platforms.forEach((p) => p.draw());

  if (gameState === "PROGRESS") {
    fill(250, 100, 0);
    players.forEach((p) => {
      p.updatePosition();
      p.draw();
    });

    fill(0, 200, 0);

    if (player.y >= height) {
      gameState = "OVER";
    }

    platforms.forEach((pt) => {
      players.forEach((pl) => pt.checkCollision(pl));
    });

    function handlePlayersCollisions() {
      players.forEach((p1, idx) => {
        if (idx < players.length - 1)
          for (let i = idx + 1; i < players.length; i++) {
            if (p1.name !== players[i].name) {
              players[i].checkCollision(p1);
            }
          }
      });
    }

    handlePlayersCollisions();

    players.forEach((pl) => {
      if (!platforms.some((p) => p.playerOnPlatform(pl))) {
        //physics
        pl.velY += 0.07;
      } else {
        pl.velY = 0;
      }
    });

    fill(255);
    textSize(12);
    text("Score: " + score, width - 80, 20);
    // dumpVals();
  } else {
    textSize(34);
    fill(230, 180, 0);
    textStyle(BOLD);
    text("GAME OVER", width / 2 - 100, height / 2);
    textStyle(NORMAL);
    textSize(16);
    text("SCORE: " + score, width / 2 - 100, height / 2 + 50);
  }
}

function jump(player) {
  player.velY -= 2;
  if (gameState === "OVER") {
    gameInit();
  }
}

function keyPressed() {
  console.log(keyCode);

  if (keyCode === UP_ARROW) {
    jump(player);
  } else if (keyCode === LEFT_ARROW) {
    player.velX -= 1;
  } else if (keyCode === RIGHT_ARROW) {
    player.velX += 1;
  }

  if (keyCode === 87) {
    jump(player2);
  } else if (keyCode === 65) {
    player2.velX -= 1;
  } else if (keyCode === 68) {
    player2.velX += 1;
  }
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function gameInit() {
  player.x = 200;
  player.y = 400;
  score = 0;
  // velocity of bird downwards
  player.velY = 3;
  player.velX = 0;
  player.onPlatform = true;
  gameState = "PROGRESS";
}
