function Hero() {
	this.ready = false;

	this.addKeyListeners();
	this.reset();
}

Hero.prototype.reset = function() {
	this.speed = SPEED + 1;
	this.x = 0;
	this.y = 0;
	this.keys = {};
};

Hero.prototype.move = function() {
	// Left
	if (this.keys[left] === true) {
		this.x -= this.speed;
	}
	// Up
	if (this.keys[up] === true) {
		this.y -= this.speed;
	}
	// Right
	if (this.keys[right] === true) {
		this.x += this.speed;
	}
	// Down
	if (this.keys[down] === true) {
		this.y += this.speed;
	}
};

Hero.prototype.addKeyListeners = function() {
	window.addEventListener("keydown", function (e) {
		this.keys[e.keyCode] = true;
	}.bind(this), false);

	window.addEventListener("keyup", function (e) {
		this.keys[e.keyCode] = false;
	}.bind(this), false);
};