function Monster() {
	this.ready = false;
	this.reset();
}

Monster.prototype.reset = function() {
	this.speed = SPEED;
	this.distance = DISTANCE;

	this.moveRight = false;
	this.moveDown = false;

	this.resetPosition();
};

Monster.prototype.resetPosition = function() {
	this.x = SPRITE_OFFSET + (Math.random() * (WIDTH - SPRITE_WIDTH));
	this.y = SPRITE_OFFSET + (Math.random() * (HEIGHT - SPRITE_HEIGHT));
	this.dead = false;
};

Monster.prototype.move = function() {
	if (this.distance === 0) {
		var x = Math.floor(Math.random() * 2);
		var y = Math.floor(Math.random() * 2);

		if (x) this.moveRight = true;
		else this.moveRight = false;

		if (y) this.moveDown = true;
		else this.moveDown = false;
		this.distance = DISTANCE;
	}

	if (this.moveRight) this.x -= this.speed;
	else this.x += this.speed;

	if (this.moveDown) this.y -= this.speed;
	else this.y += this.speed;

	this.distance--;
};