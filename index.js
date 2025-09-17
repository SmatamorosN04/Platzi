
const sectionSeleccionarAtaque = document.getElementById('seleccion-ataque')
const sectionReiniciar = document.getElementById('Reiniciar')
const botonMascotajugador = document.getElementById('boton-mascotas')

sectionReiniciar.style.display = 'none'

const sectionSeleccionarMascota = document.getElementById('seleccion-mascota')
const spanmascota = document.getElementById('mascota-jugador')
const botonReiniciar = document.getElementById('boton-reinicio')
const spanmascotaEnemigo = document.getElementById('mascota-enemigo')

const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

const seccionMensajes = document.getElementById('resultado')
const ataqueDelJugador = document.getElementById('ataques-del-jugador')
const ataqueDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let mokepones = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputCindrome
let inputIncreible 
let inputCaladera
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquemokeponEnemigo
let BotonRayo
let BotonNieve 
let BotonFuego 
let botones = []
let ataquejugador = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let VictoriasJugador = 0
let VictoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './imagen/mokemap.png'
let alturaQueBusacamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

function mostrarPantallaInicio() {
    const pantallaInicio = document.createElement('div')
    pantallaInicio.id = 'pantalla-inicio'
    pantallaInicio.style.position = 'fixed'
    pantallaInicio.style.top = '0'
    pantallaInicio.style.left = '0'
    pantallaInicio.style.width = '100vw'
    pantallaInicio.style.height = '100vh'
    pantallaInicio.style.background = 'rgba(33,147,176,0.95)'
    pantallaInicio.style.display = 'flex'
    pantallaInicio.style.flexDirection = 'column'
    pantallaInicio.style.justifyContent = 'center'
    pantallaInicio.style.alignItems = 'center'
    pantallaInicio.innerHTML = `
        <h1 style="color:#fff;font-size:48px;">¡Bienvenido a Mokepon!</h1>
        <button id="boton-inicio" style="padding:16px 32px;font-size:24px;border-radius:12px;background:#fff;color:#2193b0;cursor:pointer;">Jugar</button>
    `
    document.body.appendChild(pantallaInicio)
    document.getElementById('boton-inicio').onclick = () => {
        pantallaInicio.remove()
        sectionSeleccionarMascota.style.display = 'flex'
    }
}
function animacionResultado(tipo) {
    const animDiv = document.createElement('div')
    animDiv.style.position = 'fixed'
    animDiv.style.top = '0'
    animDiv.style.left = '0'
    animDiv.style.width = '100vw'
    animDiv.style.height = '100vh'
    animDiv.style.display = 'flex'
    animDiv.style.justifyContent = 'center'
    animDiv.style.alignItems = 'center'
    animDiv.style.zIndex = '999'
    animDiv.style.background = 'rgba(255,255,255,0.7)'
    animDiv.innerHTML = `<h1 style="font-size:64px;color:${tipo === 'win' ? '#2193b0' : '#b02121'};">${tipo === 'win' ? '¡Ganaste!' : '¡Perdiste!'}</h1>`
    document.body.appendChild(animDiv)
    setTimeout(() => animDiv.remove(), 2000)
}
function crearMensajeFinal(resultadoFinal){
    seccionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = 'block'
    if (resultadoFinal.includes('GANASTE')) animacionResultado('win')
    if (resultadoFinal.includes('perdiste')) animacionResultado('lose')
}
function playBotonSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b2e3b.mp3')
    audio.volume = 0.3
    audio.play()
}

window.addEventListener('load', () => {
    sectionSeleccionarMascota.style.display = 'none'
    mostrarPantallaInicio()
})

if(anchoDelMapa > anchoMaximoDelMapa){
    anchoDelMapa = anchoMaximoDelMapa - 20

}

alturaQueBusacamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBusacamos

class Mokepon{
    constructor(nombre, foto, vida, fotoMapa  ){
        this.nombre = nombre 
        this.foto = foto
        this.vida = vida
        this.ataque = []
        this.ancho = 80
        this.alto = 80
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa || foto
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarMokepon(){
   if (this.mapaFoto && this.mapaFoto.complete && this.mapaFoto.naturalWidth !== 0) {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto

            )

        }
   }
}

