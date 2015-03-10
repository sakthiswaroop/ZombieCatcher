function Game() {
	this.hero = new Hero();

	this.reset();
	this.loadImages();
	this.createCanvas();
	this.createNewRound();
}

Game.prototype.start = function() {
	this.update();
	this.draw();
	requestAnimationFrame(this.start.bind(this));
};

Game.prototype.createCanvas = function() {
	this.wrapper = document.createElement("canvas");
	this.wrapper.width = WIDTH;
	this.wrapper.height = HEIGHT;
	document.body.appendChild(this.wrapper);

	this.canvas = this.wrapper.getContext("2d");
};

Game.prototype.loadImages = function() {
	this.images = {};

	// Background
	this.images.background = new Image();
	this.images.background.src = IMAGE_BACKGROUND;

	this.images.hero = new Image();
	this.images.hero.src = IMAGE_HERO;
	this.images.hero.onload = function() {
		this.hero.ready = true;
	}.bind(this);

	this.images.monster = new Image();
	this.images.monster.src =IMAGE_MONSTER;

	this.images.villain = new Image();
	this.images.villain.src = IMAGE_VILLAIN;

	this.images.dead = new Image();
	this.images.dead.src = IMAGE_DEAD;
};

Game.prototype.reset = function() {
	// Score keeping
	this.round = -1;
	this.totalKilled = 0;
	this.roundKilled = 0;

	// Game pieces
	this.villains = [];
	this.monsters = [];
	this.deadMonsters = [];

	this.hero.reset();
};

Game.prototype.update = function() {
	// Update Hero position
	this.hero.move();

	// Update Villain positions
	this.villains.forEach(function(villain) {
		villain.move();

		if (this.monsterCollision(villain)) {
			alert(TEXT_DEATH);
			this.reset();
		}
	}.bind(this));

	// Update Monster positions
	this.monsters.forEach(function(monster) {
		monster.move();

		// Check for killed monster
		if (this.monsterCollision(monster)) {
			this.killMonster(monster);
		}
	}.bind(this));

	// Check for round completion
	if (this.roundKilled === this.monsters.length) {
		this.totalKilled += this.roundKilled;
		this.roundKilled = 0;
		this.createNewRound();
	}
};

Game.prototype.draw = function() {
	// Clear canvas
	this.wrapper.width = this.wrapper.width;

	// Draw Game Canvas
	this.canvas.drawImage(this.images.background, 0, 0);

	// Draw Villains
	this.villains.forEach(function(villain) {
		this.keepInBounds(villain);
		this.canvas.drawImage(this.images.villain, villain.x, villain.y);
	}.bind(this));

	// Draw Monsters
	this.monsters.forEach(function(monster) {
		if (!monster.dead) {
			this.keepInBounds(monster);
			this.canvas.drawImage(this.images.monster, monster.x, monster.y);
		}
	}.bind(this));

	// Draw Dead Monsters
	this.deadMonsters.forEach(function(deadMonster) {
		this.canvas.drawImage(this.images.dead, deadMonster.x, deadMonster.y);
	}.bind(this));

	// Draw Hero
	if (this.hero.ready) {
		this.keepInBounds(this.hero);
		this.canvas.drawImage(this.images.hero, this.hero.x, this.hero.y);
	}

	this.canvas.fillStyle = "rgb(250, 250, 250)";
	this.canvas.font = "24px Helvetica";
	this.canvas.textAlign = "left";
	this.canvas.textBaseline = "top";
	this.canvas.fillText("Total Killed: " + this.deadMonsters.length, SPRITE_OFFSET, SPRITE_OFFSET);
};

Game.prototype.keepInBounds = function(sprite) {
	if (sprite.x < 0) sprite.x = 0;
	if (sprite.y < 0) sprite.y = 0;
	if (sprite.x > WIDTH - SPRITE_OFFSET) sprite.x = WIDTH - SPRITE_OFFSET;
	if (sprite.y > HEIGHT - SPRITE_OFFSET) sprite.y = HEIGHT - SPRITE_OFFSET;
}; // 480, 450

Game.prototype.createNewRound = function() {
	this.round++;

	// Add new monster every 3 rounds
	if (this.round % ADD_MONSTER_EVERY === 0) {
		this.monsters.push(new Monster());
	}

	// Add new villain every 5 rounds
	if (this.round % ADD_VILLAIN_EVERY === 0) {
		this.villains.push(new Monster());
	}

	// Reposition all of the monsters
	this.monsters.forEach(function(monster) {
		monster.resetPosition();
	});
};

Game.prototype.monsterCollision = function(monster) {
	return !monster.dead &&
			this.hero.x <= (monster.x + SPRITE_OFFSET) &&
			monster.x   <= (this.hero.x + SPRITE_OFFSET) &&
			this.hero.y <= (monster.y + SPRITE_OFFSET) &&
			monster.y   <= (this.hero.y + SPRITE_OFFSET);
};

Game.prototype.killMonster = function(monster) {
	var dead = {
		x: monster.x,
		y: monster.y
	};
	this.deadMonsters.push(dead);
	this.roundKilled++;
	monster.dead = true;
};
