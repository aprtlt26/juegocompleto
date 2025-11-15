  
  
  
  
  
  function startAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscilador = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        gainNode.connect(audioCtx.destination);
        oscilador.connect(gainNode);
        oscilador.start();
    }
}

function solicitarPermisoMicrofono() {
    // Solicitar acceso al micrófono
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
        // Permiso concedido
        // ...
    }).catch(function(error) {
        // Permiso denegado o error
        // ...
    });
}

// Esta función inicia el AudioContext y solicita permisos después de la interacción del usuario
function iniciarInteraccionUsuario() {
    iniciarAudio();
    solicitarPermisoMicrofono();
    // Eliminar el listener para no volver a solicitar permisos
    document.removeEventListener('touchend', iniciarInteraccionUsuario);
}

// Muestra un alerta y luego espera una interacción del usuario para iniciar todo
// ====== SISTEMA DE ALERTA DE INICIO ESTILIZADO ======
function mostrarAlertaInicio() {
    const startAlert = document.getElementById('start-alert');
    if (startAlert) {
        startAlert.style.display = 'flex';
    }
}

function cerrarAlertaInicio() {
    const startAlert = document.getElementById('start-alert');
    if (startAlert) {
        startAlert.style.display = 'none';
    }
    iniciarInteraccionUsuario();
}

// Muestra la alerta estilizada al cargar la página
window.onload = function() {
    mostrarAlertaInicio();
    
    // También se puede cerrar haciendo clic en cualquier lugar
    document.addEventListener('click', function primeraInteraccion() {
        cerrarAlertaInicio();
        document.removeEventListener('click', primeraInteraccion);
    });
    
    // Para dispositivos táctiles
    document.addEventListener('touchend', function primerToque() {
        cerrarAlertaInicio();
        document.removeEventListener('touchend', primerToque);
    });
};

// Función para iniciar la interacción (la que ya tenías)
function iniciarInteraccionUsuario() {
    startAudioContext();
    solicitarPermisoMicrofono();
}





// Crear instancia de Audio para el sol
let audioSol = new Audio('ambient.wav');
audioSol.loop = true;  // Habilitar reproducción en bucle
audioSol.volume = 1.0;  // Establecer el volumen al máximo
// ====== SISTEMA DE LIBERACIÓN CON 3 AUDIOS ======
// Variable para controlar que la alerta solo se muestre una vez
window.liberacionMostrada = false;

let audioLuna = new Audio('0S.wav');
audioLuna.loop = true;  // Habilitar reproducción en bucle
audioLuna.volume = 1.0;  // Establecer el volumen al máximo
// ====== VARIABLES GLOBALES ======
let solActivo = false;
let lunaActiva = false; 
let ruidoBlancoActivo = false;
let trapped = false; // Asegurar que existe


// ====== EVENTOS CORREGIDOS ======
document.getElementById('ascii-sol').addEventListener('click', function() {
    if (audioSol.paused) {
        audioSol.play();
        solActivo = true;
    } else {
        audioSol.pause();
        audioSol.currentTime = 0;
        solActivo = false;
    }
    verificarLiberacion(); // ✅ AGREGAR ESTO
});

document.getElementById('ascii-luna').addEventListener('click', function() {
    if (audioLuna.paused) {
        audioLuna.play();
        lunaActiva = true;
    } else {
        audioLuna.pause();
        audioLuna.currentTime = 0;
        lunaActiva = false;
    }
    verificarLiberacion(); // ✅ AGREGAR ESTO
});

document.getElementById('ascii-cat').addEventListener('click', function(event) {
    event.stopPropagation();
    
    if (!ruidoBlancoActivo) {
        generarRuidoBlanco();
        ruidoBlancoActivo = true;
    } else {
        if (whiteNoiseSource) whiteNoiseSource.stop();
        ruidoBlancoActivo = false;
    }
    verificarLiberacion(); // ✅ AGREGAR ESTO
});

// ====== DEBUG EN CONSOLA ======
function debugEstado() {
    console.log("🎵 SONIDOS - Sol:", solActivo, "Luna:", lunaActiva, "Ruido:", ruidoBlancoActivo);
    console.log("🔒 ESTADO - Trapped:", trapped, "Movimiento:", enableMovementAndJump);
    
    const box = document.getElementById('wooden-box');
    const asciiArt = document.getElementById('ascii-art');
    console.log("📦 ELEMENTOS - Caja visible:", box?.style.display, "Personaje visible:", asciiArt?.style.display);
}

// Ejecutar debug cada 2 segundos
setInterval(debugEstado, 2000);

// ====== ELIMINAR LA VARIABLE LOCAL enableMovementAndJump ======
// BUSCA en DOMContentLoaded y ELIMINA esta línea:
// let enableMovementAndJump = true;
// ====== BARRA ESPACIADORA: RUIDO BLANCO + GLITCH ASCII ======
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        // Activar / desactivar ruido blanco con barra espaciadora
        if (!ruidoBlancoActivo) {
            generarRuidoBlanco();
            ruidoBlancoActivo = true;

            // 🔥 activar glitch (lo mismo que hacías con la tecla G)
            glitchMode = true;
        } else {
            if (whiteNoiseSource) {
                try { 
                    whiteNoiseSource.stop(); 
                } catch (e) {}
            }
            ruidoBlancoActivo = false;

            // ⛔ apagar glitch y devolver ASCII al estado base
            glitchMode = false;
        }

        verificarLiberacion();
        event.preventDefault(); // que la página no haga scroll
    }
});

// ====== FUNCIÓN DE LIBERACIÓN COMPLETA ======
function liberarInmediatamente() {
    console.log("🔥 LIBERACIÓN COMPLETA ACTIVADA");
    
    const box = document.getElementById('wooden-box');
    const asciiArt = document.getElementById('ascii-art');
    
    if (box) box.style.display = 'none';
    if (asciiArt) {
        asciiArt.style.display = 'block';
        asciiArt.style.top = '300px';
        asciiArt.style.left = '700px';
    }
    
    // RESTAURAR MOVIMIENTO COMPLETO
    enableMovementAndJump = true;
    trapped = false;
    portalLocked = false;
    
    console.log("🎉 MOVIMIENTO RESTAURADO:", enableMovementAndJump);
}

// ====== VERIFICACIÓN ULTRA RÁPIDA ======
function verificarLiberacion() {
    if (solActivo && lunaActiva && ruidoBlancoActivo) {
        liberarInmediatamente();
    }
}

// ====== VERIFICACIÓN CADA 10ms ======
setInterval(verificarLiberacion, 10);






// ✅ MODIFICAR checkPortalDistance para que no active glitch con 3 audios
// BUSCA la función checkPortalDistance y AGREGA esto al INICIO:
function checkPortalDistance() {
    // ✅ SI LOS 3 AUDIOS ESTÁN ACTIVOS, NO HACER NADA CON EL PORTAL
    if (solActivo && lunaActiva && ruidoBlancoActivo) {
        if (window.portalBreak) {
            glitchAudioStop();
        }
        portalLocked = false; // Asegurar que esté desbloqueado
        return; // Salir de la función, no activar glitch
    }
    
    // El resto del código original de checkPortalDistance aquí...
    if (!portalImg) return;

    const asciiRect = asciiArt.getBoundingClientRect();
    const imgRect = portalImg.getBoundingClientRect();
    // ... resto del código original
}

// Función para iluminar el ASCII art
function iluminarAsciiArt() {
    asciiArtElement.classList.add('glow');
}

// Función para apagar la iluminación del ASCII art
function apagarIluminacionAsciiArt() {
    asciiArtElement.classList.remove('glow');
}

