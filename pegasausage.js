// config

var diffs = [

	normal = {
		name: "Normal",
		generationRate: 60,
		playerSpeed: 0.04,
		cloudSpeed: 0.1,
		hp: 3,
		cloudAmount: 20
	},

	hard = {
		name: "Hard",
		generationRate: 30,
		playerSpeed: 0.04,
		cloudSpeed: 0.2,
		hp: 3,
		cloudAmount: 40
	},

	insane = {
		name: "Insane",
		generationRate: 15,
		playerSpeed: 0.08,
		cloudSpeed: 0.4,
		hp: 2,
		cloudAmount: 80
	},
	
	twf = {
		name: "Together We've Fallen",
		generationRate: 7,
		playerSpeed: 0.08,
		cloudSpeed: 0.8,
		hp: 2,
		cloudAmount: 100
	}

]

var diffNum = 0;
var difficulty = diffs[diffNum];

var generationRate = difficulty.generationRate; // in fps
var shakeLength = 15; // in frames
var playerSpeed = difficulty.playerSpeed;
var movementRange = 5;
var cloudSpeed = difficulty.cloudSpeed;
var hp = difficulty.hp;
var cloudAmount = difficulty.cloudAmount;

var gameState = 2;

var audio = document.getElementById('audio');
var hit = document.getElementById('hit');
			
// random int in range - [min, max]
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random arbitrary [min, max)
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

// Listen for keys
var pressedKeys = {};
var setState = function (e, state) {
    pressedKeys[String.fromCharCode(e.keyCode)] = state;
    pressedKeys[e.keyCode] = state;
};

document.addEventListener('keydown', function (e) { setState(e, true); }, false);
document.addEventListener('keyup', function (e) { setState(e, false); }, false);
window.addEventListener("blur", function () { pressedKeys = {}; });

input = {
    isDown: function (key) {
        return pressedKeys[key.toUpperCase()] || false;
    }
};

// init background scene
var bgImg = new THREE.TextureLoader().load('bg.png');
var bg = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2, 0),
	new THREE.MeshBasicMaterial({ map: bgImg })
	);
bg.material.depthTest = false;
bg.material.depthWrite = false;
var bgScene = new THREE.Scene();
var bgCam = new THREE.Camera();
bgScene.add(bgCam);
bgScene.add(bg);

// init game scene
var scene = new THREE.Scene();
var playerGeometry = new THREE.PlaneGeometry(1, 1);
var Player = new THREE.Mesh(playerGeometry);
Player.position.set(0, 0, 0);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000)
Player.add(camera);
scene.add(Player);

var charImg = new THREE.TextureLoader().load('char.png');
var char = new THREE.Mesh(
	new THREE.PlaneGeometry(0.5, 0.5, 0),
	new THREE.MeshBasicMaterial({map: charImg})
);
char.material.transparent = true;
Player.add(char);
char.position.set(0, -0.15, -0.8);
char.visible = false;
var poo = new THREE.Vector3(camera.position.x, camera.position.y + 1, camera.position.z);
char.lookAt(poo);

// init branding
var tpLogoImg = new THREE.TextureLoader().load('tp.png');
var psLogoImg = new THREE.TextureLoader().load('title.png');

var tpLogo = new THREE.Mesh(
	new THREE.PlaneGeometry(12, 1),
	new THREE.MeshBasicMaterial({ map: tpLogoImg })
);

var psLogo = new THREE.Mesh(
	new THREE.PlaneGeometry(12, 2),
	new THREE.MeshBasicMaterial({ map: psLogoImg })
);

Player.add(tpLogo);
Player.add(psLogo);
tpLogo.material.transparent = true;
psLogo.material.transparent = true;
tpLogo.position.set(0, -5, -10);
psLogo.position.set(0, 4, -10);

var pvfmText = document.createElement('div');
pvfmText.style.position = 'absolute';
pvfmText.innerHTML = "Game created by Techniponi<br/>Music from <a href='http://ponyvillefm.com'>Ponyville FM</a>";
pvfmText.style.top = window.innerHeight - 50 +'px';
pvfmText.style.left = 20+'px';
document.body.appendChild(pvfmText);

var text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.textAlign = "center";
text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance * cloudSpeed);
text2.style.top = 20 + 'px';
text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';
document.body.appendChild(text2);

// init base objects
var meshes = [];
var cloudTexture = new THREE.TextureLoader().load('sprite.png');

// create a new iteration of clouds
function generateSprites() {

	for (i = 0; i < cloudAmount; i++) {
		var material = new THREE.MeshBasicMaterial({ map: cloudTexture });
		material.transparent = true;
		var planeGeometry = new THREE.PlaneGeometry(1, 1);
		var mesh = new THREE.Mesh(planeGeometry, material);
		mesh.position.set(getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(-35, -40));

		meshes.push(mesh);

		scene.add(mesh);
	}
}

// first iteration of clouds
generateSprites();

// init renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// runtime variables
var generationStep = 0;
var collisionNumber = 0;
var shakeStep = 0;
var shaking = false;
var distance = 0;

var keyDown = false;
var pkeyDown = false;

