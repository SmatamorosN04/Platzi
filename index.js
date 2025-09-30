// --------------------- DOM SECTIONS ---------------------
const sectionSelectAttack = document.getElementById('select-attack')
const sectionRestart = document.getElementById('restart')
const buttonPlayerPet = document.getElementById('btn-pets')
const sectionSelectPet = document.getElementById('select-pet')
const spanPet = document.getElementById('pet-player')
const buttonRestart = document.getElementById('btn-restart')
const spanEnemyPet = document.getElementById('pet-enemy')
const spanPlayerLives = document.getElementById('lives-player')
const spanEnemyLives = document.getElementById('lives-enemy')
const sectionMessages = document.getElementById('result')
const playerAttacks = document.getElementById('player-attacks')
const enemyAttacks = document.getElementById('enemy-attacks')
const containerCards = document.getElementById('cards-container')
const containerAttacks = document.getElementById('attacks-container') // <-- FIX: ensure this exists
const sectionViewMap = document.getElementById('view-map')
const map = document.getElementById('map')


// --------------------- VARIABLES ---------------------
let pets = []
let enemyPetAttacks = []
let activeEnemies = []
let enemyAttack = []
let inputTrex
let inputTriceratops
let inputSpinosaurus
let playerPet
let playerPetObject
let attacksPet
let enemyPetAttack
let buttons = []
let playerAttack = []
let playerWins = 0
let enemyWins = 0
let canvasContext = map.getContext("2d")
let interval
let mapBackground = new Image()
mapBackground.src = './imagen/mokemap.png'
let desiredHeight
let playerIcon = new Image();
playerIcon.src = './imagen/icono.png';
let mapWidth = window.innerWidth - 20
const maxMapWidth = 350

if (mapWidth > maxMapWidth) {
    mapWidth = maxMapWidth - 20
}
desiredHeight = mapWidth * 600 / 800
map.width = mapWidth
map.height = desiredHeight

// --------------------- CLASS PET ---------------------
class Pet {
    constructor(name, photo, life, mapPhoto) {
        this.name = name
        this.photo = photo
        this.life = life
        this.attack = []
        this.width = 80
        this.height = 80
        this.x = random(0, map.width - this.width)
        this.y = random(0, map.height - this.height)
        this.mapPhoto = new Image()
        this.mapPhoto.src = mapPhoto || photo
        this.speedX = 0
        this.speedY = 0
    }
    drawPet() {
        if (this.mapPhoto && this.mapPhoto.complete && this.mapPhoto.naturalWidth !== 0) {
            canvasContext.drawImage(this.mapPhoto, this.x, this.y, this.width, this.height)
        }
    }
}

const types = {
    Fisico: { strongAgainst: ['Agil'], weakAgainst: ['Mente'] },
    Agil: { strongAgainst: ['Mente'], weakAgainst: ['Fisico'] },
    Mente: { strongAgainst: ['Fisico'], weakAgainst: ['Agil'] },
    Agua: { strongAgainst: ['Fisico'], weakAgainst: ['Agil'] },
    Defensivo: { strongAgainst: [], weakAgainst: ['Fisico', 'Agil'] }
}
const typeColors = {
    Fisico: '#e74c3c',
    Agil: '#27ae60',
    Mente: '#8e44ad',
    Agua: '#3498db',
    Defensivo: '#95a5a6'
}

// --------------------- PETS ---------------------
// Player
let trex = new Pet('T-Rex', './imagen/trex.png', 5)
let triceratops = new Pet('Triceratops', './imagen/pngwing.com.png', 5)
let spinosaurus = new Pet('Spinosaurus', './imagen/espino.png', 5)

// Enemy
let trexEnemy = new Pet('T-Rex', './imagen/trex.png', 5)
let triceratopsEnemy = new Pet('Triceratops', './imagen/pngwing.com.png', 5)
let spinosaurusEnemy = new Pet('Spinosaurus', './imagen/espino.png', 5)