function checkAudioCompletion() {
    const solOn  = audioSol && !audioSol.paused;
    const lunaOn = audioLuna && !audioLuna.paused;

    // Si usas whiteNoiseSource como AudioBufferSourceNode, no tiene .paused,
    // así que lo simplificamos al estado de Sol + Luna.
    // Si además quieres condición de ruido blanco, ajusta aquí.
    if (solOn && lunaOn) {
        enableMovementAndJump = true;
        iluminarAsciiArt();
        startFastGlitch();   // 🔥 aquí se dispara el glitch rápido
    } else {
        enableMovementAndJump = false;
        apagarIluminacionAsciiArt();
        stopFastGlitch();    // ⛔ se apaga el glitch al parar audios
    }
}

  let oscilador;
  let gainNode;
  let compressor;
  let reverbNode;


    let enableMovementAndJump = true;

  let whiteNoiseSource;
  let whiteNoiseGain;
  let shuffleInterval = null;
  let currentIntervalId = null;
let currentIntervalSpeed = 4; // Velocidad inicial del intervalo en milisegundos
let collisionCount = 0;



  function toggleIntervalSpeed() {
if (currentIntervalId !== null) {
  clearInterval(currentIntervalId); // Detiene el intervalo actual
}

// Cambia la velocidad del intervalo
currentIntervalSpeed = currentIntervalSpeed === 40 ? 550 : 40;

// Reinicia el intervalo con la nueva velocidad
currentIntervalId = setInterval(shuffleAsciiArtAndSound, currentIntervalSpeed);
}




function shuffleAsciiArtAndSound() {
  let newText = '';
  const characters = ['@', '#', '$', '%', '&', '*', '-', '+', '=', '?', ';', ':', ',', '.', '▒', '▓', '▒', '░', '█', '▓'];

  // Shuffle del personaje principal
  for (let char of asciiArtElement.innerText) {
    if (characters.includes(char)) {
      let randomChar = characters[Math.floor(Math.random() * characters.length)];
      newText += randomChar;
    } else {
      newText += char;
    }
  }
  asciiArtElement.innerText = newText;

  // AGREGAR: Shuffle del árbol
  const asciiMountain = document.getElementById('ascii-mountain');
  if (asciiMountain) {
    let mountainText = '';
    for (let char of asciiMountain.innerText) {
      if (characters.includes(char)) {
        let randomChar = characters[Math.floor(Math.random() * characters.length)];
        mountainText += randomChar;
      } else {
        mountainText += char;
      }
    }
    asciiMountain.innerText = mountainText;
  }

  oscilador.frequency.value = Math.random() * (100 - 500) + 0;
}



document.body.addEventListener('click', function() {
if (!audioCtx) {
  startAudioContext();
  // Establece el intervalo para mezclar los caracteres del arte ASCII principal
  if (currentIntervalId === null) {
      currentIntervalId = setInterval(shuffleAsciiArtAndSound, currentIntervalSpeed);
  shuffleAsciiCat(); // Cambia los caracteres del gato ASCII inmediatamente
  setInterval(shuffleAsciiCat, 100 ); // Continúa cambiando los caracteres del gato ASCII
}}
});



document.body.addEventListener('dblclick', function() {
toggleIntervalSpeed();
// Aquí puedes agregar cualquier otra lógica que necesites ejecutar en un doble clic
});

const asciiArtElement = document.getElementById('ascii-art' );

// Nuevo manejador de eventos para el movimiento del mouse
document.getElementById('ascii-art').addEventListener('mousemove', function(event) {
if (!audioCtx) return; // Asegúrate de que el contexto de audio esté inicializado

const frequency = (event.offsetX / this.offsetWidth) * (10 - 13000) + 10000;
oscilador.frequency.value = frequency; // Ajusta la frecuencia según la posición del mouse


const gainValue = - 0.0 - (event.offsetY / this.offsetHeight);
gainNode.gain.value = gainValue;
});








let osciladoresActivos = [];


  let prevMouseX = 0;
  let prevMouseY = 0;
  let mouseMoving = false;
  
  function setup() {
      let asciiArtContainer = document.getElementById('ascii-container'); 
      let desiredHeight = 400; // Establecer el largo deseado aquí
      let canvas = createCanvas(asciiArtContainer.offsetWidth, desiredHeight);


   canvas.position(asciiArtContainer.offsetLeft, asciiArtContainer.offsetTop);
   textSize(22);
      fill(255);
      noStroke();
background(0); 
}


function windowResized() {
let asciiArtContainer = document.getElementById('ascii-container');
let desiredHeight = 400; // Asegúrate de usar el mismo largo deseado que antes
resizeCanvas(asciiArtContainer.offsetWidth, desiredHeight);
canvas.position(asciiArtContainer.offsetLeft, asciiArtContainer.offsetTop);
}


  function draw() {
      // Verificar si el mouse se ha movido
      if (mouseX !== prevMouseX || mouseY !== prevMouseY) {
          mouseMoving = true;
          // Generar y mostrar un carácter aleatorio en la posición del mouse
          let char = generarCaracterAleatorio();
          text(char, mouseX, mouseY);
  
          // Aquí iría el código para reproducir el sonido
          // reproducirSonido();
          
          prevMouseX = mouseX;
          prevMouseY = mouseY;
      } else {
          if (mouseMoving) {
              // El mouse se detuvo; limpiar el canvas y detener el sonido
              background(0);
              // detenerSonido();
              mouseMoving = false;
          }
      }
  }
  
  function generarCaracterAleatorio() {
      // Generar un número aleatorio y convertirlo a un carácter ASCII
      return String.fromCharCode(int(random(65, 1190))); // Letras mayúsculas A-Z
  }
  
  // Funciones para manejar el audio
  // Deberás reemplazar estas funciones con tu propia lógica de audio
  function reproducirSonido() {
      // Inicia el sonido
  }
  
  function detenerSonido() {
      // Detiene el sonido
  }



function reproducirSonido(frecuencia) {
if (!audioCtx) return;



let oscilador = audioCtx.createOscillator();
oscilador.frequency.value = frecuencia;
oscilador.type = 'sine';
oscilador.connect(gainNode);
oscilador.start();
}




function inicializarAudio() {
if (!audioCtx) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  compressor = audioCtx.createDynamicsCompressor();

  compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
  compressor.knee.setValueAtTime(100, audioCtx.currentTime); // Hace la transición más suave
  compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0, audioCtx.currentTime);
  compressor.release.setValueAtTime(1.25, audioCtx.currentTime);
  gainNode.gain.value = 0.0;
// Volumen inicial ajustable.
gainNode.connect(compressor);
  compressor.connect(audioCtx.destination);    }
}
function handleMoveEvent(e) {
let x, y;
if (e.type === 'mousemove') {
  x = e.clientX;
  y = e.clientY;
} else if (e.type === 'touchmove' && e.touches) {
  x = e.touches[0].clientX;
  y = e.touches[0].clientY;
} else {
  return; // Si no es un evento conocido, no hacer nada
}

if (!audioCtx) return; // Asegúrate de que el contexto de audio esté inicializado

let frecuencia = map(x, 0, window.innerWidth, 0, 0);
let duracionNota = map(y, 0, window.innerHeight, 0.1, 0.1);

if (osciladoresActivos.length > 0) {
  osciladoresActivos.forEach(osc => {
      osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
  });
}

osciladoresActivos.forEach(osc => osc.stop());
osciladoresActivos = [];

let oscilador = audioCtx.createOscillator();
oscilador.frequency.value = frecuencia;
oscilador.type = 'sine';
oscilador.connect(gainNode);
oscilador.start();
oscilador.stop(audioCtx.currentTime + duracionNota);

osciladoresActivos.push(oscilador);
}