function resetGame() {
	generationStep = 0;
	collisionNumber = 0;
	shakeStep = 0;
	shaking = false;
	framesPassed = 0;
	distance = 0;
	hp = difficulty.hp;
	text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance * cloudSpeed);
	text2.style.top = 20 + 'px';
	text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';
	gameState = 1;
	generationRate = difficulty.generationRate; // in fps
	shakeLength = 15; // in frames
	playerSpeed = difficulty.playerSpeed;
	movementRange = 5;
	cloudSpeed = difficulty.cloudSpeed;
	cloudAmount = difficulty.cloudAmount;
	tpLogo.visible = false;
	psLogo.visible = false;
	char.visible = true;
	camera.position.set(0,0,0);
	char.position.set(0, -0.2, -0.8);
	char.lookAt(poo);
}			

var framesPassed = 0;

// runs every frame
function render() {
	requestAnimationFrame(render);

	framesPassed ++;

	if (input.isDown("P")) {
		pkeyDown = true;
	}

	if (!input.isDown("P") && pkeyDown == true) {
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}

		pkeyDown = false;
	}
	
	if((framesPassed / 900) % 1 == 0 ){
		cloudAmount *= 1.5;
		cloudSpeed *= 1.5;
		generationRate = Math.floor(generationRate * 0.75);
		if(generationStep >= generationRate){
			generationStep = 0;
		}
	}

	tpLogo.lookAt(Player.position);
	char.position.set(0, -0.2, -0.8);

	renderer.autoClear = false;
	renderer.clear();
	renderer.render(bgScene, bgCam);

	for (var o = meshes.length - 1; o >= 0; o--) {
		if (meshes[o].position.z > 0) {
			scene.remove(o);
			meshes.splice(o, 1);
		}
	}

	if (hp <= 0) {
		gameState = 0;
	}

	if (gameState == 1) {

		distance++;

		// movement
		if (input.isDown("W") && Player.position.y <= movementRange) {
			Player.position.y += playerSpeed;
		}

		if (input.isDown("A") && Player.position.x >= movementRange * -1) {
			Player.position.x -= playerSpeed;
		}

		if (input.isDown("S") && Player.position.y >= movementRange * -1) {
			Player.position.y -= playerSpeed;
		}

		if (input.isDown("D") && Player.position.x <= movementRange) {
			Player.position.x += playerSpeed;
		}

		// triggers cloud iteration every generationRate frames
		generationStep++;
		if (generationStep == generationRate) {
			generateSprites();
			generationStep = 0;
		}

		meshes.forEach(function (x) {
			if (x != null && meshes[meshes.indexOf(x)] != null) {
				x.position.z += cloudSpeed;

				if (x.position.distanceTo(Player.position) < 0.5) {
					scene.remove(x);
					meshes.splice(meshes.indexOf(x), 1);
					collisionNumber++;
					console.log(collisionNumber);
					hp--;
					shaking = true;
					hit.currentTime = 0;
					hit.play();
				}
			}
		});

		if (shaking == true) {
			shakeStep++;
			if (shakeStep >= shakeLength) {
				camera.position.x = 0;
				camera.position.y = 0;
				camera.position.z = 0;
				shaking = false;
				shakeStep = 0;
				char.position.set(0, -0.2, -0.8);
			} else {
				camera.position.x = getRandomArbitrary(0, 0.5);
				camera.position.y = getRandomArbitrary(0, 0.5);
				camera.position.z = getRandomArbitrary(0, 0.5);
			}
		}

		text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance * cloudSpeed);

	} else if (gameState == 0) {
		// Reset game to nothing

		char.visible = false;
		psLogo.visible = true;

		for (var o = meshes.length - 1; o >= 0; o--) {
			scene.remove(meshes[o]);
			meshes.splice(o, 1);
		}

		Player.position.x = 0;
		Player.position.y = 0;
		Player.position.z = 0;

		text2.innerHTML = "GAME OVER<br/>Distance: " + Math.floor(distance * cloudSpeed) + "<br/><br/>Press R to restart!<br/><br/>Difficulty: " + difficulty.name + "<br/>Press T to cycle difficulty.";

		text2.style.top = (window.innerHeight / 2) - text2.offsetHeight / 2 + 'px';
		text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';

		if (input.isDown("T")) {
			keyDown = true;
		}

		if (!input.isDown("T") && keyDown == true) {
			diffNum++;
			if (diffs[diffNum] != undefined && diffs[diffNum] != null) {
				difficulty = diffs[diffNum];
			} else {
				diffNum = 0;
				difficulty = diffs[diffNum];
			}

			keyDown = false;
		}

		// restart
		if (input.isDown("R")) {
			resetGame();
		}
	} else {
		text2.innerHTML = "Press R to start!<br/><br/>Difficulty: " + difficulty.name + "<br/>Press T to cycle difficulty.<br/><br/><br/><br/<br/>Press P to toggle music.";

		text2.style.top = (window.innerHeight / 2) - text2.offsetHeight / 2 + 'px';
		text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';

		if (input.isDown("R")) {
			resetGame();
		}

		if (input.isDown("T")) {
			keyDown = true;
		}

		if (!input.isDown("T") && keyDown == true) {
			diffNum++;
			if (diffs[diffNum] != undefined && diffs[diffNum] != null) {
				difficulty = diffs[diffNum];
			} else {
				diffNum = 0;
				difficulty = diffs[diffNum];
			}

			keyDown = false;
		}
	}

	renderer.render(scene, camera);
}

render();