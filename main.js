const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function background() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const targetPos = new Vector(100, 100);
const targetRadius = 8;
function drawTarget() {
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.arc(targetPos.x, targetPos.y, targetRadius, 0, 2 * Math.PI);
	ctx.fill();
}

const radius = 4;
const numberOfGenes = 400;
const startPos = new Vector(canvas.width/2, canvas.height/2);
const mutationRate = 0.01;
class Vehicle {
	constructor(pos, vel, acc, genes) {
		this.pos = pos;
		if (vel) {
			this.vel = vel;
		} else {
			this.vel = new Vector(0, 0);
		}
		if (acc) {
			this.acc = acc;
		} else {
			this.acc = new Vector(0, 0);
		}
		if (genes) {
			this.genes = genes;
		} else {
			this.genes = [];
			for (let i = 0; i < numberOfGenes; i++) {
				this.genes.push(new Vector(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1));
			}
		}
		this.alive = true;
	}
	fitness() {
		let score = this.pos.dist(targetPos);
		score = 1 / score;
		score *= 100;
		return score;
	}
	mutate() {
		for (let i = 0; i < numberOfGenes; i++) {
			if (Math.random() < mutationRate) {
				this.genes[i] = new Vector(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1)
			}
		}
	}
	crossover(partner) {
		let genes = [];
		for (let i = 0; i < numberOfGenes; i++) {
			let gene = new Vector((this.genes[i].x + partner.genes[i].x) / 2, (this.genes[i].y + partner.genes[i].y) / 2);
			genes.push(gene);
		}
		let child = new Vehicle(startPos.copy(), new Vector(0, 0), new Vector(0, 0), genes);
		child.mutate();
		return child;
	}
	draw() {
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
	addForce(force) {
		this.acc.add(force);
	}
	update() {
		this.vel.add(this.acc);
		this.acc.reset();
		this.pos.add(this.vel);
	}
}

class Obstacle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	draw() {
		ctx.fillStyle = 'green';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	collide(vehicle) {
		if (vehicle.pos.x > this.x && vehicle.pos.x < this.x + this.width && vehicle.pos.y > this.y && vehicle.pos.y < this.y + this.height) {
			vehicle.alive = false;
		}
	}
}

let vehicles = [];
const numberOfVehicles = 100;
for (let i = 0; i < numberOfVehicles; i++) {
	vehicles.push(new Vehicle(startPos.copy()));
}
let obstacle = new Obstacle(200, 200, 200, 20);
let count = 0;
let generation = 0;
function step() {
	if (count < numberOfGenes) {
		background();
		drawTarget();
		obstacle.draw();
		for (let i = 0; i < numberOfVehicles; i++) {
			obstacle.collide(vehicles[i]);
			if (vehicles[i].alive) {
				vehicles[i].addForce(vehicles[i].genes[count]);
				vehicles[i].update();
			}
			vehicles[i].draw();
		}
		count++;
		document.getElementById('count').textContent = count;
	}
	if (count === numberOfGenes) {
		console.log('generation ' + generation);
		generation++;
		document.getElementById('generation').textContent = generation;
		for (let i = 0; i < numberOfVehicles; i++) {
			console.log(i, vehicles[i].fitness());
		}
		let pool = [];
		for (let i = 0; i < numberOfVehicles; i++) {
			let n = Math.floor(vehicles[i].fitness() * 100);
			for (let j = 0; j < n; j++) {
				pool.push(vehicles[i]);
			}
		}
		for (let i = 0; i < numberOfVehicles; i++) {
			let parent1 = pool[Math.floor(Math.random() * pool.length)];
			let parent2 = pool[Math.floor(Math.random() * pool.length)];
			let child = parent1.crossover(parent2);
			vehicles[i] = child;
		}
		count = 0;
	}
}
setInterval(step, 1000 / 60);