document.body.addEventListener('mousemove', handleMoveEvent);
document.body.addEventListener('touchmove', handleMoveEvent);

document.body.addEventListener('touchmove', function(e) {
if (e.touches && e.touches.length > 0) {
  // Utilizar la primera posición de toque como referencia
  setValueAtTime(e.touches[0].clientX, e.touches[0].clientY);
}
});




// Variable para almacenar el ID del intervalo para poder detenerlo más tarde si es necesario
let shuffleIntervalId = null;
document.body.addEventListener('click', function() {
  // Comprueba si el intervalo ya está establecido
  if (!shuffleIntervalId) {
    shuffleIntervalId = setInterval(function() {
     
      shuffleAscii(document.getElementById('ascii-cat'));
      shuffleAscii(document.getElementById('ascii-mountain'));
    shuffleAscii(document.getElementById('glax tree2'));
        shuffleAscii(document.getElementById('text'));
         shuffleAscii(document.getElementById('ascii-sol'));
      shuffleAscii(document.getElementById('ascii-luna'));

    }, 20); // Cambia los caracteres cada 20 milisegundos
  }
});
function shuffleAscii(element) {
  if (!element) return;

  // Guardamos el ASCII original solo la primera vez
  if (!element.dataset.baseText) {
    element.dataset.baseText = element.innerText;
  }

  // Si el glitch está apagado, volvemos al estado original y salimos
  if (!glitchMode) {
    element.innerText = element.dataset.baseText;
    return;
  }

  // Si el glitch está encendido, partimos SIEMPRE del texto original
  const source = element.dataset.baseText;
  let newText = '';

  for (let char of source) {
    if (asciiTargetChars.includes(char)) {
      const randomChar = asciiCharsGlitch[Math.floor(Math.random() * asciiCharsGlitch.length)];
      newText += randomChar;
    } else {
      newText += char;
    }
  }

  element.innerText = newText;
}



let glitchMode = false;  // false = normal, true = glitch

// caracteres del ASCII original que quieres afectar
const asciiTargetChars = [
  '@', '#', '▒', '▓', '▒', '░', '█', '▓',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o',
  'p', 'q'
];
// caracteres en modo glitch (aquí metemos los “trucos” con espacios)
const asciiCharsGlitch = [
  '@ ',  '#  ', '▒ ', '▓  ', '▒   ', '░ ', '█  ', '▓   ',
  'a ', 'b  ', 'c   ', 'd ', 'e  ', 'f   ', 'g ', 'h  ',
  'i   ', 'j ', 'k ', 'l   ', 'm ', 'n  ', 'ñ   ', 'o ',
  'p  ', 'q   '
];

document.addEventListener('keydown', (event) => {
  if (event.key === 'g' || event.key === 'G') {
    glitchMode = !glitchMode;
    console.log('ASCII glitch mode:', glitchMode ? 'ON' : 'OFF');
  }
});



function generarRuidoBlanco(duracion = 10) {
const bufferSize = audioCtx.sampleRate * duracion; // Duración del buffer de 1 segundo
const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
const data = buffer.getChannelData(0);

// Llenar el buffer con datos de ruido blanco
for (let i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}

whiteNoiseSource = audioCtx.createBufferSource();
whiteNoiseSource.buffer = buffer;
whiteNoiseSource.loop = true;
whiteNoiseSource.connect(gainNode);
whiteNoiseSource.start(0);
  whiteNoiseSource.stop(audioCtx.currentTime + duracion);

}




document.getElementById('ascii-cat').addEventListener('click', function(event) {
event.stopPropagation(); // Previene la propagación del evento al cuerpo del documento

// Mueve el gato ASCII a una nueva posición aleatoria
moverYMostrarGatoAscii();
const asciiCatElement = document.getElementById('ascii-cat');

// Genera ruido blanco
if (!audioCtx) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
});
let contadorApariciones = 0;

function cicloAparicionGato() {
const asciiCatElement = document.getElementById('ascii-cat');
// Reiniciar el contador si es el inicio de un nuevo ciclo
if (contadorApariciones === 0) {
  asciiCatElement.style.display = 'none'; // Asegurar que comienza oculto
}
const intervalo = setInterval(() => {
  if (asciiCatElement.style.display === 'none') {
      // Calcular nueva posición aleatoria
      const asciiContainer = document.getElementById('ascii-art');
      const newX = Math.random() * (asciiContainer.offsetWidth - asciiCatElement.offsetWidth);
      const newY = Math.random() * (asciiContainer.offsetHeight - asciiCatElement.offsetHeight);

      // Actualizar posición y mostrar
      asciiCatElement.style.left = `${newX}px`;
      asciiCatElement.style.top = `${newY}px`;
      asciiCatElement.style.display = 'block';

      // Generar ruido blanco en cada aparición

      contadorApariciones++;
  } else {
      asciiCatElement.style.display = 'none';
  }

  // Verificar si el ciclo debe terminar
  if (contadorApariciones >= 3) {
      clearInterval(intervalo);
      contadorApariciones = 0; // Restablecer para el próximo clic
  }
}, random); // Ajusta este valor según necesites controlar la velocidad de aparición
}

document.getElementById('ascii-cat').addEventListener('click', function(event) {
cicloAparicionGato(); // Inicia el ciclo de aparición del gato
});






function startAudioContext() {
if (!audioCtx) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscilador = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  // Crear delay y configurar
  const delay = audioCtx.createDelay(0.1);
  const delayGain = audioCtx.createGain();
  delay.delayTime.value = 0.2; // Tiempo de delay inicial
  delayGain.gain.value = 0.1;  // Ganancia del delay para controlar la intensidad del eco

  delay.connect(delayGain); 
  delayGain.connect(delay);
  delayGain.connect(audioCtx.destination); // Enviar eco al destino

  // Conectar el oscilador a gainNode y al delay
  oscilador.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.connect(delay); // También enviamos el sonido al delay

  oscilador.start();
}
}



// Instancia de p5 para el árbol
let sketch2 = function(p) {
let asciiCat = `

   
☁☁ ☁ 


`;

p.setup = function() {
p.createCanvas(710, 200);
p.textSize(32);
p.fill(255);
x = p.random(p.width - 100); // Coordenada inicial x
  y = p.random(p.height - 100); // Coordenada inicial y
};


p.draw = function() {
p.background(0);

let x = p.random(p.width - 100); // Asegura espacio para el gato
let y = p.random(p.height - 250); // Asegura espacio para el gato

// Dibuja el gato en el canvas en la posición aleatoria
p.text(asciiCat, x, y,x);

};

p.mouseClicked = function() {
p.clear(); // Limpia el canvas
p.draw(); // Dibuja un nuevo gato
};
};




new p5(sketch2, 'tree-sketch-container');
document.addEventListener('keydown', function(event) {
    // asegura audio inicializado
    if (!audioCtx) {
        if (typeof startAudioContext === 'function') {
            startAudioContext();
        }
    }
    

    switch (event.key) {
        case 's':
        case 'S':
            // sol
            togglePlay('ascii-sol', 'ambient.wav');
            break;

        case 'l':
        case 'L':
            // luna
            togglePlay('ascii-luna', '0S.wav');
            break;

        case ' ':
            // gato + ruido blanco
            toggleAsciiCatAndWhiteNoise();
            event.preventDefault();
            break;

               // las flechas ahora las controla moveCharacter (portal + colisión)
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            event.preventDefault();
            break;


        case 'y':
        case 'Y':
            // >>> AQUÍ SE ABRE EL PORTAL GLITCHEADO <<<
            triggerPortalGlitch();
            break;
    }
});



