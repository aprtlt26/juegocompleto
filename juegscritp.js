
  // Crear instancia de Audio para el sol
  let audioSol = new Audio('ambient.wav');
  audioSol.loop = true;  // Habilitar reproducción en bucle
  audioSol.volume = 1.0;  // Establecer el volumen al máximo

  document.getElementById('ascii-sol').addEventListener('click', function() {
      // Comprueba si el audio está reproduciéndose y alterna su reproducción
      if (audioSol.paused) {
          audioSol.play();  // Comienza a reproducir el audio
      } else {
          audioSol.pause();
          audioSol.currentTime = 0;  // Reinicia el audio si ya estaba reproduciendo
      }
  });

  // Crear instancia de Audio para la luna
  let audioLuna = new Audio('0S.wav');
  audioLuna.loop = true;  // Habilitar reproducción en bucle
  audioLuna.volume = 1.0;  // Establecer el volumen al máximo

  document.getElementById('ascii-luna').addEventListener('click', function() {
      // Comprueba si el audio está reproduciéndose y alterna su reproducción
      if (audioLuna.paused) {
          audioLuna.play();  // Comienza a reproducir el audio
      } else {
          audioLuna.pause();
          audioLuna.currentTime = 0;  // Reinicia el audio si ya estaba reproduciendo
      }
  });

  let oscilador;
  let gainNode;
  let compressor;

  let whiteNoiseSource;
  let whiteNoiseGain;
  let shuffleInterval = null;
  let currentIntervalId = null;
let currentIntervalSpeed = 50; // Velocidad inicial del intervalo en milisegundos


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
  window.onload = function() {
      alert('Toca la pantalla para activar el sonido y los permisos.');
      // Añade un listener al documento que esperará que el usuario toque la pantalla
      document.addEventListener('touchend', iniciarInteraccionUsuario);
  };


  function toggleIntervalSpeed() {
if (currentIntervalId !== null) {
  clearInterval(currentIntervalId); // Detiene el intervalo actual
}

// Cambia la velocidad del intervalo
currentIntervalSpeed = currentIntervalSpeed === 50 ? 550 : 50;

// Reinicia el intervalo con la nueva velocidad
currentIntervalId = setInterval(shuffleAsciiArtAndSound, currentIntervalSpeed);
}




function shuffleAsciiArtAndSound() {
  
  
  let newText = '';
  const characters = ['@', '#', '$', '%', '&', '*', '-', '+', '=', '?', ';', ':', ',', '.'];


  
  for (let char of asciiArtElement.innerText) {
      if (characters.includes(char)) {
          let randomChar = characters[Math.floor(Math.random() * characters.length)];
          newText += randomChar;
      } else {
          newText += char;

          
      }
  }


  
  asciiArtElement.innerText = newText;
  oscilador.frequency.value = Math.random() * (100 - 2200) + 100;
}





