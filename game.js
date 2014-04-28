// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Prepare Images
var game_image = new Image();
game_image.src = "background2.png";

var hero_image = new Image();
hero_image.src = "hero2.png";
hero_image.onload = function() {
	hero.ready = true;
};

var monster_image = new Image();
monster_image.src = "zombie.png";

var villain_image = new Image();
villain_image.src = "monster.png";

var dead_image = new Image();
dead_image.src = "dead.png";

var Game = function() {
	this.round = -1;
	this.totalKilled = 0;
	this.monstersCaught = 0;
	this.ready = false;
	this.villains = [];
	this.monsters = [];
	this.deadMonsters = []

	this.killMonster = function(monster) {
		var dead = {
			x: monster.x,
			y: monster.y
		}
		this.deadMonsters.push(dead);
	}

	this.reset = function() {
		this.round = 0;
		this.totalKilled = 0;
		this.monstersCaught = 0;
		this.monsters = this.monsters.slice(0,1);
		this.deadMonsters = [];
		keysDown = [];
		this.villains = this.villains.slice(0,1);
		hero.reset();
		hero.x = canvas.width / 2;
		hero.y = canvas.height / 2;
	}
}

var Hero = function(speed) {
	this.speed = speed;
	this.ready = false;
	this.x = 0;
	this.y = 0;

	this.reset = function() {
		this.speed += 30;
	}

	this.handleKeydown = function(modifier) {
		//Left
		if (37 in keysDown) {
			this.x -= this.speed * modifier;
		}
		//Up
		if (38 in keysDown) {
			this.y -= this.speed * modifier;
		}
		//Right
		if (39 in keysDown) {
			this.x += this.speed * modifier;
		}
		//Down
		if (40 in keysDown) {
			this.y += this.speed * modifier;
		}
	}
}

var Monster = function(speed) {
	this.ready = false;
	this.speed = speed;
	this.move = 25;
	this.dead = false;
	this.x = 0;
	this.y = 0;

	this.moveRight = false;
	this.moveDown = false;

	this.reset = function() {
		this.x = 32 + (Math.random() * (canvas.width - 64));
		this.y = 32 + (Math.random() * (canvas.height - 64));
		this.dead = false;
		this.speed += 30
	}

	this.moveMonster = function(modifier) {
		if (this.move == 0) {
			var x = Math.floor(Math.random() * 2);
			var y = Math.floor(Math.random() * 2);

			if (x) this.moveRight = true;
			else this.moveRight = false;

			if (y) this.moveDown = true;
			else this.moveDown = false;
			this.move = 25;
		}

		if (this.moveRight) this.x -= this.speed * modifier;
		else this.x += this.speed * modifier;

		if (this.moveDown) this.y -= this.speed * modifier;
		else this.y += this.speed * modifier;

		this.move--;
	}
}

var game = new Game();
var hero = new Hero(250);

var keysDown = {};

// Reset the game when the player catches a monster
var reset = function () {

	game.round++;
	console.log(game.round);

	if (game.round % 3 == 0) {
		var monster = new Monster(250);
		game.monsters.push(monster);
		for (var i = 0; i < game.monsters.length; i++) {
			game.monsters[i].speed = 250;
		}
		hero.speed = 250;
	}

	if (game.round % 5 == 0) {
		var villain = new Monster(250);
		game.villains.push(villain);
	}

	hero.reset();

	for (var i = 0; i < game.monsters.length; i++) {
		game.monsters[i].reset();
	}

};

// Update game objects
var update = function (modifier) {

	hero.handleKeydown(modifier);

	for (var i = 0; i < game.villains.length; i++) {
		game.villains[i].moveMonster(modifier);
	}

	for (var i = 0; i < game.monsters.length; i++) {
		game.monsters[i].moveMonster(modifier);
	}

	// Kill a monster?
	for (var i = 0; i < game.monsters.length; i++) {
		var monster = game.monsters[i];
		if (!monster.dead &&
			hero.x <= (monster.x + 32)
			&& monster.x <= (hero.x + 32)
			&& hero.y <= (monster.y + 32)
			&& monster.y <= (hero.y + 32)
		) {
			monster.dead = true;
			game.killMonster(monster);
			game.monstersCaught++;
		}
	}

	// Hero killed by Villain
	for (var i = 0; i < game.villains.length; i++) {
		var villain = game.villains[i];
		if (hero.x <= (villain.x + 32)
				&& villain.x <= (hero.x + 32)
				&& hero.y <= (villain.y + 32)
				&& villain.y <= (hero.y + 32)
			)
		{
			if (game.ready) {
				alert("You died...");
			} else {
				game.ready = true;
			}
			game.reset();
		}
	}

	if (game.monstersCaught === game.monsters.length) {
		game.totalKilled += game.monstersCaught;
		game.monstersCaught = 0;
		reset();
	}
};

var keepInBounds = function(player) {
	if (player.x < 0) player.x = 0;
	if (player.y < 0) player.y = 0;
	if (player.x > 480) player.x = 480;
	if (player.y > 450) player.y = 450;
}

// Draw everything
var render = function () {
	if (game.ready) {
		ctx.drawImage(game_image, 0, 0);
	}

	for (var i = 0; i < game.deadMonsters.length; i++) {
		var deadMonster = game.deadMonsters[i];
		ctx.drawImage(dead_image, deadMonster.x, deadMonster.y);
	}

	for (var i = 0; i < game.villains.length; i++) {
		var villain = game.villains[i];
		keepInBounds(villain);
		ctx.drawImage(villain_image, villain.x, villain.y);
	}

	if (hero.ready) {
		keepInBounds(hero);
		ctx.drawImage(hero_image, hero.x, hero.y);
	}

	for (var i = 0; i < game.monsters.length; i++) {
		var monster = game.monsters[i];
		if (!monster.dead) {
			keepInBounds(monster)
			ctx.drawImage(monster_image, monster.x, monster.y);
		}
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Total Killed: " + game.deadMonsters.length, 32, 32);
};

// The main game loop
var main = function () {
	update(.005);
	render();
};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

reset();
setInterval(main, 1);