function moverYMostrarGatoAscii(mostrar) {
console.log("moverYMostrarGatoAscii: mostrar =", mostrar); // Depuración
const asciiCatElement = document.getElementById('ascii-cat');
if (mostrar) {
  const newX = Math.random() * (window.innerWidth - asciiCatElement.offsetWidth);
  const newY = Math.random() * (window.innerHeight - asciiCatElement.offsetHeight);
  asciiCatElement.style.left = `${newX}px`;
  asciiCatElement.style.top = `${newY}px`;
  asciiCatElement.style.display = 'block';
} else {
  asciiCatElement.style.display = 'none';
}
}


function toggleAsciiCatAndWhiteNoise() {
const asciiCatElement = document.getElementById('ascii-cat');
// Verificar si el gato está visible basado en el estilo 'display'
const isVisible = asciiCatElement.style.display === 'block';

if (isVisible) {
  // Detener el ruido blanco y ocultar el gato ASCII
  if (whiteNoiseSource) {
      whiteNoiseSource.disconnect();
      whiteNoiseSource = null;
  }
  moverYMostrarGatoAscii(false); // Ocultar el gato ASCII
} else {
  // Generar ruido blanco y mostrar el gato ASCII
  generarRuidoBlanco(22); // Suponemos que la función ya mueve y muestra el gato ASCII
}
}


// En la función que maneja el movimiento del mouse sobre elementos ASCII
document.getElementById('ascii-mountain').addEventListener('mousemove', function(event) {
  if (!audioCtx) return;
  
  const frequency = (event.offsetX / this.offsetWidth) * (10 - 13000) + 10000;
  if (oscilador) {
    oscilador.frequency.value = frequency;
  }
  
  const gainValue = -0.0 - (event.offsetY / this.offsetHeight);
  if (gainNode) {
    gainNode.gain.value = gainValue;
  }
});



let catVisible = false; // Estado de visibilidad del gato

document.getElementById('ascii-cat').addEventListener('click', function() {

generarRuidoBlanco();  // Iniciar ruido blanco al clic
catVisible = !catVisible;
this.style.display = catVisible ? 'block' : 'true';
});


document.addEventListener('keydown', function(event) {
if (event.key === ' ') {
  catVisible = !catVisible; // Alternar visibilidad con barra espaciadora
  document.getElementById('ascii-cat').style.display = catVisible ? 'block' : 'none';
  event.preventDefault(); // Evitar el desplazamiento de la página
}
});






// Evento para controlar la ganancia con el movimiento del mouse o touch
document.body.addEventListener('mousemove', handleMovement);
document.body.addEventListener('touchmove', handleMovement);

function handleMovement(event) {
let x, y;
if (event.touches) {
  x = event.touches[0].clientX;
  y = event.touches[0].clientY;
} else {
  x = event.clientX;
  y = event.clientY;
}

// Escalar la amplitud del ruido blanco según la posición vertical
let newGain = Math.max(0, Math.min(1, (window.innerHeight - y) / window.innerHeight));
gainNode.gain.value = newGain;

// Aquí puedes añadir la lógica para cambiar algún otro parámetro con x si lo deseas
}

// =================== LLUVIA + RAYOS + PORTAL GLITCH ===================
let rainSketch = function(p) {
    let raindrops = [];
    let lightnings = [];
    let nextStrike = 0; // cuándo cae el próximo rayo (en ms)

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(30);
        nextStrike = p.millis() + p.random(1000, 2000);
    };

