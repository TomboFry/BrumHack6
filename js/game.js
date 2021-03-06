HEIGHT = 320
WIDTH = 570
BLOCKSIZE = 64
TIME = 30
SCORE = 0
last_update = 0
timer = TIME
TileTypes = [
	" ", "Floor, grass_tiles_0",
	"Orange, Orange_tile_0", "Orange, Orange_tile_1", "Orange, Orange_tile_2",
	"Blue, Blue_tile_0",     "Blue, Blue_tile_1",     "Blue, Blue_tile_2",
	"Purple, Purple_tile_0", "Purple, Purple_tile_1", "Purple, Purple_tile_2"
]
sect1 = [[0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,2,3,4,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1]]

sect2 = [[0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,5,6,7,1],  [0,0,0,0,1], [0,0,0,0,1],[0,8,9,10,1],  [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [8,9,9,10,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1]]

sect3 = [[0,0,0,0,1], [0,0,0,0,1], [2,3,3,4,1], [2,3,3,4,1],  [2,3,3,4,1], [2,3,3,4,1],[0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [5,6,6,7,1], [5,6,6,7,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1], [8,9,9,10,1], [8,9,9,10,1], [0,0,0,0,1], [0,0,0,0,1], [0,0,0,0,1]]

sects = [sect1, sect2, sect3];

var assetsObj = {
	"images": [ "images/highscore_new.png", "images/clock.png" ],
	"sprites": {
		"images/spr_walk_orange.png": {
			tile: 64,
			tileh: 68,
			map: {
				Orange: [0, 0],
			}
		},
		"images/spr_walk_blue.png": {
			tile: 64,
			tileh: 68,
			map: {
				Blue: [0, 0],
			}
		},
		"images/spr_walk_purple.png": {
			tile: 64,
			tileh: 68,
			map: {
				Purple: [0, 0],
			}
		},
		"images/tileset_grass.png": {
			tile: 64, tileh: 64,
			map: {
				grass_tiles_0: [0, 0],
				grass_tiles_1: [1, 0],
				grass_tiles_2: [2, 0],
				grass_tiles_3: [3, 0],
				grass_tiles_4: [4, 0],
				grass_tiles_5: [5, 0],
				grass_tiles_6: [6, 0],
				grass_tiles_7: [7, 0],
				grass_tiles_8: [8, 0],
				grass_tiles_9: [9, 0],
				grass_tiles_10: [10, 0],
				grass_tiles_11: [11, 0],
				grass_tiles_12: [12, 0],
				Orange_tile_0: [0, 1],
				Orange_tile_1: [1, 1],
				Orange_tile_2: [2, 1],
				Blue_tile_0: [3, 1],
				Blue_tile_1: [4, 1],
				Blue_tile_2: [5, 1],
				Purple_tile_0: [6, 1],
				Purple_tile_1: [7, 1],
				Purple_tile_2: [8, 1]
			}
		},
		"images/title_strip26.png": {
			tile: 502, tileh: 162, map: { title_sprite: [0, 0] }
		}
	}
};

window.onload = function() {

	var viewFullScreen = document.getElementById("game");
	if (viewFullScreen) {
		viewFullScreen.addEventListener("click", function () {
			var docElm = document.documentElement;
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			}
			else if (docElm.msRequestFullscreen) {
				docElm.msRequestFullscreen();
			}
			else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			}
			else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
		});
	}

	Crafty.init(WIDTH, HEIGHT, document.getElementById('game'));
	Crafty.background('#3FA9F5');
	Crafty.load(assetsObj, function () {
		Crafty.enterScene("title");
	});
	resizeWindow();
};

// Will scale the canvas to the size of the window
// (based on height, you'll have a bad time if your aspect ratio is less 16:9)
window.onresize = resizeWindow;
function resizeWindow() {
	var canvas = document.getElementById('game');
	var scale = window.innerHeight / HEIGHT;
	console.log(scale);
	canvas.style.transformOrigin = "0 0";
	canvas.style.transform = "scale(" + scale + ")";
}

