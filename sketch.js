const width = 400;
const height = 600;
const heightGap = 100;

let posBird;
let score;
// velocity of bird downwards
let velBird;
let velForward;
let posBlock;
let posGap;
let gameState;
let bird;
let img;

function preload() {
  img = loadImage("./flappy.png");
}

function setup() {
  createCanvas(width, height);
  gameInit();
}

function draw() {
  background(10, 200, 250);

  stroke(100);
  strokeWeight(2);

  if (gameState === "PROGRESS") {
    fill(250, 100, 0);
    posBird += velBird;

    if (posBlock < -50) {
      posGap = random(heightGap, height - heightGap);
      posBlock = width;
      score++;
    } else posBlock -= velForward;

    // imageMode(CENTER);
    // rotate(PI / 3.0);
    image(img, width / 3, posBird);

    // rotate(-PI / 3.0);
    fill(0, 200, 0);

    //top block
    rect(posBlock, 0, 50, posGap - heightGap / 2);
    //bottom block
    rect(posBlock, posGap + heightGap / 2, 50, height - posGap - heightGap / 2);

    // collision detection
    if (posBlock <= width / 3 && posBlock > width / 3 - 50) {
      if (
        posBird <= posGap - heightGap / 2 ||
        posBird >= posGap + heightGap / 2
      ) {
        gameState = "OVER";
      }
    }
    if (posBird >= height || posBird < 0) {
      gameState = "OVER";
    }

    //physics
    velBird += 0.4;
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
  velBird = -8;
  if (gameState === "OVER") {
    gameInit();
  }
}

function keyPressed() {
  jump();
}

function touchEnded() {
  jump();
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function gameInit() {
  posBird = 200;
  score = 0;
  // velocity of bird downwards
  velBird = 3;
  velForward = 2;
  posBlock = width;
  posGap = random(heightGap, height - heightGap);
  gameState = "PROGRESS";
}
