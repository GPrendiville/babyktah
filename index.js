const resultSpan = document.querySelector('span');

class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
    if (this.x > 800 - this.radius) {
      this.x = 800 - this.radius;
    }
    if (this.x < 0 + this.radius) {
      this.x = 0 + this.radius;
    }
    if (this.y > 600 - this.radius) {
      this.y = 600 - this.radius;
    }
    if (this.y < 0 + this.radius) {
      this.y = 0 + this.radius;
    }
  }
}

const player = new Character(30, 30, "blue", 10, 0.05);
const enemies = [
  new Character(300, 0, "rgb(200,190,80)", 15, 0.01),
  new Character(300, 300, "rgb(240,100,250)", 17, 0.03),
  new Character(0, 300, "rgb(80,200,235)", 20, 0.003),
  new Character(20, 400, "rgb(100,170,190)", 12, 0.02),
];
let scarecrow;

function setup()  {
  let canvas = createCanvas(800, 600);
  canvas.parent(document.querySelector("#game"));
  noStroke()
}

function draw() {
  background("lightgreen");
  player.draw();
  player.move({x: mouseX, y: mouseY});
  enemies.forEach(enemy => enemy.draw());
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  adjust();
}

function adjust() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i+1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function fixedWalls() {
  const characters = [player, ...enemies];
  for (let o in characters) {
    while (o.x > 800) {
      c.x = 800;
    }
  }
  for (let d in characters) {
    while (d.y > 600) {
      c.y = 600;
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0 && (c1 === player || c2 === player)) {
    loseHealth();
  }
  if (overlap > 0) {
    const adjustX = (overlap / 2) * (dx / distance);
    const adjustY = (overlap / 2) * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function mouseClicked() {
  if (!scarecrow) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate() * 5;
  }
}

function loseHealth() {
  let msg = document.getElementById("message");
  let health = document.getElementById("health");
  health.value -= 1;
  if (health.value <= 0) {
    resultSpan.textContent = "K'Tah claimed another victim!";
    $("canvas")[0].getContext('2d').clearRect(0,0,width,height);
  }
}
