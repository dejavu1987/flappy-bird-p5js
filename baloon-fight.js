const width = 400;
const height = 600;

let posPlayerX;
let posPlayerY;
let score;
// velocity of bird downwards
let velPlayerY;
let velPlayerX;
let gameState;
let bird;
let img;
let posPlatformX;
let posPlatformY;
let widthPlatform;
let heightPlatform;
let onPlatform;

function preload() {
  img = loadImage("./bf-player.png");
}

function setup() {
  createCanvas(width, height);
  gameInit();
}

function draw() {
  background(10, 200, 250);

  stroke(100);
  strokeWeight(2);
  fill(0, 100, 0);
  rect(posPlatformX, posPlatformY, widthPlatform, heightPlatform);

  if (gameState === "PROGRESS") {
    fill(250, 100, 0);
    posPlayerY += velPlayerY;
    posPlayerX += velPlayerX;

    // imageMode(CENTER);
    // rotate(PI / 3.0);
    image(img, posPlayerX, posPlayerY);

    // rotate(-PI / 3.0);
    fill(0, 200, 0);

    if (posPlayerY <= 0) {
      posPlayerY = 0;
      velPlayerY = -velPlayerY / 2;
    }

    if (posPlayerX <= 0) {
      posPlayerX = 0;
      velPlayerX = -velPlayerX / 2;
    } else if (posPlayerX + 20 >= width) {
      posPlayerX = width - 20;
      velPlayerX = -velPlayerX / 2;
    }

    if (posPlayerY >= height) {
      gameState = "OVER";
    }

    if (
      velPlayerY >= 0 &&
      posPlayerY + 32 >= posPlatformY &&
      posPlayerY + 32 <= posPlatformY + 5 &&
      posPlayerX + 20 > posPlatformX &&
      posPlayerX < posPlatformX + widthPlatform
    ) {
      onPlatform = true;
      velPlayerX /= 1.05;
      posPlayerY = posPlatformY - 32;
    } else {
      onPlatform = false;
      if (
        posPlayerY + 32 >= posPlatformY &&
        posPlayerY <= posPlatformY + heightPlatform &&
        posPlayerX + 20 > posPlatformX &&
        posPlayerX < posPlatformX + widthPlatform
      ) {
        if (Math.abs(posPlayerX + 20 - posPlatformX) < 10) {
          posPlayerX = posPlatformX - 20;
          velPlayerX = -velPlayerX;
        } else if (Math.abs(posPlayerX - (posPlatformX + widthPlatform)) < 10) {
          posPlayerX = posPlatformX + widthPlatform;
          velPlayerX = -velPlayerX;
        }

        if (Math.abs(posPlayerY - (posPlatformY + heightPlatform)) < 10) {
          posPlayerY = posPlatformY + heightPlatform;
          velPlayerY = -velPlayerY;
        }
      }
    }

    if (!onPlatform) {
      //physics
      velPlayerY += 0.07;
    } else {
      velPlayerY = 0;
    }

    fill(255);
    text("Score: " + score, 20, 20);
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

function jump() {
  velPlayerY -= 2;
  if (gameState === "OVER") {
    gameInit();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    jump();
  } else if (keyCode === LEFT_ARROW) {
    velPlayerX -= 1;
  } else if (keyCode === RIGHT_ARROW) {
    velPlayerX += 1;
  }
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function gameInit() {
  posPlayerX = 200;
  posPlayerY = height - 100;
  score = 0;
  // velocity of bird downwards
  velPlayerY = 3;
  velPlayerX = 0;
  posPlatformX = 100;
  posPlatformY = 200;
  widthPlatform = 200;
  heightPlatform = 40;
  onPlatform = true;
  gameState = "PROGRESS";
}