p.draw = function() {
    p.clear();

    // ================= LLUVIA =================
    for (let i = raindrops.length - 1; i >= 0; i--) {
        raindrops[i].update();
        raindrops[i].display();
        if (raindrops[i].isOffScreen()) {
            raindrops.splice(i, 1);
        }
    }

    // Más gotas de lluvia
    if (p.frameCount % 1 === 0) {
        raindrops.push(new Raindrop(p));
    }

    // ================= RAYOS - DESACTIVAR DURANTE GLITCH =================
    let now = p.millis();

    if (!window.portalBreak && now > nextStrike) {
        const simultaneousLightnings = Math.floor(p.random(2, 6));
        
        for (let i = 0; i < simultaneousLightnings; i++) {
            lightnings.push(new Lightning(p));
        }
        
        nextStrike = now + p.random(1000, 3000);
    }

    let flashStrength = 0;
    if (!window.portalBreak) {
        for (let i = lightnings.length - 1; i >= 0; i--) {
            let L = lightnings[i];
            L.update();
            L.display();

            if (!L.isDead()) {
                let s = L.flashStrength();
                flashStrength += s * 0.2;
            } else {
                lightnings.splice(i, 1);
            }
        }

        if (flashStrength > 0) {
            p.push();
            p.noStroke();
            const intensity = p.min(flashStrength, 3.0);
            p.fill(255, 244, 200, 180 * intensity);
            p.rect(0, 0, p.width, p.height);
            p.pop();
        }
    }

    // ================= PORTAL GLITCH - MUY RÁPIDO =================
    if (window.portalBreak) {
        portalBreakFrames++;

        const W  = p.width;
        const H  = p.height;
        const cx = W * 0.5;

        const portalW  = W * 0.30;
        const halfW    = portalW * 0.5;
        const left     = cx - halfW;
        const right    = cx + halfW;

        // SIEMPRE visible pero con parpadeo RÁPIDO
        let snapshot = p.get(left, 0, portalW, H);

        // Fondo negro
        p.push();
        p.noStroke();
        p.fill(0, 0, 0, 255);
        p.rect(left, 0, portalW, H);
        p.pop();

        // ================= 1) TEARING HORIZONTAL MUY RÁPIDO =================
        p.push();
        p.noTint();
        let bandMin = 3;  // MUY DELGADO
        let bandMax = 8;  // MUY VARIADO

        for (let y = 0; y < H; ) {
            let h  = p.random(bandMin, bandMax);
            let sy = y;
            let sh = h;

            // DESPLAZAMIENTO MUY RÁPIDO Y EXTREMO
            let offsetX = p.random(-100, 100); 
            let offsetY = p.random(-20, 20);
            let scaleX  = 1 + p.random(-1.0, 1.0); // DISTORSIÓN EXTREMA

            p.push();
            p.translate(left + offsetX, offsetY);
            p.scale(scaleX, 1);

            // COLOR QUE CAMBIA MUY RÁPIDO
            let colorSpeed = portalBreakFrames * 2.0;
            let r = 210 + p.sin(colorSpeed * 1.7) * 80;
            let g = 210 + p.sin(colorSpeed * 1.3) * 80;
            let b = 240 + p.sin(colorSpeed * 1.9) * 80;
            let alpha = 200 + p.sin(colorSpeed * 2.3) * 55;

            p.tint(r, g, b, alpha);
            p.image(snapshot, 0, y, portalW, sh, 0, sy, portalW, sh);
            p.pop();

            y += h;
        }
        p.pop();
        p.noTint();

        // ================= 2) FRANJAS METÁLICAS MUY RÁPIDAS =================
        p.push();
        p.blendMode(p.ADD);
        let stripeW = 1; // MUY DELGADO

        for (let x = left; x < right; x += stripeW) {
            let dNorm = Math.abs((x - cx) / halfW);
            dNorm = p.constrain(dNorm, 0, 1);

            // VELOCIDAD MUY ALTA
            let t = portalBreakFrames * 5.0 + x * 1.2;

            let base = p.map(dNorm, 0, 1, 255, 150);

            // VARIACIONES MUY RÁPIDAS
            let rCol = base + 100 * p.sin(t * 25.7);
            let gCol = base + 90 * p.cos(t * 23.1 + 1.2);
            let bCol = base + 110 * p.sin(t * 24.9 + 0.7);

            rCol = p.constrain(rCol, 150, 255);
            gCol = p.constrain(gCol, 150, 255);
            bCol = p.constrain(bCol, 170, 255);

            // ALPHA QUE PARPADEA MUY RÁPIDO
            let alpha = 190 + 80 * p.sin(t * 20.0 + x * 0.8);
            alpha = p.constrain(alpha, 160, 255);

            p.noStroke();
            p.fill(rCol, gCol, bCol, alpha);
            p.rect(x, 0, stripeW, H);

            // LÍNEAS BLANCAS QUE PARPADEAN MUY RÁPIDO
            if (p.random() > 0.7) { // 30% DE PROBABILIDAD - MÁS FRECUENTE
                p.fill(255, 255, 255, 255);
                p.rect(x, 0, 1, H);
            }
        }

        // NÚCLEO QUE PARPADEA RÁPIDO
        let corePulse = p.sin(portalBreakFrames * 1.0) * 0.3 + 0.7;
        p.fill(255, 255, 255, 255 * corePulse);
        p.rect(cx - 1, 0, 2, H);

        p.pop();
        p.blendMode(p.BLEND);

        // ================= 3) BLOQUES DE RUIDO MUY RÁPIDOS =================
        p.push();
        let blocks = 130; // MÁS BLOQUES
        for (let i = 0; i < blocks; i++) {
            // 90% DE PROBABILIDAD - CASI SIEMPRE VISIBLES
            if (p.random() > 0.1) {
                let rw = p.random(5, 60);
                let rh = p.random(1, 10);

                let rx = p.random(left - 50, right - rw + 50);
                let ry = p.random(-50, H + 50);

                let br = p.random(150, 255);
                let tintShift = p.random(-40, 40);

                p.noStroke();
                p.fill(
                    p.constrain(br + tintShift, 150, 255),
                    p.constrain(br + tintShift, 150, 255),
                    p.constrain(br + tintShift + 20, 170, 255),
                    p.random(200, 255) // ALPHA ALTO
                );
                p.rect(rx, ry, rw, rh);
            }
        }
        p.pop();
    }
};



    };

    // ---------- DIBUJO DE LA GRIETA GLITCHEADA ----------
    function drawPortalGlitch(p, snapshot) {
    const W  = p.width;
    const H  = p.height;
    const cx = W * 0.8;

    // grieta más estrecha
    const portalW = W * 0.14;
    const halfW   = portalW * 0.5;
    const left    = cx - halfW;
    const right   = cx + halfW;

    // parpadeo (flicker) fuerte
    let flicker = 10.7
        + 0.5 * Math.sin(p.frameCount * 22.4)
        + (Math.random() - 0.5) * 0.8;
    flicker = p.constrain(flicker, 0.2, 1.2);

    // ⚠️ NO tocamos el fondo aquí, solo dibujamos ENCIMA en [left, right].

    // ========= 1) duplicado RGB plateado dentro de la grieta =========
    p.push();
    p.blendMode(p.ADD);

    const shift = 4 + 6 * flicker;

    // borde magenta-plateado
    p.tint(255, 220, 255, 180 * flicker);
    p.image(snapshot,
        left - shift, 0, portalW, H,
        left,        0, portalW, H
    );

    // capa central más neutra
    p.tint(210, 230, 240, 200 * flicker);
    p.image(snapshot,
        left, 0, portalW, H,
        left, 0, portalW, H
    );

    // borde cian-verdoso
    p.tint(200, 255, 230, 180 * flicker);
    p.image(snapshot,
        left + shift, 0, portalW, H,
        left,        0, portalW, H
    );

    p.pop();
    p.noTint();
    p.blendMode(p.BLEND);

    // ========= 2) scanlines metálicas dentro de la grieta =========
    p.push();
    p.strokeWeight(1);
    for (let y = 0; y < H; y += 2) {
        const alpha = (60 + 70 * Math.sin(0.35 * y + p.frameCount * 0.9)) * flicker;
        p.stroke(210, 220, 240, alpha);
        p.line(left, y, right, y);
    }
    p.pop();

    // ========= 3) núcleo muy brillante (la “cuchillada” de luz) =========
    p.push();
    p.blendMode(p.ADD);

    const coreAlpha = 255 * flicker;

    p.stroke(255, 255, 255, coreAlpha);
    p.strokeWeight(4);
    p.line(cx, 0, cx, H);

    p.stroke(180, 235, 255, coreAlpha * 0.7);
    p.strokeWeight(2);
    for (let i = -4; i <= 4; i += 2) {
        p.line(cx + i, 0, cx + i, H);
    }

    p.pop();

    // ========= 4) chispas / rasguños diagonales =========
    p.push();
    p.strokeWeight(1);
    for (let i = 0; i < 80; i++) {
        const x   = p.random(left, right);
        const y   = p.random(0, H);
        const len = p.random(4, 18);
        const ang = p.random(-Math.PI / 3, Math.PI / 3);
        const x2  = x + Math.cos(ang) * len;
        const y2  = y + Math.sin(ang) * len;

        p.stroke(230, 255, 255, (120 + 80 * Math.random()) * flicker);
        p.line(x, y, x2, y2);
    }
    p.pop();
}

    // ================= CLASE GOTA =================
    class Raindrop {
        constructor(p) {
            this.p = p;
            this.x = p.random(p.width);
            this.y = 0;
            this.z = p.random(0, 666);
            this.len = p.map(this.z, 0, 20, 10, 20);
            this.yspeed = p.map(this.z, 0, 20, 4, 10);
        }

        update() {
            this.y += this.yspeed;
            let grav = this.p.map(this.z, 0, 20, 0.01, 0.2);
            this.yspeed += grav;
        }

        display() {
            this.p.stroke(138, 83, 300);
            this.p.line(this.x, this.y, this.x, this.y + this.len);
        }

        isOffScreen() {
            return this.y > this.p.height;
        }
    }

    // ================= CLASE RAYO =================
    class Lightning {
        constructor(p) {
            this.p = p;

            // camino principal del rayo: lista de puntos
            this.mainPath = [];

            // punto inicial arriba
            let x = p.random(p.width);
            let y = 0;
            this.mainPath.push({ x, y });

            // pasos cortos → rayo más suave y continuo
            let steps = p.int(p.random(25, 30));
            for (let i = 0; i < steps; i++) {
                x += p.random(-18, 18);  
                y += p.random(14, 18);   
                this.mainPath.push({ x, y });
            }

            // ramitas secundarias
            this.branches = [];
            for (let i = 3; i < this.mainPath.length - 4; i++) {
                if (p.random() < 0.22) {
                    let branch = [];
                    let bx = this.mainPath[i].x;
                    let by = this.mainPath[i].y;
                    branch.push({ x: bx, y: by });

                    let branchSteps = p.int(p.random(4, 7));
                    let dir = p.random() < 0.5 ? -1 : 1;

                    for (let k = 0; k < branchSteps; k++) {
                        bx += p.random(10, 20) * dir;
                        by += p.random(10, 20);
                        branch.push({ x: bx, y: by });
                    }
                    this.branches.push(branch);
                }
            }

            this.life = 0;
            this.maxLife = p.int(p.random(15, 20));
        }

        update() {
            this.life++;
        }

        display() {
            let t = this.life / this.maxLife; // 0 → 1
            let baseAlpha = this.p.map(t, 0, 1, 255, 80);

            this.p.push();
            this.p.strokeCap(this.p.ROUND);
            this.p.strokeJoin(this.p.ROUND);
            this.p.noFill();

            let ctx = this.p.drawingContext;
            ctx.save();
            ctx.shadowBlur = 12 * (1 - t);
            ctx.shadowColor = `rgba(235,235,255,${0.9 * (1 - t)})`;

            // camino principal
            this.p.stroke(230, 230, 240, baseAlpha);
            this.p.strokeWeight(1.6);
            this.p.beginShape();
            for (let pt of this.mainPath) {
                this.p.curveVertex(pt.x, pt.y);
            }
            this.p.endShape();

            // ramas
            this.p.stroke(220, 220, 235, baseAlpha * 0.7);
            this.p.strokeWeight(1.0);
            for (let branch of this.branches) {
                this.p.beginShape();
                for (let pt of branch) {
                    this.p.curveVertex(pt.x, pt.y);
                }
                this.p.endShape();
            }

            ctx.shadowBlur = 0;
            ctx.restore();
            this.p.pop();
        }

        flashStrength() {
            let t = this.life / this.maxLife;

            if (t < 0.1) {
                return this.p.map(t, 0.0, 0.2, 0.2, 1.0);
            } else if (t < 0.35) {
                return this.p.map(t, 0.2, 0.35, 1.0, 0.4);
            } else if (t < 0.5) {
                return this.p.map(t, 0.35, 0.5, 0.4, 0.9);
            } else if (t < 0.8) {
                return this.p.map(t, 0.5, 0.8, 0.9, 0.1);
            } else {
                return 0.0;
            }
        }

        isDead() {
            return this.life >= this.maxLife;
        }
    }