// Attacks
trex.attack.push(
    { name: 'Mordisco Salvaje', id: 'button-bite', type: 'Fisico' },
    { name: 'Mordisco Salvaje', id: 'button-bite', type: 'Fisico' },
    { name: 'Pisotón Brutal', id: 'button-stomp', type: 'Fisico' },
    { name: 'Rugido Intimidante', id: 'button-roar', type: 'Mente' },
    { name: 'Carga Destructiva', id: 'button-charge', type: 'Agil' }
)
trexEnemy.attack = [...trex.attack]

triceratops.attack.push(
    { name: 'Embiste con Cuernos', id: 'button-horns', type: 'Fisico' },
    { name: 'Defensa Rocosa', id: 'button-defense', type: 'Defensivo' },
    { name: 'Pisotón', id: 'button-stomp', type: 'Fisico' },
    { name: 'Carga Pesada', id: 'button-charge', type: 'Agil' },
    { name: 'Mordisco', id: 'button-bite', type: 'Fisico' }
)
triceratopsEnemy.attack = [...triceratops.attack]

spinosaurus.attack.push(
    { name: 'Zarpazo Cortante', id: 'button-claw', type: 'Agil' },
    { name: 'Golpe de Cola', id: 'button-tail', type: 'Fisico' },
    { name: 'Mordida Acuática', id: 'button-bite-water', type: 'Agua' },
    { name: 'Emboscada Rápida', id: 'button-ambush', type: 'Agil' },
    { name: 'Chapoteo Violento', id: 'button-water', type: 'Agua' }
)
spinosaurusEnemy.attack = [...spinosaurus.attack]

pets.push(trex, triceratops, spinosaurus)

// --------------------- FUNCTIONS ---------------------
function getPetObject(name) {
    return pets.find(m => m.name === name);
}