Crafty.defineScene("game", function() {

	SCORE = 0

    last_update = 0;
	Crafty.background("#3FA9F5 url(images/hillside.png) repeat-x");

	var walker = Crafty.e('2D, Canvas, Blue, SpriteAnimation, Collision, Gravity, Jumper, Motion')
        .collision()
        .bind('Moved', function(e) {
            var hitDatas, hitData;
            if ((hitDatas = this.hit('Solid'))) {
                hitData = hitDatas[0];
                 if (hitData.obj.has("Floor")) {
                    this.x -= hitData.overlap * hitData.normal.x;
                    this.y -= hitData.overlap * hitData.normal.y;
                } else if (!hitData.obj.has(walker.player_colour)) {
                    this.vx = 0;
                    this.animationSpeed = 0;
                    this.x -= hitData.overlap * hitData.normal.x;
                    this.y -= hitData.overlap * hitData.normal.y;
                }
            }
        })
        .jumper(400, ['UP_ARROW'])
        .gravity('Floor')
        .reel("walking", 500, [
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]
		])
		.animate("walking", -1)
		.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.Z || e.key == Crafty.keys.X || e.key == Crafty.keys.C) {
				walker.removeComponent("Orange");
				walker.removeComponent("Purple");
				walker.removeComponent("Blue");
			}

			if (e.key == Crafty.keys.Z) {
				walker.addComponent("Blue");
				walker.player_colour = "Blue";
			} else if (e.key == Crafty.keys.X) {
				walker.addComponent("Orange");
				walker.player_colour = "Orange";
			} else if (e.key == Crafty.keys.C) {
				walker.addComponent("Purple");
				walker.player_colour = "Purple";
			}
		}).bind("EnterFrame", function(evt) {
			this.animationSpeed = this.vx / 200;
			Crafty.stage.elem.style.backgroundPosition = (Crafty.viewport._x / 10) + "px -40px";
            if (this.x > last_update + WIDTH) {
                new_loc = last_update + WIDTH * 2;
                createSection(last_update + WIDTH * 2, 0, sects[Math.floor(Math.random()*sects.length)])
                last_update = new_loc
                console.log(timer)
            }
		});

	walker.player_colour = "Blue";
    walker.vx = 50;
    walker.ax = 30;

    createSection(0, 0, sect1);

    Crafty.e("2D, DOM, Image")
    	.attr({ x: 64, y: 16, w: 64, h:64 })
    	.image("images/clock.png")
    	.bind("EnterFrame", function() {
    		this.x = -Crafty.viewport._x + 64;
    	});

    Crafty.e("2D, DOM, Text")
		.attr({ x: 80, y: 16})
		.text(function () { return timer.toFixed(1) })
		.textColor("#FFF")
		.textAlign("left")
		.textFont({ size: '20px', weight: 'bold', family: "Montserrat" })
		.bind("EnterFrame", function() {
    		this.x = -Crafty.viewport._x + 92;
    	})
		.dynamicTextGeneration(true);

	var scoreText = Crafty.e("2D, DOM, Text")
		.attr({ x: WIDTH - 16, y: 16})
		.text(function () { return Math.round(walker.x) })
		.textColor("#FFF")
		.textFont({ size: '36px', weight: '900', family: "Montserrat" })
		.css({ "text-align": "right" })
		.bind("EnterFrame", function() {
    		this.x = -Crafty.viewport._x + WIDTH - 128;
    	})
		.dynamicTextGeneration(true);

    Crafty.viewport.bounds = {min:{x:0, y:0}, max:{x:+Infinity, y:HEIGHT}};
    Crafty.viewport.scale(1);
    Crafty.viewport.follow(walker, -100, 0);

    tick = setInterval(function(){
        if(timer > 0.1) {
            timer -= 0.1;
        } else {
            timer = TIME;
            clearInterval(tick);
            SCORE = walker.x;
            Crafty.enterScene("gameend");
        }
	}, 100);
});

function createWall(colour, x, y) {
	for (var i = 0; i < 3; i++) {
		Crafty.e("2D, Canvas, Solid, Collision, " + colour + ", " + colour + "_tile_" + i)
			.attr({ x: x, y: y - 192 + (i * 64), w: 64, h: 64 })
			.collision();
	}
}

function createSection(x, y, arr) {
    for (var i = 0; i < 2 * (WIDTH + 6) / BLOCKSIZE; i++) {
        for (var j = 0; j < HEIGHT / BLOCKSIZE; j++) {
            type = TileTypes[arr[i][j]]
            if (type !== " ") {
                console.log(type)
                Crafty.e("2D, Canvas, Solid, Collision, " + type)
                    .attr({x: i * BLOCKSIZE + x, y: j * BLOCKSIZE + y, w: BLOCKSIZE, h: BLOCKSIZE})
                    .collision();
            }
        }
    }
}