new p5(rainSketch, 'rain-sketch-container');






function generarRuidoBlanco(duracion = 5) {
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duracion;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // ==== ruido fragmentado en "beats" de milisegundos ====
    let i = 0;
    while (i < bufferSize) {
        // duración del segmento en milisegundos (ajusta rangos a tu gusto)
        const segMs = 20 + Math.random() * 50; // entre ~20 y 150 ms
        const segLen = Math.floor(sampleRate * (segMs / 1000));

        // ¿este segmento suena (ruido) o es silencio?
        const activo = Math.random() < 0.55; // 55% de segmentos con ruido

        for (let j = 0; j < segLen && i < bufferSize; j++, i++) {
            if (activo) {
                // ruido blanco en este segmento
                data[i] = (Math.random() * 2 - 1) * 0.7; // 0.7 para no saturar
            } else {
                // silencio total en este segmento
                data[i] = 0;
            }
        }
    }

    // ==== playback del buffer ====
    whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.loop = true; // se repite el patrón de beats
    whiteNoiseSource.connect(gainNode);
    whiteNoiseSource.start(0);
    whiteNoiseSource.stop(audioCtx.currentTime + duracion);

    checkAudioCompletion();  // Verificar el estado de los audios después de reproducir o pausar
}


function iluminarAsciiArt() {
    asciiArtElement.classList.add('glow');
}

function apagarIluminacionAsciiArt() {
    asciiArtElement.classList.remove('glow');
}

function checkAudioCompletion() {
    if (!audioSol.paused && !audioLuna.paused && whiteNoiseSource && !whiteNoiseSource.paused && oscilador) {
        enableMovementAndJump = true;
        iluminarAsciiArt();
    } else {
        enableMovementAndJump = false;
        apagarIluminacionAsciiArt();
    }
}












document.addEventListener('DOMContentLoaded', () => {

    const asciiArt    = document.getElementById('ascii-art');
    const portalImg   = document.getElementById('portal-img');
    const portalVoice = new Audio('voz_portal.mp3');
    portalVoice.volume = 1.0;

    let position = {
        top: 300,
        left: 700
    };

    // radios del portal
    const thresholdOuter  = 120;
    const thresholdFusion = 60;

    // estado del portal / trampa - USAR LA VARIABLE GLOBAL
    let portalLocked        = true;
    let insidePortalZone    = false;
    let fusionStartTime     = null;
    // trapped YA ESTÁ DEFINIDA GLOBALMENTE - NO LA VUELVAS A DECLARAR

    let isGlitching = false;
    let glitchTimeout = null;
    
    // timer de trampa
    let trapTimeoutStarted  = false;
    let trapTimeoutId       = null;


    function moveCharacter(event) {
        if (!enableMovementAndJump) return;
        if (trapped) return; // si ya está encerrado, no se mueve más

        const step = 30;
        const oldPos = { ...position };
        let newPos   = { ...position };

        switch (event.key) {
            case 'ArrowUp':
                newPos.top -= step;
                break;
            case 'ArrowDown':
                newPos.top += step;
                break;
            case 'ArrowLeft':
                newPos.left -= step;
                break;
            case 'ArrowRight':
                newPos.left += step;
                break;
            case ' ':
                // salto vertical (no cambia left)
                newPos.top -= 8 * step;
                setTimeout(() => {
                    position.top += 8 * step;
                    updatePosition();
                }, 100);
                break;
            default:
                return;
        }

        // BLOQUEO HORIZONTAL por la barrera de la imagen
        if (portalLocked && portalImg) {
            const asciiRect = asciiArt.getBoundingClientRect();
            const imgRect   = portalImg.getBoundingClientRect();

            const axOld  = asciiRect.left + asciiRect.width / 2;
            const ix     = imgRect.left + imgRect.width / 2;
            const deltaX = newPos.left - oldPos.left;
            const axNew  = axOld + deltaX;

            const crossing =
                (axOld < ix && axNew >= ix) ||
                (axOld > ix && axNew <= ix);

            if (crossing) {
                // 🔒 mientras portalLocked = true NO pasa al otro lado
                newPos.left = oldPos.left;
            }
        }

        position = newPos;
        updatePosition();
        // el control de distancias y tiempos se hace en checkPortalDistance()
    }

    function updatePosition() {
        asciiArt.style.top  = `${position.top}px`;
        asciiArt.style.left = `${position.left}px`;
        checkPortalDistance();
    }



    

  // Modificar checkPortalDistance para activar efectos de aura
function checkPortalDistance() {
    if (!portalImg) return;

    const asciiRect = asciiArt.getBoundingClientRect();
    const imgRect = portalImg.getBoundingClientRect();

    const ax = asciiRect.left + asciiRect.width / 4;
    const ay = asciiRect.top + asciiRect.height / 4;
    const ix = imgRect.left + imgRect.width / 4;
    const iy = imgRect.top + imgRect.height / 4;

    const dx = ax - ix;
    const dy = ay - iy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const isNear = dist < thresholdOuter;
    const canFuse = dist < thresholdFusion;

    // Activar/desactivar efectos de aura según distancia
    if (portalImg) {
        if (isNear) {
            portalImg.classList.add('near-portal');
        } else {
            portalImg.classList.remove('near-portal');
        }
    

    // Resto del código original...
}
    // ========= TIMER DE 20 s PARA LA TRAMPA =========
    if (isNear && !trapTimeoutStarted && !trapped) {
        trapTimeoutStarted = true;
        trapTimeoutId = setTimeout(() => {
            // Se ejecuta 20 s después de ACERCARSE
            // Si SIGUE cerca y no se ha fusionado → TRAMPA
            if (insidePortalZone && portalLocked && !trapped) {
                trapped = true;
                trapCharacterInBox();
                
                // Mostrar alerta o mensaje al usuario
                alert("¡Estas atrapado en la caja. Liberate ativando los 3 sonidos");
            }
        }, 10000); // 20 segundos
    }


    
    // ====== Lógica existente de fusión ======
    if (isNear) {
        if (!insidePortalZone) {
            insidePortalZone = true;
            portalLocked = true;
            fusionStartTime = canFuse ? performance.now() : null;
            
            if (!window.portalBreak) {
                triggerPortalGlitch();
            }
            
            try {
                portalVoice.currentTime = 0;
                portalVoice.play();
            } catch (e) {}
        } else {
            if (canFuse) {
                if (!fusionStartTime) {
                    fusionStartTime = performance.now();
                } else {
                    const elapsed = performance.now() - fusionStartTime;
                    if (elapsed >= 4000) {
                        finishPortalFusion();
                        // CANCELAR LA TRAMPA si se fusiona a tiempo
                        if (trapTimeoutId) {
                            clearTimeout(trapTimeoutId);
                            trapTimeoutStarted = false;
                        }
                    }
                }
            } else {
                fusionStartTime = null;
            }
        }
    } else {
        if (insidePortalZone) {
            insidePortalZone = false;
            fusionStartTime = null;

            try {
                portalVoice.pause();
                portalVoice.currentTime = 0;
            } catch (e) {}

            glitchAudioStop();
        }

        // Si se aleja, reseteamos el timer de trampa
        if (trapTimeoutId) {
            clearTimeout(trapTimeoutId);
            trapTimeoutStarted = false;
        }
    }
}


///----------------------------------------------------////

    function finishPortalFusion() {
        // ya cumplió 4s en la zona interna (quieto encima)
        insidePortalZone = true;   // sigue cerca pero ya “fusionado”
        fusionStartTime  = null;
        portalLocked     = false;  // 🔓 ahora PUEDE cruzar la imagen

        // apagar voz
        try {
            portalVoice.pause();
            portalVoice.currentTime = 0;
        } catch (e) {}

        // apagar glitch (visual + audio)
        glitchAudioStop(); // esto pone window.portalBreak = false

        // si se fusiona, cancelamos cualquier trampa pendiente
        if (trapTimeoutId) {
            clearTimeout(trapTimeoutId);
            trapTimeoutId = null;
        }
        trapTimeoutStarted = false;
    }



//---------------------------------atrapar..........
function trapCharacterInBox() {
    const box = document.getElementById('wooden-box');
    const asciiArt = document.getElementById('ascii-art');
    
    if (!box || !asciiArt) return;

    // Ocultar personaje
    asciiArt.style.display = 'none';

    // Mostrar caja en la MISMA POSICIÓN del personaje
    box.style.display = 'block';
    box.style.left = asciiArt.style.left;
    box.style.top = asciiArt.style.top;
    box.style.color = '#f6c504ff';

    // Desactivar movimiento
    enableMovementAndJump = false;
    trapped = true;

    console.log("🔒 ATRAPADO SILENCIOSAMENTE - Movimiento:", enableMovementAndJump);

    // Apagar efectos
    try {
        portalVoice?.pause();
        portalVoice.currentTime = 0;
    } catch (e) {}

    glitchAudioStop?.();

    if (currentIntervalId) {
        clearInterval(currentIntervalId);
        currentIntervalId = null;
    }
    
    // NO HAY ALERTA, NO HAY MENSAJE - SOLO SILENCIO
}
    // ========= TIMER PARA REAPARECER DESPUÉS DE 6 SEGUNDOS =========
    
// este listener puedes dejarlo como lo tienes
document.addEventListener('keydown', moveCharacter);

});

