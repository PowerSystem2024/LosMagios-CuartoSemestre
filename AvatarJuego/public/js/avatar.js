// VARIABLES GLOBALES
let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;

// Botones
const btnReiniciar = document.getElementById('boton-reiniciar');
const botonPersonajeJugador = document.getElementById("boton-personaje");
const botonReglas = document.getElementById("toggle-reglas");
const botonPatada = document.getElementById('boton-patada');
const botonPunio = document.getElementById('boton-punio');
const botonBarrida = document.getElementById('boton-barrida');


// Secciones y spans
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
const seccionReiniciar = document.getElementById('reiniciar');
const seccionReglas = document.getElementById("seccion-reglas");
const sectionMensaje = document.getElementById('mensajes');
const spanPersonajeJugador = document.getElementById('personaje-jugador');
const spanPersonajeEnemigo = document.getElementById('personaje-enemigo');
const spanVidasJugador = document.getElementById('vidas-jugador');
const spanVidasEnemigo = document.getElementById('vidas-enemigo');
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const sectionSeleccionarPersonaje = document.getElementById('seleccionar-personaje');

//Variables globales para los objetos de personajes
let personajeJugador;
let personajeEnemigo;

let personajes = [];

class Personaje {
    constructor(nombre, foto, vida){
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
    }
}

let zuko = new Personaje('Zuko', './assets/img/zuko.webp', 3);
let katara = new Personaje('Katara', './assets/img/katara.webp', 3);
let aang = new Personaje('Aang', './assets/img/aang.webp', 3);
let toph = new Personaje('Toph', './assets/img/toph.jpg', 3);


//Agregamos ataques a los personajes
zuko.ataques.push(
    {nombre: 'Punio', id: 'boton-punio'},
    {nombre: 'Patada', id: 'boton-patada'},
    {nombre: 'Barrida', id: 'boton-barrida'}
);

katara.ataques.push(
    { nombre: 'Punio', id: 'boton-punio' },
    { nombre: 'Patada', id: 'boton-patada' },
    { nombre: 'Barrida', id: 'boton-barrida' }
);

aang.ataques.push(
    { nombre: 'Punio', id: 'boton-punio' },
    { nombre: 'Patada', id: 'boton-patada' },
    { nombre: 'Barrida', id: 'boton-barrida' }
);
toph.ataques.push(
    { nombre: 'Punio', id: 'boton-punio' },
    { nombre: 'Patada', id: 'boton-patada' },
    { nombre: 'Barrida', id: 'boton-barrida' }
);


personajes.push(zuko, katara, aang, toph);

function iniciarJuego() {
    // Config inicial
    sectionSeleccionarAtaque.style.display = "none";
    seccionReiniciar.style.display = "none";

    crearTarjetaPersonajes();

    // Listeners
    botonPersonajeJugador.addEventListener("click", seleccionarPersonajeJugador);
    botonPunio.addEventListener('click', ataquePunio);
    botonPatada.addEventListener('click', ataquePatada);
    botonBarrida.addEventListener('click', ataqueBarrida);
    btnReiniciar.addEventListener('click', reiniciarJuego);
    botonReglas.addEventListener("click", () => {
        seccionReglas.style.display = seccionReglas.style.display === "none" ? "block" : "none";
    });
};

function crearTarjetaPersonajes() {
    personajes.forEach(personaje => {
        const tarjetaHtml = document.createElement('div');
        tarjetaHtml.className = 'card-personaje';
        tarjetaHtml.innerHTML = `
                    <img src="${personaje.foto}" alt="">
                    <div>
                        <label for="${personaje.nombre}">${personaje.nombre}</label>
                        <input type="radio" name="personaje" id="${personaje.nombre}" value="${personaje.nombre}" />
                    </div>
        `;
        contenedorTarjetas.append(tarjetaHtml);
    })
}



function seleccionarPersonajeJugador() {
    sectionSeleccionarAtaque.style.display = "block"; //mostramos

    sectionSeleccionarPersonaje.style.display = "none"; //ocultar
    seccionReglas.style.display = "none";


    if (document.getElementById('Zuko').checked) {
        personajeJugador = zuko;
    } else if (document.getElementById('Katara').checked) {
        personajeJugador = katara;
    } else if (document.getElementById('Aang').checked) {
        personajeJugador = aang;
    } else if (document.getElementById('Toph').checked) {
        personajeJugador = toph;
    } else {
        alert('Selecciona un personaje');
        reiniciarJuego();
        return;
    }

    spanPersonajeJugador.innerHTML = personajeJugador.nombre;
    document.title = "Tu personaje: " + personajeJugador.nombre;

    // Elegir personaje enemigo aleatorio
    seleccionarPersonajeEnemigo();
}

function seleccionarPersonajeEnemigo() {
    let personajeAleatorio = aleatorio(0, personajes.length -1);

    personajeEnemigo = personajes[personajeAleatorio];
    spanPersonajeEnemigo.innerHTML = personajeEnemigo.nombre;

}

function ataquePunio(){
    ataqueJugador = 'Punio';
    ataqueAleatorioEnemigo();
    combate();
}

function ataquePatada(){
    ataqueJugador = 'Patada';
    ataqueAleatorioEnemigo();
    combate();
}

function ataqueBarrida(){
    ataqueJugador = 'Barrida';
    ataqueAleatorioEnemigo();
    combate();
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0, personajeEnemigo.ataques.length -1);
    ataqueEnemigo = personajeEnemigo.ataques[ataqueAleatorio].nombre;
}

function combate() {
    let resultado = "";
    
    if (ataqueJugador === ataqueEnemigo) {
        resultado = " Fue un empate";
    } else if (
        (ataqueJugador === "Punio" && ataqueEnemigo === "Barrida") ||
        (ataqueJugador === "Barrida" && ataqueEnemigo === "Patada") ||
        (ataqueJugador === "Patada" && ataqueEnemigo === "Punio")
    ) {
        resultado = "Ganaste esta ronda! :) ";
        vidasEnemigo--;
        spanVidasEnemigo.innerHTML = vidasEnemigo;
    } else {
        resultado = "Perdiste esta ronda! :( ";
        vidasJugador--;
        spanVidasJugador.innerHTML = vidasJugador;
    }

    crearMensaje(resultado);
    revisarVidas();
}

function revisarVidas() {
    if (vidasEnemigo == 0) {
        crearMensajeFinal('FELICITACIONES HAS GANADO!!');
    } else if (vidasJugador == 0) {
        crearMensajeFinal('QUE PENA, HAS PERDIDO! :(');
    }
}

function crearMensajeFinal(resultado){
    seccionReiniciar.style.display = "block";

    let parrafo = document.createElement('p');
    parrafo.style.color = 'red';
    parrafo.style.fontWeight = '600';
    parrafo.innerHTML = resultado;
    
    sectionMensaje.appendChild(parrafo);

    botonPunio.disabled = true;
    botonPatada.disabled = true;
    botonBarrida.disabled = true;
}

function crearMensaje(resultado){
    let parrafo = document.createElement('p');
    let parrafo2 = document.createElement('p');
    parrafo2.classList.add('parrafo2');

    parrafo.innerHTML = 'Tu personaje atacó con ' + ataqueJugador + ', el personaje del enemigo atacó con ' + ataqueEnemigo + '.'; 
    parrafo2.innerText = 'Esta vez: ' + resultado;
    sectionMensaje.appendChild(parrafo);
    sectionMensaje.appendChild(parrafo2);
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max){
    return Math.floor( Math.random() * (max - min +1) + min);
}

window.addEventListener("load", iniciarJuego);