function showStartScreen() {
    const startScreen = document.createElement('div')
    startScreen.id = 'start-screen'
    startScreen.classList.add('start-screen')

    startScreen.innerHTML = `
        <h1 class="start-title">¡Bienvenido a DinoWar!</h1>
        <button id="button-start" class="button-start">Jugar</button>
    `
    document.body.appendChild(startScreen)

    document.getElementById('button-start').onclick = () => {
        startScreen.remove()
        sectionSelectPet.style.display = 'flex'
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Enemy random attack
function enemyRandomAttack() {
    if (!enemyPetAttack || enemyPetAttack.length === 0) return null;
    const index = random(0, enemyPetAttack.length - 1);
    return enemyPetAttack[index];
}

function startGame() {
    // hide other sections
    if (sectionSelectAttack) sectionSelectAttack.style.display = 'none';
    if (sectionViewMap) sectionViewMap.style.display = 'none';

    // Create pet radio options
    pets.forEach(pet => {
        const petOption = `
            <input type="radio" name="pet" id="${pet.name}" value="${pet.name}"/>
            <label class="card-pet" for="${pet.name}">
                <p>${pet.name}</p>
                <img src="${pet.photo}" alt="${pet.name}">
            </label>
        `;
        containerCards.innerHTML += petOption;
    });

    // Now attach the event handler to the button (only if it exists)
    if (buttonPlayerPet) {
        buttonPlayerPet.addEventListener('click', selectPet);
    } else {
        console.warn('buttonPlayerPet not found (id="btn-pets")');
    }

    // attach restart if exists
    if (buttonRestart) {
        buttonRestart.addEventListener('click', restartGame);
    }
}

function selectEnemyPet() {
    const index = random(0, pets.length - 1);
    const enemy = pets[index];

    spanEnemyPet.innerHTML = enemy.name;
    enemyPetAttack = enemy.attack;
}

function selectPet() {
    // get selected radio dynamically
    const selectedRadio = document.querySelector('input[name="pet"]:checked');

    if (!selectedRadio) {
        alert("Selecciona tu dinosaurio");
        return;
    }

    playerPet = selectedRadio.value; // val (same as id above)
    spanPet.innerHTML = playerPet;

    // hide pet selection and show map
    if (sectionSelectPet) sectionSelectPet.style.display = 'none';
    if (sectionViewMap) sectionViewMap.style.display = 'flex';

    // initialize player object and enemy, attacks and map
    playerPetObject = getPetObject(playerPet);
    selectEnemyPet();
    extractAttacks(playerPet);
    initMap();
}

function playTurn(playerAttackObj, enemyAttackObj) {
    const newPlayerAttack = document.createElement('p');
    const newEnemyAttack = document.createElement('p');

    newPlayerAttack.textContent = playerAttackObj.name;
    newEnemyAttack.textContent = enemyAttackObj.name;

    playerAttacks.appendChild(newPlayerAttack);
    enemyAttacks.appendChild(newEnemyAttack);

    const turnResult = calculateResult(playerAttackObj, enemyAttackObj);
    sectionMessages.innerHTML = `Turno ${playerAttack.length}: ${turnResult.result} (${turnResult.detail})`;

    if (turnResult.result === 'GANASTE') playerWins++;
    else if (turnResult.result === 'PERDISTE') enemyWins++;

    spanPlayerLives.innerHTML = playerWins;
    spanEnemyLives.innerHTML = enemyWins;
}

function calculateResult(playerAttack, enemyAttack) {
    const playerType = playerAttack.type;
    const enemyType = enemyAttack.type;

    if (playerType === enemyType)
        return { result: 'EMPATE', detail: `${playerType} vs ${enemyType}` };
    if (types[playerType]?.strongAgainst.includes(enemyType))
        return { result: 'GANASTE', detail: `${playerType} es fuerte contra ${enemyType}` };
    if (types[playerType]?.weakAgainst.includes(enemyType))
        return { result: 'PERDISTE', detail: `${playerType} es débil contra ${enemyType}` };

    return { result: 'EMPATE', detail: `${playerType} y ${enemyType} no tienen ventaja` };
}

function endBattle() {
    let finalMessage = '';

    if (playerWins > enemyWins) {
        finalMessage = ' ¡Felicidades! Ganaste el combate';
    } else if (playerWins < enemyWins) {
        finalMessage = ' Lo siento, perdiste el combate';
    } else {
        finalMessage = ' El combate terminó en empate';
    }

    document.getElementById("result").innerText = "¡Combate terminado!";
    document.getElementById("restart").style.display = "block";
}

function restartGame() {
    location.reload();
}

function extractAttacks(petName) {
    const pet = pets.find(m => m.name === petName);
    if (!pet || !pet.attack) {
        console.warn('No attacks found for', petName);
        containerAttacks.innerHTML = '';
        return;
    }
    showAttacks(pet.attack);
}

function showAttacks(attacks) {
    containerAttacks.innerHTML = '';
    buttons = [];

    attacks.forEach((attack) => {
        const backgroundColor = typeColors[attack.type] || '#ccc';

        const attackButton = document.createElement('button');
        attackButton.className = 'attack-button';
        attackButton.style.borderColor = backgroundColor;
        attackButton.style.background = backgroundColor + '22';
        attackButton.innerHTML = `
            <div class="attack-name">${attack.name}</div>
            <div class="attack-type" style="color:${backgroundColor}">Tipo: ${attack.type}</div>
        `;

        attackButton.addEventListener('click', () => {
            playerAttack.push(attack);
            attackButton.disabled = true;
            attackButton.style.background = '#112f58';

            const enemyAttackTurn = enemyRandomAttack();
            if (enemyAttackTurn) enemyAttack.push(enemyAttackTurn);

            if (enemyAttackTurn) playTurn(attack, enemyAttackTurn);

            if (playerAttack.length === 5) setTimeout(endBattle, 500);
        });

        containerAttacks.appendChild(attackButton);
        buttons.push(attackButton);
    });
}

function initMap() {
    if (!playerPetObject.x) playerPetObject.x = map.width / 2;
    if (!playerPetObject.y) playerPetObject.y = map.height / 2;

    playerPetObject.icon = new Image();
    playerPetObject.icon.src = './imagen/icono.png';
    playerPetObject.iconWidth = 40;
    playerPetObject.iconHeight = 40;

    activeEnemies = [trexEnemy, triceratopsEnemy, spinosaurusEnemy];

    activeEnemies.forEach(enemy => {
        let attempts = 0;
        let maxAttempts = 100;
        let valid = false;

        while (!valid && attempts < maxAttempts) {
            enemy.x = random(0, map.width - enemy.width);
            enemy.y = random(0, map.height - enemy.height);

            const distancePlayer = Math.hypot(
                enemy.x - playerPetObject.x,
                enemy.y - playerPetObject.y
            );

            const distanceEnemies = activeEnemies
                .filter(e => e !== enemy)
                .map(e => Math.hypot(enemy.x - e.x, enemy.y - e.y));

            if (distancePlayer > 150 && distanceEnemies.every(d => d > 120)) {
                valid = true;
            }
            attempts++;
        }
    });

    interval = setInterval(drawCanvas, 50);
    window.addEventListener('keydown', keyPressed);
    window.addEventListener('keyup', stopMovement);
}

function drawCanvas() {
    playerPetObject.x += playerPetObject.speedX;
    playerPetObject.y += playerPetObject.speedY;

    if (playerPetObject.x < 0) playerPetObject.x = 0;
    if (playerPetObject.y < 0) playerPetObject.y = 0;
    if (playerPetObject.x + playerPetObject.width > map.width)
        playerPetObject.x = map.width - playerPetObject.width;
    if (playerPetObject.y + playerPetObject.height > map.height)
        playerPetObject.y = map.height - playerPetObject.height;

    canvasContext.clearRect(0, 0, map.width, map.height);
    canvasContext.drawImage(mapBackground, 0, 0, map.width, map.height);

    if (playerPetObject.icon && playerPetObject.icon.complete) {
        const iconWidth = playerPetObject.iconWidth || 30;
        const iconHeight = playerPetObject.iconHeight || 30;
        canvasContext.drawImage(
            playerPetObject.icon,
            playerPetObject.x + playerPetObject.width / 2 - iconWidth / 2,
            playerPetObject.y - iconHeight - 10,
            iconWidth,
            iconHeight
        );
    }

    playerPetObject.drawPet();
    activeEnemies.forEach(enemy => enemy.drawPet());

    if (playerPetObject.speedX !== 0 || playerPetObject.speedY !== 0) {
        activeEnemies.forEach(enemy => checkCollision(enemy));
    }
}

function checkCollision(enemy) {
    const enemyTop = enemy.y;
    const enemyBottom = enemy.y + enemy.height;
    const enemyRight = enemy.x + enemy.width;
    const enemyLeft = enemy.x;

    const playerTop = playerPetObject.y;
    const playerBottom = playerPetObject.y + playerPetObject.height;
    const playerRight = playerPetObject.x + playerPetObject.width;
    const playerLeft = playerPetObject.x;

    if (playerBottom < enemyTop || playerTop > enemyBottom || playerRight < enemyLeft || playerLeft > enemyRight) {
        return;
    }

    stopMovement()
    clearInterval(interval)
    sectionSelectAttack.style.display = 'flex'
    sectionViewMap.style.display = 'none'
}

// --------------------- MOVEMENTS ---------------------
function moveRight() { playerPetObject.speedX = 5 }
function moveLeft() { playerPetObject.speedX = -5 }
function moveDown() { playerPetObject.speedY = 5 }
function moveUp() { playerPetObject.speedY = -5 }
function stopMovement() { playerPetObject.speedX = 0; playerPetObject.speedY = 0 }

function keyPressed(event) {
    switch (event.key) {
        case 'ArrowUp': moveUp(); break
        case 'ArrowDown': moveDown(); break
        case 'ArrowLeft': moveLeft(); break
        case 'ArrowRight': moveRight(); break
    }
}

// --------------------- START ---------------------
window.addEventListener('load', () => {
    sectionSelectPet.style.display = 'none'
    sectionSelectAttack.style.display = 'none'
    sectionViewMap.style.display = 'none'
    sectionRestart.style.display = 'none'
    showStartScreen()
    startGame()
})
