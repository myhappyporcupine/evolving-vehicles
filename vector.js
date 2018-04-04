class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	copy() {
		return new Vector(this.x, this.y);
	}
	reset() {
		this.x = this.y = 0;
	}
	add(other) {
		this.x += other.x;
		this.y += other.y;
	}
	dist(other) {
		return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
	}
}