let cindrome = new Mokepon('Cindrome', './imagen/png-clipart-the-incredibles-buddy-pine-illustration-syndrome-comics-and-fantasy-the-incredibles-thumbnail.png', 5, './imagen/png-clipart-the-incredibles-buddy-pine-illustration-syndrome-comics-and-fantasy-the-incredibles-thumbnail.png')
let increible = new Mokepon('Increible', './imagen/pngwing.com.png', 5 )
let caladera = new Mokepon('Caladera', './imagen/3135414-middle.png', 5 )
let cindromeEnemigo = new Mokepon('Cindrome', './imagen/png-clipart-the-incredibles-buddy-pine-illustration-syndrome-comics-and-fantasy-the-incredibles-thumbnail.png', 5)
let increibleEnemigo = new Mokepon('Increible', './imagen/pngwing.com.png', 5)
let caladeraEnemigo = new Mokepon('Caladera', './imagen/3135414-middle.png', 5)

cindrome.ataque.push(
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '❄️',  id: 'boton-nieve'},
)

cindromeEnemigo.ataque.push(
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '❄️',  id: 'boton-nieve'},
)


increible.ataque.push(
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '❄️',  id: 'boton-nieve'},
)


increibleEnemigo.ataque.push(
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '🔥',  id: 'boton-fuego'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '❄️',  id: 'boton-nieve'},
)

caladera.ataque.push(
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '🔥',  id: 'boton-fuego'},
)

caladeraEnemigo.ataque.push(
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '❄️',  id: 'boton-nieve'},
    { nombre: '⚡',  id: 'boton-rayo'},
    { nombre: '🔥',  id: 'boton-fuego'},
)

mokepones.push(cindrome,increible,caladera)

function iniciarjuego() {
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
            <input type="radio" name="mascota" id="${mokepon.nombre}"/>
            <label class="tarjeta-de-mokepon" for="${mokepon.nombre}">
                <p>${mokepon.nombre}</p>
                <img src="${mokepon.foto}" alt="${mokepon.nombre}">
            </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones
    })

    inputCindrome = document.getElementById('Cindrome')
    inputIncreible = document.getElementById('Increible')
    inputCaladera = document.getElementById('Caladera')

    botonMascotajugador.addEventListener('click', seleccionarMascota)
 
    botonReiniciar.addEventListener('click', reiniciarJuego)
}


function seleccionarMascota(){

    sectionSeleccionarMascota.style.display = 'none'
    // sectionSeleccionarAtaque.style.display = 'flex'





   if(inputCindrome.checked){ 
    spanmascota.innerHTML = inputCindrome.id
    mascotaJugador = inputCindrome.id
   }else if(inputIncreible.checked){
    spanmascota.innerHTML = inputIncreible.id
    mascotaJugador = inputIncreible.id
   } else if(inputCaladera.checked){
    spanmascota.innerHTML = inputCaladera.id
    mascotaJugador = inputCaladera.id
   } else {
    alert("Selecciona que Super Heroe")
    return
   }

    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()

    
}

function extraerAtaques(mascotaJugador){
    let ataque 
    for (let i = 0; i < mokepones.length; i++){
        if (mascotaJugador === mokepones[i].nombre){
            ataque = mokepones[i].ataque

        }
    }
    mostrarAtaques(ataque)

}

function mostrarAtaques(ataque){
    ataque.forEach((ataque) => {
        ataquesMokepon = `<button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>`

        contenedorAtaques.innerHTML += ataquesMokepon

    })
    BotonRayo = document.getElementById('boton-rayo')
    BotonNieve = document.getElementById('boton-nieve')
    BotonFuego = document.getElementById('boton-fuego')
    botones = document.querySelectorAll('.BAtaque')


}

function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥'){
                ataquejugador.push('FUEGO')
                console.log(ataquejugador)
                boton.style.background= '#112f58'
                boton.disabled = true
            } else if (e.target.textContent === '⚡'){
                ataquejugador.push('RAYO')
                console.log(ataquejugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            } else {
                ataquejugador.push('NIEVE')
                console.log(ataquejugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }

            // boton.disabled = true
            // boton.style.opacity = "0.5"
            // boton.style.cursor = "not-allowed"

            ataqueAleatorioEnemigo()
        })
    }) 
    
}



