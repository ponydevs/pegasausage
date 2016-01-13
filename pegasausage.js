// config

var diffs = [

	{
		name: "Normal",
		generationRate: 60,
		playerSpeed: 0.04,
		cloudSpeed: 0.1,
		hp: 3,
		cloudAmount: 20
	},

	{
		name: "Hard",
		generationRate: 30,
		playerSpeed: 0.04,
		cloudSpeed: 0.2,
		hp: 3,
		cloudAmount: 40
	},

	{
		name: "Insane",
		generationRate: 15,
		playerSpeed: 0.08,
		cloudSpeed: 0.4,
		hp: 2,
		cloudAmount: 80
	},

	{
		name: "Apocalypse",
		generationRate: 7,
		playerSpeed: 0.08,
		cloudSpeed: 0.8,
		hp: 2,
		cloudAmount: 100
	},

	twf = {
		name: "Together We've Fallen",
		generationRate: 1,
		playerSpeed: 0.12,
		cloudSpeed: 5.6,
		hp: 1,
		cloudAmount: 700
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
audio.play();
var hit = document.getElementById('hit');
var eat = document.getElementById('eat');

document.body.addEventListener('touchmove', function (event) {
	event.preventDefault();
}, false);

window.mobileAndTabletcheck = function () {
	var check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

var textSize;

if (window.mobileAndTabletcheck()) {
	textSize = 8;
}
			
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
	new THREE.MeshBasicMaterial({ map: charImg })
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
pvfmText.innerHTML = "Game created by Techniponi<br/>Music from <a href='https://www.youtube.com/watch?v=8VzUh7rAm0A'>Aftermath</a>";
pvfmText.style.top = window.innerHeight - 50 + 'px';
pvfmText.style.left = 20 + 'px';
if (textSize != undefined) {
	pvfmText.style.fontSize = textSize + 'pt';
}
document.body.appendChild(pvfmText);

var text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.textAlign = "center";
text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance);
text2.style.top = 20 + 'px';
text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';
if (textSize != undefined) {
	text2.style.fontSize = textSize + 'pt';
}
document.body.appendChild(text2);

// init base objects
var meshes = [];
var sausageMeshes = [];
var cloudTexture = new THREE.TextureLoader().load('sprite.png');
var cloudplaneGeometry = new THREE.PlaneGeometry(1, 1);

// create a new iteration of clouds
function generateSprites() {

	for (i = 0; i < cloudAmount; i++) {
		var cloudMaterial = new THREE.MeshBasicMaterial({ map: cloudTexture });
		cloudMaterial.transparent = true;
		var mesh = new THREE.Mesh(cloudplaneGeometry, cloudMaterial);
		mesh.position.set(Player.position.x + getRandomArbitrary(-7.5, 7.5), Player.position.y + getRandomArbitrary(-7.5, 7.5), getRandomArbitrary(-20, -25));
		mesh.material.opacity = 0.0;

		meshes.push(mesh);

		scene.add(mesh);
	}

	if (hp < difficulty.hp) {
		if (getRandomInt(0, 30) == 13) {
			var sausageTexture = new THREE.TextureLoader().load('sausage.png');
			var sausageMaterial = new THREE.MeshBasicMaterial({ map: sausageTexture, transparent: true });
			var sausageMesh = new THREE.Mesh(cloudplaneGeometry, sausageMaterial);
			sausageMesh.position.set(Player.position.x + getRandomArbitrary(-2, 2), Player.position.y + getRandomArbitrary(-2, 2), getRandomArbitrary(-20, -25));
			sausageMesh.material.opacity = 0.0;

			sausageMeshes.push(sausageMesh);
			scene.add(sausageMesh);
		}
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
	text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance);
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
	camera.position.set(0, 0, 0);
	char.position.set(0, -0.2, -0.8);
	char.lookAt(poo);
}

var framesPassed = 0;
var charPos = new THREE.Vector3(0, -0.2, -0.8);

// runs every frame
function render() {
	requestAnimationFrame(render);

	framesPassed++;

	if (framesPassed >= 120 && framesPassed < 360) {
		char.position.z += 0.01;
		char.position.y -= 0.02;
	}

	if (framesPassed >= 360) {
		char.visible = false;
		char.position = charPos;
	}

	if (audio.ended) {
		audio.currentTime = 0;
		audio.play();
	}

	tpLogo.lookAt(Player.position);
	char.position = charPos;

	renderer.autoClear = false;
	renderer.clear();
	renderer.render(bgScene, bgCam);

	for (var o = meshes.length - 1; o >= 0; o--) {
		if (meshes[o].position.z > 0) {
			scene.remove(meshes[o]);
			meshes.splice(o, 1);
		}
	}

	for (var o = sausageMeshes.length - 1; o >= 0; o--) {
		if (sausageMeshes[o].position.z > 0) {
			scene.remove(sausageMeshes[o]);
			sausageMeshes.splice(o, 1);
		}
	}

	if (hp <= 0) {
		gameState = 0;
	}

	if (gameState == 1) {

		distance++;

		if ((framesPassed / 900) % 1 == 0) {
			cloudAmount *= 1.25;
			cloudSpeed *= 1.25;
			playerSpeed *= 1.1;
			generationRate = Math.floor(generationRate * 0.9);
			if (generationStep >= generationRate) {
				generationStep = 0;
			}
		}

		// movement
		/*if (input.isDown("W") && Player.position.y <= movementRange) {
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
		}*/

		if (input.isDown("W")) {
			Player.position.y += playerSpeed;
		}

		if (input.isDown("A")) {
			Player.position.x -= playerSpeed;
		}

		if (input.isDown("S")) {
			Player.position.y -= playerSpeed;
		}

		if (input.isDown("D")) {
			Player.position.x += playerSpeed;
		}

		// triggers cloud iteration every generationRate frames
		generationStep++;
		if (generationStep == generationRate) {
			generateSprites();
			generationStep = 0;
		}

		sausageMeshes.forEach(function (s) {
			if (s != null && sausageMeshes[sausageMeshes.indexOf(s)] != null) {
				s.position.z += cloudSpeed;
				if (s.material.opacity < 1.0) {
					s.material.opacity += 0.05;
				}

				if (s.position.distanceTo(Player.position) < 0.5) {
					eat.currentTime = 0;
					eat.play();
					hp++;
					sausageMeshes.splice(sausageMeshes.indexOf(s), 1);
					scene.remove(s);
					s.material.dispose();
					s.geometry.dispose();
				}
			}
		});

		meshes.forEach(function (x) {
			if (x != null && meshes[meshes.indexOf(x)] != null) {
				x.position.z += cloudSpeed;
				if (x.material.opacity < 1.0) {
					x.material.opacity += 0.05;
				}

				if (x.position.distanceTo(Player.position) < 0.5) {
					collisionNumber++;
					console.log(collisionNumber);
					hp--;
					shaking = true;
					hit.currentTime = 0;
					hit.play();
					meshes.splice(meshes.indexOf(x), 1);
					scene.remove(x);
					x.material.dispose();
					x.geometry.dispose();
					cloudTexture.dispose();
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
				char.position = charPos;
			} else {
				camera.position.x = getRandomArbitrary(0, 0.5);
				camera.position.y = getRandomArbitrary(0, 0.5);
				camera.position.z = getRandomArbitrary(0, 0.5);
			}
		}

		text2.innerHTML = "HP: " + hp + "<br/>Distance: " + Math.floor(distance);

	} else if (gameState == 0) {
		// Reset game to nothing

		char.visible = false;
		psLogo.visible = true;

		for (var o = meshes.length - 1; o >= 0; o--) {
			scene.remove(meshes[o]);
			meshes.splice(o, 1);
		}

		for (var s = sausageMeshes.length - 1; s >= 0; s--) {
			scene.remove(sausageMeshes[s]);
			sausageMeshes.splice(s, 1);
		}

		Player.position.x = 0;
		Player.position.y = 0;
		Player.position.z = 0;

		text2.innerHTML = "GAME OVER<br/>Distance: " + Math.floor(distance) + "<br/><br/>Press R to restart!<br/><br/>Difficulty: " + difficulty.name + "<br/>Press T to cycle difficulty.";

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
		text2.innerHTML = "Press R to start!<br/><br/>Difficulty: " + difficulty.name + "<br/>Press T to cycle difficulty.";

		text2.style.top = (window.innerHeight / 2) - text2.offsetHeight / 2 + 'px';
		text2.style.left = (window.innerWidth / 2) - text2.offsetWidth / 2 + 'px';

		if (input.isDown("R")) {
			resetGame();
			drawing = false;
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