document.body.addEventListener('click', function() {
if (!audioCtx) {
  startAudioContext();
  // Establece el intervalo para mezclar los caracteres del arte ASCII principal
  if (currentIntervalId === null) {
      currentIntervalId = setInterval(shuffleAsciiArtAndSound, currentIntervalSpeed);
  shuffleAsciiCat(); // Cambia los caracteres del gato ASCII inmediatamente
  setInterval(shuffleAsciiCat, 10); // Continúa cambiando los caracteres del gato ASCII
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

const frequency = (event.offsetX / this.offsetWidth) * (2000 - 100) + 100;
oscilador.frequency.value = frequency; // Ajusta la frecuencia según la posición del mouse


const gainValue =   0.0 - (event.offsetY / this.offsetHeight);
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
      return String.fromCharCode(int(random(65, 190))); // Letras mayúsculas A-Z
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

  compressor.threshold.setValueAtTime(190, audioCtx.currentTime);
  compressor.knee.setValueAtTime(80, audioCtx.currentTime); // Hace la transición más suave
  compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.29, audioCtx.currentTime);
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

let frecuencia = map(x, 0, window.innerWidth, 20, 100);
let duracionNota = map(y, 0, window.innerHeight, 0.1, 0.2);

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
// Supongamos que tienes un elemento con id 'ascii-sol' como este:
// <pre id="ascii-sol">Aquí va tu arte ASCII del sol</pre>

// Variable para almacenar el ID del intervalo para poder detenerlo más tarde si es necesario
let shuffleIntervalId = null;

document.body.addEventListener('click', function() {
// Comprueba si el intervalo ya está establecido
if (!shuffleIntervalId) {
  shuffleIntervalId = setInterval(function() {
      shuffleAscii(document.getElementById('ascii-sol'));
      shuffleAscii(document.getElementById('ascii-luna'));
      shuffleAscii(document.getElementById('ascii-cat'));

  }, 30); // Cambia los caracteres cada 100 milisegundos
}
});





function shuffleAscii(element) {
let newText = '';
const characters = ['@', '#', '$', '%', '&', '*', '-', '+', '=', '?', ';', ':', ',', '.'];

for (let char of element.innerText) {
  if (characters.includes(char)) {
      let randomChar = characters[Math.floor(Math.random() * characters.length)];
      newText += randomChar;
  } else {
      newText += char;
  }
}

element.innerText = newText;
}







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
  const delay = audioCtx.createDelay(1.0);
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

// Define la nueva instancia de p5.js para el sketch de las barras de color
new p5(function(p) {
const barSize = 50; // Tamaño de cada "barra" cuadrada
let lastBarIndex = -1; // Último índice de la barra dibujada

p.setup = function() {
let canvas = p.createCanvas(90, 200); // Dimensiones del canvas
canvas.parent('color-bar-sketch-container'); // Asigna el contenedor
canvas.style('opacity', '0.2'); // Establece la opacidad del canvas

p.colorMode(p.HSB, p.width, p.width, p.width); // Modo de color HSB basado en el ancho
p.noStroke();
p.background(0);
};

p.draw = function() {
let mouseXAdjusted = p.mouseX - (p.width / 2); // Ajusta mouseX para que el centro sea 0
let mouseYAdjusted = p.mouseY - (p.height / 2); // Ajusta mouseY para que el centro sea 0
// Calcula la "barra" basada en la distancia más corta al eje X o Y desde el centro
let whichBarIndex = p.int(p.min(p.abs(mouseXAdjusted), p.abs(mouseYAdjusted)) / barSize);

if (whichBarIndex !== lastBarIndex) {
// Calcula la posición inicial de la barra cuadrada
let startX = (p.width / 2) - whichBarIndex * barSize;
let startY = (p.height / 2) - whichBarIndex * barSize;

for (let i = 0; i <= whichBarIndex; i++) {
  // Dibuja cada "barra" cuadrada a lo largo de la diagonal
  let x = startX + i * barSize;
  let y = startY + i * barSize;
  
  p.fill(p.mouseX, p.width, p.width); // Color basado en la posición del ratón
  p.rect(x, y, barSize, barSize); // Dibuja el rectángulo
}
lastBarIndex = whichBarIndex;
}
};

}, 'color-bar-sketch-container'); // Asegúrate de que este ID coincida con el del contenedor


new p5(function(p) {
const barHeight = 20; // La altura de cada barra será de 20
let lastBar = -1; // Última barra actualizada

p.setup = function() {
let canvas = p.createCanvas(220, 200);
canvas.parent('color-bar-sketch-container');
canvas.style('opacity', '0.5');

p.colorMode(p.HSB, p.width, p.width, p.width);
p.noStroke();
p.background(0);
};

p.draw = function() {
let whichBar = p.int(p.mouseY / barHeight);
if (whichBar !== lastBar) {
  let barY = whichBar * barHeight;
  p.fill(p.mouseX, p.width, p.width);
  p.rect(0, barY, p.width, barHeight);
  lastBar = whichBar;
}

// Glitch effect
if (p.random() < 0.2) { // 10% chance of glitch effect
  applyGlitch(p);
}
};

function applyGlitch(p) {
// Escoge un número aleatorio de barras para aplicar el glitch
const glitchBars = p.int(p.random(1, 7));
for (let i = 0; i < glitchBars; i++) {
  const glitchY = p.int(p.random(p.height / barHeight)) * barHeight;
  const glitchHeight = p.random(barHeight / 4, barHeight * 5);
  const glitchWidth = p.random(p.width * 0.1, p.width);
  const glitchX = p.random(p.width - glitchWidth);
  const r = p.random(255);
  const g = p.random(255);
  const b = p.random(255);

  p.fill(r, g, b);
  p.rect(glitchX, glitchY, glitchWidth, glitchHeight);
}
}

}, 'color-bar-sketch-container');


document.addEventListener('keydown', function(event) {
if (!audioCtx) startAudioContext(); // Inicia el contexto de audio si aún no está activo

switch(event.key) {
  case 's':
  case 'S':
      // Alternar audio del sol
      togglePlay('ascii-sol', 'ambient.wav');
      break;
  case 'l':
  case 'L':
      // Alternar audio de la luna
      togglePlay('ascii-luna', '0S.wav');
      break;
  case ' ':
      // Mostrar/ocultar el gato ASCII y gestionar ruido blanco
      toggleAsciiCatAndWhiteNoise();
      event.preventDefault(); // Evitar que la barra espaciadora haga scroll

      break;
  case 'ArrowUp':
  case 'ArrowDown':
  case 'ArrowLeft':
  case 'ArrowRight':
      // Manejar el movimiento del cursor con flechas
      handleArrowKeys(event.key);
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


 
  let rainSketch = function(p) {
      let raindrops = [];

      p.setup = function() {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.frameRate(100);
      };

      p.draw = function() {
          p.clear();
          for (let i = raindrops.length - 1; i >= 0; i--) {
              raindrops[i].update();
              raindrops[i].display();
              if (raindrops[i].isOffScreen()) {
                  raindrops.splice(i, 1);
              }
          }

          if (p.frameCount % 2 === 0) {
              raindrops.push(new Raindrop(p));
          }
      };

      class Raindrop {
          constructor(p) {
              this.p = p;
              this.x = p.random(p.width);
              this.y = 0;
              this.z = p.random(0, 20);
              this.len = p.map(this.z, 0, 20, 10, 20);
              this.yspeed = p.map(this.z, 0, 20, 4, 10);
          }

          update() {
              this.y += this.yspeed;
              let grav = p.map(this.z, 0, 20, 0.01, 0.2);
              this.yspeed += grav;
          }

          display() {
              p.stroke(138, 43, 300);
              p.line(this.x, this.y, this.x, this.y + this.len);
          }

          isOffScreen() {
              return this.y > this.p.height;
          }
      }
  };

  new p5(rainSketch, 'rain-sketch-container');


  document.addEventListener('DOMContentLoaded', () => {
    const asciiArt = document.getElementById('ascii-art');
    let position = {
        top: 300,
        left: 700
    };

    function moveCharacter(event) {
        const step = 30; // cantidad de píxeles para mover el personaje
        switch (event.key) {
            case 'ArrowUp':
                position.top -= step;
                break;
            case 'ArrowDown':
                position.top += step;
                break;
            case 'ArrowLeft':
                position.left -= step;
                break;
            case 'ArrowRight':
                position.left += step;
                break;
            case ' ':
                position.top -= 8 * step; // salto
                setTimeout(() => {
                    position.top += 8 * step; // vuelve a bajar
                    updatePosition();
                }, 100);
                break;
        }
        updatePosition();
    }

    function updatePosition() {
        asciiArt.style.top = `${position.top}px`;
        asciiArt.style.left = `${position.left}px`;
    }

    document.addEventListener('keydown', moveCharacter);
});

document.addEventListener('DOMContentLoaded', () => {
    const asciiArt = document.getElementById('ascii-art');
    const balls = [document.getElementById('ball1'), document.getElementById('ball2'), document.getElementById('ball3')];
    let glowCount = 0;
    let isAtRightEdge = false;
    let isJumping = false;

    function updateBallPosition(ball, speed, delay) {
        let ballLeft = window.innerWidth;
        let ballTop = Math.random() * (window.innerHeight - 50);
        let hasIlluminated = false;

        function moveBall() {
            const artRect = asciiArt.getBoundingClientRect();
            ballLeft -= speed;
            ball.style.left = `${ballLeft}px`;
            ball.style.top = `${ballTop}px`;

            // Check for collision with the top of the ASCII art
            const ballRect = ball.getBoundingClientRect();
            if (!hasIlluminated && ballRect.left < artRect.right && ballRect.right > artRect.left && ballRect.top < artRect.top + 20 && ballRect.bottom > artRect.top) {
                asciiArt.classList.add('glow');
                glowCount++;
                hasIlluminated = true;
                setTimeout(() => {
                    if (glowCount < 3) {
                        asciiArt.classList.remove('glow');
                    } else {
                        asciiArt.classList.add('permanent-glow');
                    }
                }, 2000);

                if (glowCount === 3) {
                    moveAsciiArtToRight();
                }
            }

            // Reset ball position when it goes out of the screen
            if (ballLeft < -50) {
                ballLeft = window.innerWidth;
                ballTop = Math.random() * (window.innerHeight - 50);
                hasIlluminated = false;
            }
        }

        setTimeout(() => {
            const intervalId = setInterval(moveBall, 10); // Increase speed
        }, delay);
    }

    function moveAsciiArtToRight() {
        if (!isAtRightEdge) {
            // Move ASCII art to the right margin of the page
            asciiArt.style.left = `${window.innerWidth - asciiArt.offsetWidth}px`;
            asciiArt.style.top = `50px`;  // Move to a higher position for the jump
            isAtRightEdge = true;
        }

        // Enable long jump
        document.addEventListener('keydown', handleLongJump);
    }

    function handleLongJump(e) {
        if (e.key === ' ' && isAtRightEdge && !isJumping) {
            const jumpHeight = 600;  // Increase jump height
            const jumpDistance =-150;  // Increase jump distance
            isJumping = true;
            let jumpSpeed = 20;  // Adjust jump speed
            let currentJumpHeight = 0;
            let jumpInterval = setInterval(() => {
                if (currentJumpHeight < jumpHeight) {
                    asciiArt.style.top = `${asciiArt.offsetTop - jumpSpeed}px`;
                    asciiArt.style.left = `${asciiArt.offsetLeft + jumpSpeed}px`;  // Move right while jumping
                    currentJumpHeight += jumpSpeed;
                } else {
                    clearInterval(jumpInterval);
                    let fallInterval = setInterval(() => {
                        if (currentJumpHeight > 0) {
                            asciiArt.style.top = `${asciiArt.offsetTop + jumpSpeed}px`;
                            asciiArt.style.left = `${asciiArt.offsetLeft + jumpSpeed}px`;  // Move right while falling
                            currentJumpHeight -= jumpSpeed;
                        } else {
                            clearInterval(fallInterval);
                            isJumping = false;
                        }
                    }, 30);
                }
            }, 30);
        }
    }

    balls.forEach((ball, index) => {
        updateBallPosition(ball, 8, index * 3000); // Adjust speed and delay as needed
    });
});


