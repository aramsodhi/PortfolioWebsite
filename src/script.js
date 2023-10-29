const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

canvas.width = innerWidth;
canvas.height = innerHeight * 0.9;

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

addEventListener("resize", () => {
canvas.width = innerWidth;
canvas.height = innerHeight * 0.9;

WIDTH = canvas.width;
HEIGHT = canvas.height;
});



const FPS = 144;
const PARTICLE_COUNT = innerWidth / 2;
const MULTIPLIER = 5;

let mouse = {
  x: null,
  y: null
};

class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;

    this.friction = 0.99;

    this.size = size;
    this.color = `rgb(${random_num(20, 200)}, ${random_num(0, 50)}, ${random_num(100, 255)})`;

    this.x_vel = 0;
    this.y_vel = 0;

    this.range = 50;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(WIDTH, HEIGHT) {
    this.x += this.x_vel;
    this.y += this.y_vel;

    this.x_vel *= this.friction;
    this.y_vel *= this.friction;

    if (this.x + this.size > WIDTH || this.x < 0) {
      this.x_vel *= -1;
    }

    if (this.y + this.size > HEIGHT || this.y < 0) {
      this.y_vel *= -1;
    }
  }

  react(mouse) {
    const x_diff = this.x - mouse.x;
    const y_diff = this.y - mouse.y;

    const distance = Math.sqrt(x_diff ** 2 + y_diff ** 2);
    const force_direction = {
      x: x_diff / distance,
      y: y_diff / distance
    };

    let force = (this.range - distance) / this.range;
    if (force < 0) force = 0;

    this.x_vel += force_direction.x * force * MULTIPLIER;
    this.y_vel += force_direction.y * force * MULTIPLIER;
  }
}


let particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle(random_num(0, WIDTH), random_num(0, HEIGHT), random_num(2, 8)))
}

let interval = setInterval(function() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let particle = particles[i];

    if (mouse.x != null) {
      particle.react(mouse);
    }
    
    particle.update(WIDTH, HEIGHT);
    particle.render(ctx);
  }
}, 1000 / FPS);


function random_num(min, max) {
  return Math.random() * (max - min) + min;
}


overlay.addEventListener("mousemove", (event) => {
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
});