// ================== PORTAL BREAK (FLAG + AUDIO GLITCH) ==================
// ================== PORTAL BREAK (FLAG + AUDIO GLITCH) ==================
// el sketch de lluvia lee window.portalBreak
window.portalBreak = false;
let portalBreakFrames   = 0;
let portalGlitchInterval = null;



// Modificar la función triggerPortalGlitch para activar el aura intensa
function triggerPortalGlitch() {
    if (!audioCtx) {
        startAudioContext();
    }
    if (!audioCtx || !gainNode) return;

    if (window.portalBreak) return;

    window.portalBreak = true;
    portalBreakFrames = 0;

    // Activar aura intensa en la foto
    const portalImg = document.getElementById('portal-img');
    if (portalImg) {
        portalImg.classList.add('glitch-active');
    }

    // Audio glitch
    glitchAudioStart();
    
    // Glitch visual
    startGlitch();
}



//------------------------------
function glitchAudioStart() {
    if (!audioCtx || !gainNode) return;

    if (portalGlitchInterval) {
        clearInterval(portalGlitchInterval);
    }

    // INTERVALO MUY RÁPIDO - cada 10ms
    portalGlitchInterval = setInterval(() => {
        const now = audioCtx.currentTime;

        // Cambios MUY BRUSCOS y RÁPIDOS
        const g = Math.random() > 0.3 ? Math.random() * 1.5 : 0.05; // MÁS EXTREMO
        try {
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(g, now);
        } catch (e) {}

        // Jitter MUY RÁPIDO y EXTREMO
        if (oscilador && oscilador.frequency) {
            const base = oscilador.frequency.value || 440;
            const jitter = (Math.random() - 0.5) * 6000; // MÁS EXTREMO
            const target = Math.max(10, Math.min(20000, base + jitter));
            try {
                oscilador.frequency.setValueAtTime(target, now);
            } catch (e) {}
        }
    }, 10); // MUY RÁPIDO - 10ms
}


//------------------------------
// Modificar glitchAudioStop para quitar el aura intensa
function glitchAudioStop() {
    if (!audioCtx || !gainNode) return;

    if (portalGlitchInterval) {
        clearInterval(portalGlitchInterval);
        portalGlitchInterval = null;
    }

    const now = audioCtx.currentTime;
    try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.15);
    } catch (e) {}

    // Quitar aura intensa
    const portalImg = document.getElementById('portal-img');
    if (portalImg) {
        portalImg.classList.remove('glitch-active');
    }

    window.portalBreak = false;
}

// Modificar finishPortalFusion para quitar el aura
function finishPortalFusion() {
    insidePortalZone = true;
    fusionStartTime = null;
    portalLocked = false;

    try {
        portalVoice.pause();
        portalVoice.currentTime = 0;
    } catch (e) {}

    // Quitar aura intensa al completar fusión
    const portalImg = document.getElementById('portal-img');
    if (portalImg) {
        portalImg.classList.remove('glitch-active');
    }

    glitchAudioStop();

    if (trapTimeoutId) {
        clearTimeout(trapTimeoutId);
        trapTimeoutStarted = false;
    }
}





//------------------------------
function startGlitch() {
    const asciiArt = document.getElementById('ascii-art');
    if (!asciiArt || trapped) return;

    isGlitching = true;
    asciiArt.classList.add('glitch');

    // 🔥 Parpadeo SUPER rápido
    const BLINK_MS = 15; // prueba 15; si quieres aún más bestia, baja a 10

    const blinkInterval = setInterval(() => {
        if (!isGlitching || trapped) {
            clearInterval(blinkInterval);
            asciiArt.style.opacity   = '1';
            asciiArt.style.filter    = 'none';
            asciiArt.style.transform = 'translateX(0)';
            return;
        }

        const r = Math.random();

        if (r < 3.33) {
            // parpadeo de brillo/transparencia
            asciiArt.style.opacity = (0.13 + Math.random() * 0.7).toString();
        } else if (r < 3.66) {
            // cambio brutal de color / contraste
            asciiArt.style.filter =
                `hue-rotate(${Math.random() * 80 - 40}deg) contrast(${110 + Math.random() * 120}%)`;
        } else {
            // sacudida en X/Y
            const dx = Math.random() * 8 - 4;
            const dy = Math.random() * 4 - 2;
            asciiArt.style.transform = `translate(${dx}px, ${dy}px)`;
        }

    }, BLINK_MS);

    // Timer para que después de unos segundos te encierre en la caja
    if (glitchTimeout) {
        clearTimeout(glitchTimeout);
    }

    glitchTimeout = setTimeout(() => {
        if (isGlitching && !trapped) {
            // Apago el glitch sin llamar a ninguna función inexistente
            isGlitching = false;

            const asciiArt2 = document.getElementById('ascii-art');
            if (asciiArt2) {
                asciiArt2.classList.remove('glitch');
                asciiArt2.style.opacity   = '1';
                asciiArt2.style.filter    = 'none';
                asciiArt2.style.transform = 'translateX(0)';
            }

            // Luego sí te encierra en la caja
            trapCharacterInBox();
        }
    }, 8000); // 8s de glitch antes de caer en la caja (ajusta si quieres)
}