function seleccionarMascotaEnemigo(){
    let mascotasAleatorio = aleatorio(0,mokepones.length -1)

    spanmascotaEnemigo.innerHTML = mokepones[mascotasAleatorio].nombre
    ataquemokeponEnemigo = mokepones[mascotasAleatorio].ataque
    secuenciaAtaque()
}


function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0, ataquemokeponEnemigo.length -1)

    if(ataqueAleatorio == 0 || ataqueAleatorio == 1 ){
        ataqueEnemigo.push('FUEGO')
    }else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push('RAYO')
    } else {
        ataqueEnemigo.push('NIEVE')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
    
}

function iniciarPelea(){
    if (ataquejugador.length === 5){
        combate()
    }

}


function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataquejugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]

}

function combate(){
    for(let index = 0; index < ataquejugador.length; index++){
        if(ataquejugador[index] === ataqueEnemigo[index]){
            indexAmbosOponentes(index, index)
            crearMensaje("EMPATE")
        } else if (ataquejugador[index] == 'FUEGO' && ataqueEnemigo[index] == 'NIEVE'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            VictoriasJugador++
            spanVidasJugador.innerHTML = VictoriasJugador
        } else if (ataquejugador[index] == 'RAYO' && ataqueEnemigo[index] == 'FUEGO'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            VictoriasJugador++
            spanVidasJugador.innerHTML = VictoriasJugador
        } else if (ataquejugador[index] == 'NIEVE' && ataqueEnemigo[index] == 'RAYO'){
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            VictoriasJugador++
            spanVidasJugador.innerHTML = VictoriasJugador
        } else {
            indexAmbosOponentes(index, index)
            crearMensaje("Perdiste")
            VictoriasEnemigo++
            spanVidasEnemigo.innerHTML = VictoriasEnemigo
        }
    }
   
    revisarVidas()

}


function revisarVidas(){
    if(VictoriasJugador === VictoriasEnemigo){
        crearMensajeFinal("Esto es un empate!!")

    } else if(VictoriasJugador > vidasEnemigo){
        crearMensajeFinal("FELICIDADES GANASTE.")

    }else{
        crearMensajeFinal("Lo siento perdiste")

    }
}

function crearMensaje(resultado){
    

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    seccionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)   //Para buscar palabras con atajos seria crtl + f 
}

function crearMensajeFinal(resultadoFinal){
    

    seccionMensajes.innerHTML = resultadoFinal

   


       //probar que pasa si pongo las mismas sentencia de arriba en vez de esta
    sectionReiniciar.style.display = 'block'

    

}
function reiniciarJuego(){
    location.reload()

}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas(){  //ctrl + f para buscar atajo mas rapido'


    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY;
    lienzo.clearRect(0,0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height

    )
    mascotaJugadorObjeto.pintarMokepon()
    increibleEnemigo.pintarMokepon()
    cindromeEnemigo.pintarMokepon()
    caladeraEnemigo.pintarMokepon()
    if (mascotaJugadorObjeto.velocidadX !== 0 || mascotaJugadorObjeto.velocidadY !== 0) {
        revisarColision(cindromeEnemigo)
        revisarColision(increibleEnemigo)
        revisarColision(caladeraEnemigo)
        
    }
    
}

function moverDerecha(){
    mascotaJugadorObjeto.velocidadX = 5
}
function moverIzquierda(){
    mascotaJugadorObjeto.velocidadX = - 5
}
function moverAbajo(){
    mascotaJugadorObjeto.velocidadY = 5
}
function moverArriba(){
    mascotaJugadorObjeto.velocidadY = -5
}
function detenerMovimiento(){
    
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}
function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        default:
            break
    }

}

function iniciarMapa(){
   
    mascotaJugadorObjeto = obtenerObjetoMascotas(mascotaJugador)

    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascotas(nombreMascota){
    for (let i = 0; i < mokepones.length; i++){
        if (nombreMascota === mokepones[i].nombre){
            return mokepones[i]

        }
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y 
    const abajoEnemigo = enemigo.y + enemigo.alto 
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y 
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto 
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota= mascotaJugadorObjeto.x

    if( abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo

    ){
        return

    }
    detenerMovimiento()
    clearInterval(intervalo)
    console.log('Se detencto una colision')
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    
}

window.addEventListener('load', iniciarjuego)