function resetGame() {
    trapped = false;
    enableMovementAndJump = true;
    
    const box = document.getElementById('wooden-box');
    const asciiArt = document.getElementById('ascii-art');
    
    // Ocultar caja
    if (box) {
        box.style.display = 'none';
        box.style.color = '#ff9c2b'; // Restaurar color original
    }
    
    // Mostrar y restaurar el personaje principal
    if (asciiArt) {
        asciiArt.style.display = 'block';
        asciiArt.style.position = 'absolute';
        asciiArt.style.top = '300px';
        asciiArt.style.left = '700px';
        asciiArt.style.fontSize = '3px';
        asciiArt.style.zIndex = '20000';
        asciiArt.classList.remove('glitch');
    }
    
    // Restaurar posición global
    position = { top: 300, left: 700 };
    updatePosition();
    
    // Limpiar timers de trampa
    if (trapTimeoutId) {
        clearTimeout(trapTimeoutId);
        trapTimeoutStarted = false;
    }
    
    // Limpiar timer de glitch
    if (glitchTimeout) {
        clearTimeout(glitchTimeout);
        isGlitching = false;
    }
    
    // Apagar efectos de audio del glitch
    if (typeof glitchAudioStop === 'function') {
        glitchAudioStop();
    }
    
    console.log("JUEGO REINICIADO - Personaje liberado");
}

// Agregar tecla R para reset
document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        resetGame();
        console.log("Reiniciando juego con tecla R...");
    }
});



// Agregar esta variable global con el audio del glitch
let glitchVoice = new Audio('voz.mp3');
glitchVoice.volume = 2.5;

// Modificar triggerPortalGlitch para reproducir el audio
function triggerPortalGlitch() {
    if (!audioCtx) {
        startAudioContext();
    }
    if (!audioCtx || !gainNode) return;

    if (window.portalBreak) return;

    window.portalBreak = true;
    portalBreakFrames = 0;

    // Activar aura intensa en la foto
    const portalImg = document.getElementById('portal-img');
    if (portalImg) {
        portalImg.classList.add('glitch-active');
    }

    // REPRODUCIR AUDIO DEL GLITCH
    try {
        glitchVoice.currentTime = 0;
        glitchVoice.play().catch(e => console.log('Error reproduciendo voz glitch:', e));
    } catch (e) {
        console.log('Error con audio glitch:', e);
    }

    // Audio glitch
    glitchAudioStart();
    
    // Glitch visual
    startGlitch();
}




// ====== AGREGAR AL FINAL DEL CÓDIGO ======
// Monitor en tiempo real del estado
setInterval(function() {
    console.log("📊 ESTADO ACTUAL - trapped:", trapped, 
                "movimiento:", enableMovementAndJump, 
                "portalLocked:", portalLocked,
                "posición:", position);
}, 5000);


// ====== SISTEMA DE ALERTA DE TRAMPA ======
let trapAlert = document.getElementById('trap-alert');
let solStatus = document.getElementById('sol-status');
let lunaStatus = document.getElementById('luna-status');
let catStatus = document.getElementById('cat-status');

// Función para mostrar la alerta cuando el jugador es atrapado
function mostrarAlertaTrampa() {
    console.log("🔒 MOSTRANDO ALERTA DE TRAMPA");
    trapAlert.style.display = 'flex';
    
    // Actualizar estado inicial
    actualizarEstadoAudios();
    
    // Verificar liberación cada 100ms
    const checkInterval = setInterval(() => {
        actualizarEstadoAudios();
        
        if (solActivo && lunaActiva && ruidoBlancoActivo) {
            clearInterval(checkInterval);
            ocultarAlertaTrampa();
            liberarInmediatamente();
        }
        
        // Si ya no está atrapado, limpiar intervalo
        if (!trapped) {
            clearInterval(checkInterval);
            ocultarAlertaTrampa();
        }
    }, 100);
}

// Función para ocultar la alerta
function ocultarAlertaTrampa() {
    trapAlert.style.display = 'none';
}

// Función para actualizar el estado visual de los audios
function actualizarEstadoAudios() {
    // Actualizar estado del Sol
    if (solActivo) {
        solStatus.textContent = '✅ ACTIVO';
        solStatus.className = 'status-completed';
    } else {
        solStatus.textContent = '❌ INACTIVO';
        solStatus.className = 'status-pending';
    }
    
    // Actualizar estado de la Luna
    if (lunaActiva) {
        lunaStatus.textContent = '✅ ACTIVO';
        lunaStatus.className = 'status-completed';
    } else {
        lunaStatus.textContent = '❌ INACTIVO';
        lunaStatus.className = 'status-pending';
    }
    
    // Actualizar estado del Gato
    if (ruidoBlancoActivo) {
        catStatus.textContent = '✅ ACTIVO';
        catStatus.className = 'status-completed';
    } else {
        catStatus.textContent = '❌ INACTIVO';
        catStatus.className = 'status-pending';
    }
}

// ====== MODIFICAR resetGame PARA OCULTAR ALERTA ======
// REEMPLAZA tu función resetGame actual con esta:
function resetGame() {
    trapped = false;
    enableMovementAndJump = true;
    
    const box = document.getElementById('wooden-box');
    const asciiArt = document.getElementById('ascii-art');
    
    // Ocultar caja
    if (box) {
        box.style.display = 'none';
        box.style.color = '#ff9c2b';
    }
    
    // Mostrar y restaurar el personaje principal
    if (asciiArt) {
        asciiArt.style.display = 'block';
        asciiArt.style.position = 'absolute';
        asciiArt.style.top = '300px';
        asciiArt.style.left = '700px';
        asciiArt.style.fontSize = '3px';
        asciiArt.style.zIndex = '20000';
        asciiArt.classList.remove('glitch');
    }
    
    // Restaurar posición global
    position = { top: 300, left: 700 };
    updatePosition();
    
    // Ocultar alerta
    ocultarAlertaTrampa();
    
    // Limpiar timers de trampa
    if (trapTimeoutId) {
        clearTimeout(trapTimeoutId);
        trapTimeoutStarted = false;
    }
    
    // Limpiar timer de glitch
    if (glitchTimeout) {
        clearTimeout(glitchTimeout);
        isGlitching = false;
    }
    
    // Apagar efectos de audio del glitch
    if (typeof glitchAudioStop === 'function') {
        glitchAudioStop();
    }
    
    // Apagar todos los audios
    if (audioSol) {
        audioSol.pause();
        audioSol.currentTime = 0;
        solActivo = false;
    }
    
    if (audioLuna) {
        audioLuna.pause();
        audioLuna.currentTime = 0;
        lunaActiva = false;
    }
    
    if (whiteNoiseSource) {
        whiteNoiseSource.stop();
        ruidoBlancoActivo = false;
    }
    
    console.log("JUEGO REINICIADO - Personaje liberado");
}


