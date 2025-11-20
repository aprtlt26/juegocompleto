// ====== AUDIO GLOBAL (MUNDO + OSCILADOR BASE) ======
let audioCtx;
let oscilador;
let gainNode;
let compressor;
let delayNode;
let delayGain;
let lettersGain;  // ⬅️ ganancia solo para letras / árbol / mouse

let reverbNode;

let enableMovementAndJump = true;

let whiteNoiseSource;
let whiteNoiseGain;   // ⬅️ AHORA SÍ SE USA
let shuffleInterval = null;
let currentIntervalId = null;
let currentIntervalSpeed = 4;
let collisionCount = 0;

// Ganancia base del mundo, controlada por el slider
let worldGainBase = 0.1;

// === CONTROL GLOBAL DEL AUDIO DEL MOUSE ===
let mouseAudioEnabled = true;

        
      // === CONTROL GLOBAL DEL AUDIO DEL MOUSE ===


    initMIDI();             // engancha el teclado MIDI


let midiOsc  = null;


function startAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // ---- MASTER DEL MUNDO ASCII ----
       // ---- MASTER DEL MUNDO ASCII ----
gainNode   = audioCtx.createGain();
compressor = audioCtx.createDynamicsCompressor();

// Compresor
compressor.threshold.setValueAtTime(-50,  audioCtx.currentTime);
compressor.knee.setValueAtTime(100,       audioCtx.currentTime);
compressor.ratio.setValueAtTime(12,       audioCtx.currentTime);
compressor.attack.setValueAtTime(0,       audioCtx.currentTime);
compressor.release.setValueAtTime(1.25,   audioCtx.currentTime);

// Volumen maestro del mundo (slider world-gain → worldGainBase)
gainNode.gain.setValueAtTime(worldGainBase, audioCtx.currentTime);

// ⬅️ NUEVO: ganancia interna para letras / árbol (controlada por mouse)
lettersGain = audioCtx.createGain();
lettersGain.gain.setValueAtTime(1.0, audioCtx.currentTime);

// ---- GAIN ESPECÍFICO PARA EL RUIDO BLANCO ----
whiteNoiseGain = audioCtx.createGain();
whiteNoiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime); // arranca audible
whiteNoiseGain.connect(gainNode);


// ---- OSCILADOR BASE PARA LETRAS / GLITCH ----
oscilador = audioCtx.createOscillator();
oscilador.type = 'sine';
oscilador.frequency.setValueAtTime(220, audioCtx.currentTime);

// ---- DELAY SUAVE EN PARALELO ----
delayNode = audioCtx.createDelay(0.5);
delayGain = audioCtx.createGain();
delayNode.delayTime.setValueAtTime(0.2,  audioCtx.currentTime);
delayGain.gain.setValueAtTime(0.1,       audioCtx.currentTime);

// Conexiones:
// oscilador → lettersGain → gainNode → compressor → destino
oscilador.connect(lettersGain);
lettersGain.connect(gainNode);
gainNode.connect(compressor);
compressor.connect(audioCtx.destination);

// rama de delay: gainNode → delay → delayGain → compressor
gainNode.connect(delayNode);
delayNode.connect(delayGain);
delayGain.connect(compressor);

oscilador.start();

    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
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
    startAudioContext();
    solicitarPermisoMicrofono();

    // 🔹 activar la máscara negra deslizándose

    }



// Muestra un alerta y luego espera una interacción del usuario para iniciar todo
// ====== SISTEMA DE ALERTA DE INICIO ESTILIZADO ======
function mostrarAlertaInicio() {
    const startAlert = document.getElementById('start-alert');
    if (startAlert) {
        startAlert.style.display = 'flex';
    }
}

// ====== AGREGAR NUEVO AUDIO DE INTRO ======
let introAudio = new Audio('intro.mp3');
introAudio.volume = 1.0;

/// ====== MODIFICAR LA INICIALIZACIÓN DEL AUDIO DE INTRO ======


// ====== MODIFICAR cerrarAlertaInicio() ======
function cerrarAlertaInicio() {
    const startAlert = document.getElementById('start-alert');
    if (startAlert) {
        startAlert.style.display = 'none';
    }

    // Inicializa audio y permisos
    startAudioContext();
    solicitarPermisoMicrofono();

    const mask = document.getElementById('reveal-mask');
    if (mask) {
        mask.style.display = 'block';
        mask.classList.add('is-revealing');

        mask.addEventListener('animationstart', () => {

            try {
                // Crear el audio solo cuando se necesite
                if (!introAudio) {
                    introAudio = new Audio('intro.mp3');
                    introAudio.volume = 1.0;
                    
                    // Configurar para que se reproduzca cuando esté listo
                    introAudio.addEventListener('canplaythrough', function() {
                        introAudio.play().catch(e => {
                            console.log('Error reproduciendo intro (canplaythrough):', e);
                        });
                    });
                    
                    // Cargar el audio
                    introAudio.load();
                } else {
                    // Si ya existe, reproducir desde el inicio
                    introAudio.currentTime = 0;
                    introAudio.play().catch(e => {
                        console.log('Error reproduciendo intro:', e);
                    });
                }
            } catch (e) {
                console.log('Error con audio intro:', e);
            }
        }, { once: true });

        mask.addEventListener('animationend', () => {
            try {
                if (introAudio) {
                    introAudio.pause();
                    introAudio.currentTime = 0;
                }
            } catch (e) {
                console.log('Error deteniendo intro:', e);
            }
            mask.style.display = 'none';
        }, { once: true });
    }
}

// ====== MODIFICAR EL EVENT LISTENER DE LA MÁSCARA ======
document.addEventListener('DOMContentLoaded', () => {
    const mask = document.getElementById('reveal-mask');
    if (!mask) return;

    mask.addEventListener('animationstart', () => {
        if (!audioCtx && typeof startAudioContext === 'function') {
            startAudioContext();
        }
        
        try {
            if (!introAudio) {
                introAudio = new Audio('intro.mp3');
                introAudio.volume = 1.0;
                
                introAudio.addEventListener('canplaythrough', function() {
                    introAudio.play().catch(e => {
                        console.log('Error reproduciendo intro (DOM):', e);
                    });
                });
                
                introAudio.load();
            } else {
                introAudio.currentTime = 0;
                introAudio.play().catch(e => {
                    console.log('Error reproduciendo intro (DOM):', e);
                });
            }
        } catch (e) {
            console.log('Error con audio intro (DOM):', e);
        }
    });

    mask.addEventListener('animationend', () => {
        try {
            if (introAudio) {
                introAudio.pause();
                introAudio.currentTime = 0;
            }
        } catch (e) {
            console.log('Error deteniendo intro (DOM):', e);
        }
        mask.style.display = 'none';
    });
});

// ====== AGREGAR FUNCIÓN PARA VERIFICAR SI EL AUDIO SE PUEDE REPRODUIR ======
function verificarAudioIntro() {
    if (!introAudio) {
        console.log("❌ introAudio no está inicializado");
        return false;
    }
    
    console.log("🔊 Estado de introAudio:", {
        readyState: introAudio.readyState,
        paused: introAudio.paused,
        currentTime: introAudio.currentTime,
        volume: introAudio.volume
    });
    
    return introAudio.readyState >= 2; // 2 = HAVE_CURRENT_DATA, 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
}

// ====== DEBUG EN CONSOLA ======
// Agrega esto para debuggear el audio de intro
setInterval(() => {
    if (introAudio) {
        console.log("🎵 DEBUG introAudio - readyState:", introAudio.readyState, 
                   "paused:", introAudio.paused, 
                   "currentTime:", introAudio.currentTime.toFixed(2));
    }
}, 3000);

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
    console.log(" ESTADO - Trapped:", trapped, "Movimiento:", enableMovementAndJump);
    
    const box = document.getElementById('wooden-box');
    
    
    const asciiArt = document.getElementById('ascii-art');

    console.log(" ELEMENTOS - Caja visible:", box?.style.display, "Personaje visible:", asciiArt?.style.display);
}

// Ejecutar debug cada 2 segundos
setInterval(debugEstado, 2000);

// Agrega este debug para monitorear el sintetizador
function debugSintetizador() {
    console.log("🎹 DEBUG SINTETIZADOR:", {
        vocesActivas: Object.keys(midiVoices).length,
        transpose: midiTranspose,
        waveform: currentWaveform,
        ganancia: midiMasterGain?.gain.value,
        reverb: midiWetGain?.gain.value,
        audioCtx: audioCtx ? "ACTIVO" : "INACTIVO"
    });
    
    if (Object.keys(midiVoices).length > 0) {
        console.log("🔍 Voces activas:", Object.keys(midiVoices));
    }
}


// Ejecutar cada 3 segundos
setInterval(debugSintetizador, 3000);





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

// ====== VERIFICACIÓN CADA 80ms ======
setInterval(verificarLiberacion, 80);






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
  const characters = ['@', '#', '$', '%', '&', '*', '▒', '▒', '=', '?', ';', ':', ',', '.', '▒', '▓', '▒', '░', '█', '▓'];

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



// ====== SONIDO DE LETRAS SOBRE ascii-art (SIEMPRE ACTIVO) ======
const asciiArtElement = document.getElementById('ascii-art');

document.getElementById('ascii-art').addEventListener('mousemove', function (event) {
    if (!audioCtx || !gainNode || !oscilador || !lettersGain) return;

    const w = this.offsetWidth || 1;
    const h = this.offsetHeight || 1;

    const normX = event.offsetX / w;  // 0..1
    const freq  = 200 + normX * 2800; // 200–3000 Hz aprox
    oscilador.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const normY    = event.offsetY / h;  // 0..1
    const gainVal  = Math.max(0, Math.min(1, 1 - normY));

    // ⬅️ SOLO MOVEMOS EL GAIN DE LAS LETRAS, NO EL MASTER
    lettersGain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
});



let midiTranspose   = 0;
let currentWaveform = 'sawtooth';

let midiAccess   = null;
let midiInput    = null;

let midiVoices   = {};   // nota -> { osc, gain }

// CADENA MIDI (NO TOCAR EL gainNode DEL JUEGO)
// CADENA MIDI (NO TOCAR EL gainNode DEL JUEGO)
let midiGain        = null; // bus de voces (dry+wet)
let midiMasterGain  = null; // volumen global del sinte
let midiFilter      = null; // LPF
let midiWetGain     = null; // envío a reverb/delay
let midiRevDelay    = null; // delay
let midiRevFeedback = null; // feedback del delay

// 🔹 Dinámicas del sintetizador (solo MIDI, NO el mundo ASCII)
let midiComp        = null; // compresor general del sinte
let midiLimiter     = null; // limitador tipo brickwall
let midiBusWired    = false; // flag para no reconectar varias veces



// ====== NOTA MIDI → FRECUENCIA (440 Hz base) ======
function midiNoteToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

// Versión a 432 Hz por si la necesitas para el acorde de máscara
function midiNoteToFreq432(note) {
    return 432 * Math.pow(2, (note - 69) / 12);
}

// ====== NOTA MIDI → TECLA ASCII (solo letras y símbolos, SIN números) ======
function noteToAsciiKey(note) {
    const keys = [
        'a','s','d','f','g','h','j','k','l',';',
        'm','@','#','░','█'
    ];
    return keys[note % keys.length];
}

// ====== BUS DEL SINTETIZADOR MIDI ======
// ====== BUS DEL SINTETIZADOR MIDI (con compresor + limitador) ======
function ensureMIDIBus() {
    if (!audioCtx) {
        console.log("❌ ensureMIDIBus: audioCtx no existe");
        return false;
    }

    // ---- MASTER DEL SINTE (SOLO MIDI) ----
    if (!midiMasterGain) {
        midiMasterGain = audioCtx.createGain();
        // un poco más bajo para dejar headroom al compresor
        midiMasterGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        console.log("✅ midiMasterGain creado");
    }

    // ---- COMPRESOR DEL SINTE ----
    if (!midiComp) {
        midiComp = audioCtx.createDynamicsCompressor();

        // Compresión moderada
        midiComp.threshold.setValueAtTime(-26,  audioCtx.currentTime); // umbral
        midiComp.knee.setValueAtTime(18,        audioCtx.currentTime); // knee suave
        midiComp.ratio.setValueAtTime(4,        audioCtx.currentTime); // relación moderada
        midiComp.attack.setValueAtTime(0.006,   audioCtx.currentTime); // ataque rápido
        midiComp.release.setValueAtTime(0.30,   audioCtx.currentTime); // release relativamente rápido

        console.log("✅ midiComp creado (compresor general)");
    }

    // ---- LIMITADOR (otro compresor configurado como brickwall) ----
    if (!midiLimiter) {
        midiLimiter = audioCtx.createDynamicsCompressor();

        // Config aproximada de limitador brickwall
        midiLimiter.threshold.setValueAtTime(-1.0,  audioCtx.currentTime); // cerca de 0 dBFS
        midiLimiter.knee.setValueAtTime(0.0,        audioCtx.currentTime); // knee duro
        midiLimiter.ratio.setValueAtTime(20.0,      audioCtx.currentTime); // relación muy alta
        midiLimiter.attack.setValueAtTime(0.001,    audioCtx.currentTime); // ataque ultra rápido
        midiLimiter.release.setValueAtTime(0.12,    audioCtx.currentTime); // release corto

        console.log("✅ midiLimiter creado (brickwall)");
    }

    // ---- FILTRO LPF ----
    if (!midiFilter) {
        midiFilter = audioCtx.createBiquadFilter();
        midiFilter.type = 'lowpass';
        midiFilter.frequency.setValueAtTime(8000, audioCtx.currentTime);
        midiFilter.Q.setValueAtTime(0.7,      audioCtx.currentTime);
        console.log("✅ midiFilter creado");
    }

    // ---- REVERB SENCILLA (delay con feedback) ----
    if (!midiRevDelay) {
        midiRevDelay = audioCtx.createDelay(1.0);
        midiRevDelay.delayTime.setValueAtTime(0.28, audioCtx.currentTime);
    }

    if (!midiRevFeedback) {
        midiRevFeedback = audioCtx.createGain();
        midiRevFeedback.gain.setValueAtTime(0.35, audioCtx.currentTime);
        midiRevDelay.connect(midiRevFeedback);
        midiRevFeedback.connect(midiRevDelay);
    }

    if (!midiWetGain) {
        midiWetGain = audioCtx.createGain();
        midiWetGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        midiWetGain.connect(midiRevDelay);
        console.log("✅ cadena de reverb MIDI creada");
    }

    // ---- BUS DE VOCES (entrada de todas las notas) ----
    if (!midiGain) {
        midiGain = audioCtx.createGain();
        midiGain.gain.setValueAtTime(1.0, audioCtx.currentTime);

        // Dry → filtro → master sinte
        midiGain.connect(midiFilter);
        midiFilter.connect(midiMasterGain);

        // Wet → reverb → master sinte
        midiGain.connect(midiWetGain);
        midiRevDelay.connect(midiMasterGain);

        console.log("✅ Bus MIDI configurado (dry+filter+reverb → midiMasterGain)");
    }

    // ---- SALIDA FINAL (master → compresor → limitador → destino) ----
    if (!midiBusWired) {
        midiMasterGain.connect(midiComp);
        midiComp.connect(midiLimiter);
        midiLimiter.connect(audioCtx.destination);

        midiBusWired = true;
        console.log("🔗 midiMasterGain → midiComp → midiLimiter → destination");
    }

    return true;
}


// ======================================================
//  INICIALIZAR MIDI
// ======================================================
function initMIDI() {
    if (!navigator.requestMIDIAccess) {
        console.warn("⚠️ Este navegador no soporta WebMIDI.");
        return;
    }

    navigator.requestMIDIAccess({ sysex: false })
        .then(onMIDISuccess)
        .catch(onMIDIFailure);
}

function onMIDISuccess(midi) {
    console.log("✅ WebMIDI OK");
    midiAccess = midi;

    midiAccess.inputs.forEach((input) => {
        console.log("🎹 MIDI IN:", input.name, input.id);
    });

    const inputs = Array.from(midiAccess.inputs.values());
    if (inputs.length > 0) {
        midiInput = inputs[0];
        midiInput.onmidimessage = handleMIDIMessage;
        console.log("👉 Usando como entrada:", midiInput.name);
    } else {
        console.warn("⚠️ No hay dispositivos MIDI conectados.");
    }

    midiAccess.onstatechange = (e) => {
        console.log("MIDI state change:", e.port.name, e.port.state);
        if (e.port.type === "input" && e.port.state === "connected" && !midiInput) {
            midiInput = e.port;
            midiInput.onmidimessage = handleMIDIMessage;
            console.log("🎹 Nueva entrada MIDI:", midiInput.name);
        }
    };
}

function onMIDIFailure(err) {
    console.error("❌ Error inicializando MIDI:", err);
}

// ======================================================
//  HANDLER MIDI PRINCIPAL
// ======================================================
function handleMIDIMessage(event) {
    const [status, data1, data2] = event.data;
    const cmd     = status & 0xF0;
    const channel = status & 0x0F;
    const note    = data1;
    const value   = data2;

    // El navegador exige gesto humano para crear/resumir audioCtx
    if (!audioCtx) return;

    if (cmd === 0x90 && value > 0) {
        // NOTE ON
        onMIDINoteOn(note, value, channel);
    } else if (cmd === 0x80 || (cmd === 0x90 && value === 0)) {
        // NOTE OFF
        onMIDINoteOff(note, value, channel);
    } else if (cmd === 0xB0) {
        // CONTROL CHANGE
        onMIDICC(data1, data2, channel);
    }
}

// ======================================================
//  MAPEOS DE PADS (sol, luna, gato, reset, etc.)
// ======================================================
const PAD_SOL       = 36;  // ascii-sol
const PAD_LUNA      = 37;  // ascii-luna
const PAD_GATO      = 38;  // ascii-cat
const PAD_RUIDO     = 39;  // ascii-ruido (si quieres usarlo)
const PAD_VOZ       = 40;  // ascii-voz (si quieres usarlo)
const PAD_START_ALL = 41;  // play-all
const PAD_TRAMPA    = 42;  // trampa
const PAD_RESET     = 43;  // reset juego

function midiClick(id) {
    const el = document.getElementById(id);
    if (el) el.click();
}

// ======================================================
//  NOTE ON: crea voz nueva + letra ASCII
// ======================================================
function onMIDINoteOn(note, velocity, channel) {
    console.log("🎹 NOTE ON - Nota:", note, "Vel:", velocity, "Canal:", channel);

    // ====== PADS ESPECIALES DEL JUEGO ======
    if (note === PAD_SOL) {
        console.log("🔥 Activando Sol desde MIDI");
        document.getElementById('ascii-sol')?.click();
        return;
    }
    if (note === PAD_LUNA) {
        console.log("🌙 Activando Luna desde MIDI");
        document.getElementById('ascii-luna')?.click();
        return;
    }
    if (note === PAD_GATO) {
        console.log("🐱 Activando Gato desde MIDI");
        document.getElementById('ascii-cat')?.click();
        return;
    }
    if (note === PAD_RESET) {
        console.log("🔁 RESET JUEGO desde MIDI");
        if (typeof resetGame === 'function') resetGame();
        return;
    }

    // ====== SINTETIZADOR ======
    if (!audioCtx) {
        if (typeof startAudioContext === 'function') {
            startAudioContext();
        } else {
            console.log("⚠️ No hay audioCtx ni startAudioContext");
            return;
        }
    }

    if (!ensureMIDIBus()) {
        console.log("❌ No se pudo crear el bus MIDI");
        return;
    }

    // Si ya existía una voz para esa nota, la apagamos primero
    if (midiVoices[note]) {
        try {
            const v = midiVoices[note];
            v.gain.gain.cancelScheduledValues(audioCtx.currentTime);
            v.gain.gain.setValueAtTime(0, audioCtx.currentTime);
            v.osc.stop(audioCtx.currentTime + 0.01);
            v.osc.disconnect();
            v.gain.disconnect();
        } catch (e) {}
        delete midiVoices[note];
    }

    try {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const noteWithTranspose = note + midiTranspose;
        const freq = midiNoteToFreq(noteWithTranspose);

        osc.type = currentWaveform;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // ====== ADSR ======
        // ====== ADSR ======
        const v   = velocity / 127;
        const now = audioCtx.currentTime;

        // pico algo por debajo de 1.0 para dejar margen al compresor
        const peak = v * 0.7;  // 70% de la velocidad → menos clip

        const a = Math.max(0.001, envAttack);
        const d = Math.max(0.001, envDecay);
        const s = Math.max(0.0, Math.min(envSustain, 1.0));


        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.0, now);                       // inicio
        gain.gain.linearRampToValueAtTime(peak, now + a);         // Attack
        gain.gain.linearRampToValueAtTime(peak * s, now + a + d); // Decay → Sustain

        osc.connect(gain);
        gain.connect(midiGain);

        osc.start();

        midiVoices[note] = { osc, gain };

        // Letra ASCII
        const ch = noteToAsciiKey(noteWithTranspose);
        if (typeof window.drawMidiLetter === 'function') {
            window.drawMidiLetter(ch);
        }

        console.log("✅ VOZ MIDI creada:", note, "freq:", Math.round(freq), "Hz");
    } catch (error) {
        console.log("❌ ERROR creando voz MIDI:", error);
    }
}

// ======================================================
//  NOTE OFF: APAGA Y ELIMINA LA VOZ
// ======================================================
function onMIDINoteOff(note, velocity, channel) {
    console.log("🎹 NOTE OFF - Nota:", note, "Vel:", velocity, "Canal:", channel);

    if (!midiVoices[note] || !audioCtx) {
        return;
    }

    const voice = midiVoices[note];
    const now   = audioCtx.currentTime;

    try {
        const r = Math.max(0.01, envRelease);

        // comenzamos release desde el valor actual
        const currentVal = voice.gain.gain.value;
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(currentVal, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + r);

        voice.osc.stop(now + r + 0.05);
    } catch (e) {
        try { voice.osc.stop(now + 0.05); } catch (_) {}
    }

    try {
        voice.osc.disconnect();
        voice.gain.disconnect();
    } catch (e) {}

    delete midiVoices[note];
}

    try {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const noteWithTranspose = note + midiTranspose;
        const freq = midiNoteToFreq(noteWithTranspose);

        osc.type = currentWaveform;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // ====== ADSR ======
        const v   = velocity / 127;
        const now = audioCtx.currentTime;
        const peak = v;

        const a = Math.max(0.001, envAttack);
        const d = Math.max(0.001, envDecay);
        const s = Math.max(0.0, Math.min(envSustain, 1.0));

        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.0, now);                       // inicio
        gain.gain.linearRampToValueAtTime(peak, now + a);         // A
        gain.gain.linearRampToValueAtTime(peak * s, now + a + d); // D → S

        osc.connect(gain);
        gain.connect(midiGain);

        osc.start();

        midiVoices[note] = { osc, gain };

        // Letra ASCII
        const ch = noteToAsciiKey(noteWithTranspose);
        if (typeof window.drawMidiLetter === 'function') {
            window.drawMidiLetter(ch);
        }

        console.log("✅ VOZ MIDI creada:", note, "freq:", Math.round(freq), "Hz");
    } catch (error) {
        console.log("❌ ERROR creando voz MIDI:", error);
    }


function onMIDINoteOff(note, velocity, channel) {
    console.log("🎹 NOTE OFF - Nota:", note, "Vel:", velocity, "Canal:", channel);

    if (!midiVoices[note] || !audioCtx) {
        return;
    }

    const voice = midiVoices[note];
    const now   = audioCtx.currentTime;

    try {
        const r = Math.max(0.01, envRelease);
gainNode.gain.cancelScheduledValues(now);
        // empezamos release desde el valor actual
        const currentVal = voice.gain.gain.value;
        voice.gain.gain.setValueAtTime(currentVal, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + r);

        voice.osc.stop(now + r + 0.05);
    } catch (e) {
        try { voice.osc.stop(now + 0.05); } catch (_) {}
    }

    try {
        voice.osc.disconnect();
        voice.gain.disconnect();
    } catch (e) {}

    delete midiVoices[note];
}

// ======================================================
//  NOTE OFF: APAGA Y ELIMINA LA VOZ SÍ O SÍ
// ======================================================
function onMIDINoteOff(note, velocity, channel) {
    console.log("🎹 NOTE OFF - Nota:", note, "Vel:", velocity, "Canal:", channel);

    if (!midiVoices[note] || !audioCtx) {
        return;
    }

    const voice = midiVoices[note];
    const now   = audioCtx.currentTime;

    try {
        // pequeño release para no hacer "click"
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setTargetAtTime(0, now, 0.03);
    } catch (e) {}

    try {
        voice.osc.stop(now + 0.08);
    } catch (e) {}

    try {
        voice.osc.disconnect();
        voice.gain.disconnect();
    } catch (e) {}

    delete midiVoices[note];
}


// ======================================================
//  CONTROL CHANGE: SINTE + MUNDO ASCII (MIDI ↔ UI)
// ======================================================
function onMIDICC(cc, value, channel) {
    if (!audioCtx) return;

    const norm = value / 127;  // 0–1

    // Helper: ajustar slider de interfaz y disparar su lógica
    const setSliderFromCC = (id, normVal) => {
        const slider = document.getElementById(id);
        if (!slider) return;

        const min = slider.min !== "" ? parseFloat(slider.min) : 0;
        const max = slider.max !== "" ? parseFloat(slider.max) : 1;

        const mapped = min + normVal * (max - min);
        slider.value = mapped;

        // Dispara el mismo código que cuando mueves el slider con el mouse
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // ================== CONTROLES DEL MUNDO ASCII (perillas 21–28) ==================
    switch (cc) {
        case 21: // CC21 → world-gain (master mundo ASCII)
            setSliderFromCC('world-gain', norm);
            console.log("🌍 CC21 → world-gain (UI + audio):", norm.toFixed(2));
            return;

        case 22: // CC22 → noise-gain (volumen ruido blanco)
            setSliderFromCC('noise-gain', norm);
            console.log("🐱 CC22 → noise-gain (UI + audio):", norm.toFixed(2));
            return;

        case 23: // CC23 → volumen Sol
            setSliderFromCC('sun-gain', norm);
            console.log("☀️ CC23 → sun-gain (UI + audio):", norm.toFixed(2));
            return;

        case 24: // CC24 → volumen Luna
            setSliderFromCC('moon-gain', norm);
            console.log("🌙 CC24 → moon-gain (UI + audio):", norm.toFixed(2));
            return;

        case 25: // CC25 → ganancia del oscilador de letras
            if (lettersGain) {
                const g = norm;
                try {
                    lettersGain.gain.setTargetAtTime(g, audioCtx.currentTime, 0.03);
                } catch (e) {}
                console.log("🔤 CC25 → lettersGain:", g.toFixed(2));
            }
            return;

        case 26: // CC26 → frecuencia base del oscilador de letras
            if (oscilador && oscilador.frequency) {
                const f = 80 + norm * 5920; // 80–6000 Hz
                try {
                    oscilador.frequency.setTargetAtTime(f, audioCtx.currentTime, 0.03);
                } catch (e) {}
                console.log("🔤 CC26 → letters freq:", Math.round(f), "Hz");
            }
            return;

        case 27: // CC27 → pitch Sol
            setSliderFromCC('sun-pitch', norm);
            console.log("☀️ CC27 → sun-pitch (UI + audio):", norm.toFixed(2));
            return;

        case 28: // CC28 → pitch Luna
            setSliderFromCC('moon-pitch', norm);
            console.log("🌙 CC28 → moon-pitch (UI + audio):", norm.toFixed(2));
            return;
    }

    // ================== CONTROLES DEL SINTE MIDI (CC estándar) ==================
    switch (cc) {
        case 1: // CC1 → cantidad de reverb/delay del sinte
            if (!ensureMIDIBus()) return;
            if (midiWetGain && midiRevFeedback) {
                const wet = norm;
                const fb  = 0.15 + norm * 0.6; // 0.15–0.75
                midiWetGain.gain.setValueAtTime(wet, audioCtx.currentTime);
                midiRevFeedback.gain.setValueAtTime(fb,  audioCtx.currentTime);
                console.log("💦 CC1 → Reverb wet:", wet.toFixed(2), "fb:", fb.toFixed(2));
            }
            return;

        case 7: // CC7 → master del sinte MIDI
            if (!ensureMIDIBus()) return;
            if (midiMasterGain) {
                midiMasterGain.gain.setValueAtTime(norm, audioCtx.currentTime);
                console.log("🔊 CC7 → MIDI master:", norm.toFixed(2));
            }
            return;

        case 74: // CC74 → cutoff del filtro del sinte
            if (!ensureMIDIBus()) return;
            if (midiFilter) {
                const minHz = 120;
                const maxHz = 12000;
                const freq  = minHz * Math.pow(maxHz / minHz, norm);
                midiFilter.frequency.setValueAtTime(freq, audioCtx.currentTime);
                console.log("🪄 CC74 → cutoff:", Math.round(freq), "Hz");
            }
            return;

        default:
            console.log("🎛️ CC (no mapeado):", cc, "val:", value, "canal:", channel);
            return;
    }
}


// ======================================================
//  ACORDE DE MÁSCARA (MANTENGO TU LÓGICA, SOLO USAMOS midiNoteToFreq432)
// ======================================================
let maskChordVoices = [];
let maskRevealStartTime = null;
const MASK_ANIM_DURATION = 8.0;
const MASK_CHORD_NOTES = [78, 52, 55, 93, 62, 64, 82]; // Cmaj6/9

function playMaskChord() {
    if (!audioCtx) return;

    stopMaskChord();

    const now = audioCtx.currentTime;
    maskRevealStartTime = now;

    MASK_CHORD_NOTES.forEach((n, i) => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const freqStart = midiNoteToFreq(n);
        const freqEnd   = midiNoteToFreq432(n);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freqStart, now);
        osc.frequency.linearRampToValueAtTime(freqEnd, now + MASK_ANIM_DURATION);

        gain.gain.setValueAtTime(0, now);

        const attack       = 1.5;
        const sustainLevel = 0.08;
        const releaseStart = MASK_ANIM_DURATION - 1.5;

        gain.gain.linearRampToValueAtTime(sustainLevel, now + attack);
        gain.gain.setValueAtTime(sustainLevel, now + releaseStart);
        gain.gain.exponentialRampToValueAtTime(0.001, now + MASK_ANIM_DURATION + 0.6);

        gain.connect(audioCtx.destination);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + MASK_ANIM_DURATION + 1.0);

        maskChordVoices.push({ osc, gain });
    });

    console.log("🎹 ACORDE INICIAL REPRODUCIENDO (volumen bajo)");
}

function stopMaskChord() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    maskChordVoices.forEach(v => {
        try {
            v.gain.gain.cancelScheduledValues(now);
            v.gain.gain.linearRampToValueAtTime(0, now + 0.8);
            v.osc.stop(now + 1.0);
        } catch (e) {}
    });

    maskChordVoices = [];
    maskRevealStartTime = null;
}

// ======================================================
//  BOTÓN DE PÁNICO: DESBLOQUEAR SINTETIZADOR (tecla D)
// ======================================================
function destrabarSintetizador() {
    if (!audioCtx) {
        console.log("🚨 destrabarSintetizador: audioCtx no existe");
        return;
    }

    console.log("🚨 DESTRABANDO SINTETIZADOR...");

    Object.values(midiVoices).forEach(voice => {
        try {
            voice.gain.gain.cancelScheduledValues(audioCtx.currentTime);
            voice.gain.gain.value = 0;
            voice.osc.stop(audioCtx.currentTime + 0.01);
            voice.osc.disconnect();
            voice.gain.disconnect();
        } catch (e) {}
    });

    midiVoices = {};
    midiGain   = null;
    midiWetGain = null;

    ensureMIDIBus();

    console.log("✅ Sintetizador destrabado - Voces activas:", Object.keys(midiVoices).length);
}

// Atajo de teclado para pánico: D
document.addEventListener('keydown', function(event) {
    if (event.key === 'd' || event.key === 'D') {
        destrabarSintetizador();
    }
});

function stopMaskChord() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    maskChordVoices.forEach(v => {
        try {
            v.gain.gain.cancelScheduledValues(now);
            v.gain.gain.linearRampToValueAtTime(0, now + 0.8);
            v.osc.stop(now + 1.0);
        } catch (e) {}
    });

    maskChordVoices = [];
    maskRevealStartTime = null;
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("🎛️ INICIANDO CONTROLES DE INTERFAZ (MIDI + WORLD)...");

        // ============================================================
    // 0. TOGGLE PANEL DEL SINTE MIDI + DRAGGABLE
    // ============================================================
    const synthPanel = document.getElementById('synth-panel');
    const toggleBtn  = document.getElementById('toggle-synth-panel');

    if (synthPanel && toggleBtn) {
        // Aseguramos estado inicial visible
        const current = window.getComputedStyle(synthPanel).display;
        if (current === 'none') {
            synthPanel.style.display = 'block';
        }

        toggleBtn.addEventListener('click', () => {
            const nowDisplay = window.getComputedStyle(synthPanel).display;
            const isHidden   = nowDisplay === 'none';

            synthPanel.style.display = isHidden ? 'block' : 'none';
            console.log("🎚️ Panel sinte MIDI visible:", isHidden ? "YES" : "NO");
        });
    }


    // Hacer el panel arrastrable
    if (synthPanel) {
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // Usamos el <h3> como "handle" si existe
        const dragHandle = synthPanel.querySelector('h3') || synthPanel;

        const onMouseDown = (e) => {
            dragging = true;

            const rect = synthPanel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // Pasar de right/bottom a left/top para arrastrar sin problemas
            synthPanel.style.position = 'fixed';
            synthPanel.style.left = rect.left + 'px';
            synthPanel.style.top  = rect.top + 'px';
            synthPanel.style.right = 'auto';
            synthPanel.style.bottom = 'auto';
        };

        const onMouseMove = (e) => {
            if (!dragging) return;
            synthPanel.style.left = (e.clientX - offsetX) + 'px';
            synthPanel.style.top  = (e.clientY - offsetY) + 'px';
        };

        const onMouseUp = () => {
            dragging = false;
        };

        dragHandle.style.cursor = 'move';
        dragHandle.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup',   onMouseUp);
    }

    // ============================================================
    // 1. CONTROLES DEL SINTE MIDI (TU LÓGICA ORIGINAL)
    // ============================================================
   // dentro de document.addEventListener('DOMContentLoaded', () => { ... })

const waveSel  = document.getElementById('midi-waveform');
const pitchCtl = document.getElementById('midi-pitch');
const gainCtl  = document.getElementById('midi-gain');
const revCtl   = document.getElementById('midi-reverb');
const cutCtl   = document.getElementById('filter-cutoff');
const resCtl   = document.getElementById('filter-resonance');

const aCtl = document.getElementById('env-attack');
const dCtl = document.getElementById('env-decay');
const sCtl = document.getElementById('env-sustain');
const rCtl = document.getElementById('env-release');

// inicializar ADSR con valores de los sliders si existen
if (aCtl) envAttack  = parseFloat(aCtl.value) || envAttack;
if (dCtl) envDecay   = parseFloat(dCtl.value) || envDecay;
if (sCtl) envSustain = parseFloat(sCtl.value) || envSustain;
if (rCtl) envRelease = parseFloat(rCtl.value) || envRelease;

// 1.1 Forma de onda
if (waveSel) {
    waveSel.addEventListener('change', () => {
        currentWaveform = waveSel.value;
        console.log("🌊 FORMA DE ONDA:", currentWaveform);

        if (midiVoices) {
            Object.values(midiVoices).forEach(voice => {
                try { voice.osc.type = currentWaveform; } catch (e) {}
            });
        }
    });
}

// 1.2 Transpose
if (pitchCtl) {
    midiTranspose = parseInt(pitchCtl.value, 10) || 0;
    pitchCtl.addEventListener('input', () => {
        midiTranspose = parseInt(pitchCtl.value, 10) || 0;
        console.log("🎼 TRANSPOSICIÓN:", midiTranspose, "semitones");

        if (audioCtx && midiVoices && Object.keys(midiVoices).length > 0) {
            const now = audioCtx.currentTime;
            Object.entries(midiVoices).forEach(([noteStr, voice]) => {
                const originalNote = parseInt(noteStr, 10);
                const newFreq = midiNoteToFreq(originalNote + midiTranspose);
                try {
                    voice.osc.frequency.setValueAtTime(newFreq, now);
                } catch (e) {}
            });
        }
    });
}

// 1.3 Ganancia global del sinte
if (gainCtl) {
    gainCtl.addEventListener('input', () => {
        const g = parseFloat(gainCtl.value); // 0–1
        if (!audioCtx) return;
        if (!ensureMIDIBus()) return;

        if (midiMasterGain) {
            midiMasterGain.gain.setValueAtTime(g, audioCtx.currentTime);
            console.log("🔊 GANANCIA MASTER SINTE:", g.toFixed(2));
        }
    });
}

// 1.4 Reverb (wet + feedback del delay)
if (revCtl) {
    revCtl.addEventListener('input', () => {
        const norm = parseFloat(revCtl.value); // 0–1
        if (!audioCtx) return;
        if (!ensureMIDIBus()) return;

        const wet = norm;
        const fb  = 0.15 + norm * 0.6; // feedback 0.15–0.75

        if (midiWetGain) {
            midiWetGain.gain.setValueAtTime(wet, audioCtx.currentTime);
        }
        if (midiRevFeedback) {
            midiRevFeedback.gain.setValueAtTime(fb, audioCtx.currentTime);
        }
        console.log("💦 REVERB wet:", wet.toFixed(2), "feedback:", fb.toFixed(2));
    });
}

// 1.5 Filtro: cutoff
if (cutCtl) {
    cutCtl.addEventListener('input', () => {
        const norm = parseFloat(cutCtl.value); // 0–1
        if (!audioCtx) return;
        if (!ensureMIDIBus()) return;

        const minHz = 120;
        const maxHz = 12000;
        const freq = minHz * Math.pow(maxHz / minHz, norm);

        if (midiFilter) {
            midiFilter.frequency.setValueAtTime(freq, audioCtx.currentTime);
            console.log("🪄 CUTOFF:", Math.round(freq), "Hz");
        }
    });
}

// 1.6 Filtro: resonancia
if (resCtl) {
    resCtl.addEventListener('input', () => {
        const norm = parseFloat(resCtl.value); // 0–1
        if (!audioCtx) return;
        if (!ensureMIDIBus()) return;

        const q = 0.4 + norm * 18; // 0.4–18
        if (midiFilter) {
            midiFilter.Q.setValueAtTime(q, audioCtx.currentTime);
            console.log("🪄 RESONANCIA Q:", q.toFixed(2));
        }
    });
}



// 1.7 ADSR (sliders → tiempos más largos)
if (aCtl) {
    aCtl.addEventListener('input', () => {
        const norm = parseFloat(aCtl.value) || 0;   // asumimos 0–1
        // Attack de 1 ms a 2.5 s
        envAttack = 0.001 + norm * 2.5;
        console.log("Env A:", envAttack.toFixed(3), "s");
    });
}
if (dCtl) {
    dCtl.addEventListener('input', () => {
        const norm = parseFloat(dCtl.value) || 0;
        // Decay de 20 ms a 2.5 s
        envDecay = 0.02 + norm * 2.5;
        console.log("Env D:", envDecay.toFixed(3), "s");
    });
}
if (sCtl) {
    sCtl.addEventListener('input', () => {
        const norm = parseFloat(sCtl.value) || 0;
        // Sustain 0–1
        envSustain = Math.max(0, Math.min(1, norm));
        console.log("Env S:", envSustain.toFixed(2));
    });
}
if (rCtl) {
    rCtl.addEventListener('input', () => {
        const norm = parseFloat(rCtl.value) || 0;
        // Release de 50 ms a 4 s
        envRelease = 0.05 + norm * 4.0;
        console.log("Env R:", envRelease.toFixed(3), "s");
    });
}


    console.log("✅ CONTROLES MIDI LISTOS (wave, pitch, gain, filtro, reverb, ADSR)");

    // ============================================================
    // 2. CONTROLES AUDIO WORLD ASCII (WORLD / NOISE / SOL / LUNA)
    // ============================================================
    const worldGainSlider = document.getElementById('world-gain');
    const noiseGainSlider = document.getElementById('noise-gain');
    const sunGainSlider   = document.getElementById('sun-gain');
    const sunPitchSlider  = document.getElementById('sun-pitch');
    const moonGainSlider  = document.getElementById('moon-gain');
    const moonPitchSlider = document.getElementById('moon-pitch');

    // 2.1 WORLD GAIN (master mundo ASCII: gainNode)
   // 2.1 WORLD GAIN (master mundo ASCII: gainNode)
// 2.1 WORLD GAIN (master mundo ASCII: gainNode)
if (worldGainSlider) {
    // valor inicial del slider desde la variable lógica
    worldGainSlider.value = worldGainBase;

    worldGainSlider.addEventListener('input', () => {
        const v = parseFloat(worldGainSlider.value);
        if (isNaN(v)) return;

        worldGainBase = v;  // guardamos base lógica

        if (audioCtx && gainNode) {
            try {
                gainNode.gain.setTargetAtTime(v, audioCtx.currentTime, 0.02);
                console.log("🌍 World gain (slider):", v.toFixed(2));
            } catch (e) {
                console.log("❌ Error ajustando gainNode:", e);
            }
        } else {
            console.log("⚠️ audioCtx o gainNode no existen aún");
        }
    });
}

// 2.2 NOISE GAIN (whiteNoiseGain)
if (noiseGainSlider) {
    noiseGainSlider.value = 0.3;  // mismo valor inicial que whiteNoiseGain

    noiseGainSlider.addEventListener('input', () => {
        const v = parseFloat(noiseGainSlider.value);
        if (isNaN(v)) return;

        if (audioCtx && whiteNoiseGain) {
            try {
                whiteNoiseGain.gain.setValueAtTime(v, audioCtx.currentTime);
                console.log("🐱 Noise gain (slider):", v.toFixed(2));
            } catch (e) {
                console.log("❌ Error ajustando whiteNoiseGain:", e);
            }
        } else {
            console.log("⚠️ audioCtx o whiteNoiseGain no existen aún");
        }
    });
}

    // 2.3 SOL Y LUNA: usar directamente audioSol / audioLuna
    // (están creados arriba como new Audio('ambient.wav') y new Audio('0S.wav'))
    const sunPlayer  = (typeof audioSol  !== 'undefined') ? audioSol  : null;
    const moonPlayer = (typeof audioLuna !== 'undefined') ? audioLuna : null;

    if (!sunPlayer) {
        console.log("⚠️ audioSol no definido; revisa new Audio('ambient.wav')");
    }
    if (!moonPlayer) {
        console.log("⚠️ audioLuna no definido; revisa new Audio('0S.wav')");
    }

    // 2.4 SUN GAIN & PITCH (slider UI)
    if (sunGainSlider) {
        // valor inicial del slider coherente con el volumen actual del Sol (0–1)
        if (sunPlayer && typeof sunPlayer.volume === 'number') {
            const min = sunGainSlider.min !== "" ? parseFloat(sunGainSlider.min) : 0;
            const max = sunGainSlider.max !== "" ? parseFloat(sunGainSlider.max) : 1;
            const v   = sunPlayer.volume;
            sunGainSlider.value = min + (max - min) * v;
        }

        sunGainSlider.addEventListener('input', () => {
            if (!sunPlayer) return;
            const vRaw = parseFloat(sunGainSlider.value);
            if (isNaN(vRaw)) return;

            const min = sunGainSlider.min !== "" ? parseFloat(sunGainSlider.min) : 0;
            const max = sunGainSlider.max !== "" ? parseFloat(sunGainSlider.max) : 1;
            const norm = (vRaw - min) / (max - min || 1);

            sunPlayer.volume = Math.max(0, Math.min(1, norm));
            console.log("☀️ Sun gain (slider):", sunPlayer.volume.toFixed(2));
        });
    }

    if (sunPitchSlider) {
        // valor inicial de pitch
        if (sunPlayer && typeof sunPlayer.playbackRate === 'number') {
            // asumimos min/max definidos en el HTML, si no, 0.5–2.0
            const min = sunPitchSlider.min !== "" ? parseFloat(sunPitchSlider.min) : 0.5;
            const max = sunPitchSlider.max !== "" ? parseFloat(sunPitchSlider.max) : 2.0;
            const rate = sunPlayer.playbackRate;
            const norm = (rate - min) / (max - min || 1);
            sunPitchSlider.value = min + norm * (max - min);
        }

        sunPitchSlider.addEventListener('input', () => {
            if (!sunPlayer) return;
            const rate = parseFloat(sunPitchSlider.value);
            if (isNaN(rate)) return;

            sunPlayer.playbackRate = rate;
            console.log("☀️ Sun pitch (slider):", rate.toFixed(2));
        });
    }

    // 2.5 MOON GAIN & PITCH (slider UI)
    if (moonGainSlider) {
        if (moonPlayer && typeof moonPlayer.volume === 'number') {
            const min = moonGainSlider.min !== "" ? parseFloat(moonGainSlider.min) : 0;
            const max = moonGainSlider.max !== "" ? parseFloat(moonGainSlider.max) : 1;
            const v   = moonPlayer.volume;
            moonGainSlider.value = min + (max - min) * v;
        }

        moonGainSlider.addEventListener('input', () => {
            if (!moonPlayer) return;
            const vRaw = parseFloat(moonGainSlider.value);
            if (isNaN(vRaw)) return;

            const min = moonGainSlider.min !== "" ? parseFloat(moonGainSlider.min) : 0;
            const max = moonGainSlider.max !== "" ? parseFloat(moonGainSlider.max) : 1;
            const norm = (vRaw - min) / (max - min || 1);

            moonPlayer.volume = Math.max(0, Math.min(1, norm));
            console.log("🌙 Moon gain (slider):", moonPlayer.volume.toFixed(2));
        });
    }

    if (moonPitchSlider) {
        if (moonPlayer && typeof moonPlayer.playbackRate === 'number') {
            const min = moonPitchSlider.min !== "" ? parseFloat(moonPitchSlider.min) : 0.5;
            const max = moonPitchSlider.max !== "" ? parseFloat(moonPitchSlider.max) : 2.0;
            const rate = moonPlayer.playbackRate;
            const norm = (rate - min) / (max - min || 1);
            moonPitchSlider.value = min + norm * (max - min);
        }

        moonPitchSlider.addEventListener('input', () => {
            if (!moonPlayer) return;
            const rate = parseFloat(moonPitchSlider.value);
            if (isNaN(rate)) return;

            moonPlayer.playbackRate = rate;
            console.log("🌙 Moon pitch (slider):", rate.toFixed(2));
        });
    }

    console.log("✅ CONTROLES WORLD ASCII LISTOS (world, noise, sol, luna)");
});

// ======================================================
//  IMPORTANTE: cerrar la alerta de inicio,
//  asegúrate de añadir la clase .is-revealing al #reveal-mask:
//      const mask = document.getElementById('reveal-mask');
//      mask?.classList.add('is-revealing');
//  para que se dispare la animación y el acorde.
// ======================================================



let osciladoresActivos = [];
// 🔹 Canvas del ASCII (sol / luna / caracteres)
let asciiCanvas;
let prevMouseX = 0;
let prevMouseY = 0;
let mouseMoving = false;

function setup() {
  const asciiArtContainer = document.getElementById('ascii-container');
  const desiredHeight = 600;

  
  asciiCanvas = createCanvas(asciiArtContainer.offsetWidth, desiredHeight);

  // Posición exacta encima del contenedor
  asciiCanvas.position(asciiArtContainer.offsetLeft, asciiArtContainer.offsetTop);



  // dentro del setup() de soundLetters
const cnv = p.createCanvas(container.offsetWidth, desiredHeight);
cnv.position(container.offsetLeft, container.offsetTop);
cnv.style('z-index', '5200000');      // ⬅️ por encima del fondo seguro
cnv.style('pointer-events', 'none');

  textSize(22);
  fill(255);
  noStroke();
  clear();        // limpia con transparencia (NO negro)
}

function windowResized() {
  const asciiArtContainer = document.getElementById('ascii-container');
  const desiredHeight = 400;

  resizeCanvas(asciiArtContainer.offsetWidth, desiredHeight);
  asciiCanvas.position(asciiArtContainer.offsetLeft, asciiArtContainer.offsetTop);
}

// 🔹 SIN background(0): nunca pintamos negro
function draw() {
  if (mouseX !== prevMouseX || mouseY !== prevMouseY) {
    mouseMoving = true;
    const char = generarCaracterAleatorio();
    text(char, mouseX, mouseY);

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  } else if (mouseMoving) {
    // antes tenías background(0) → parche negro
    clear();          // limpia a transparente
    mouseMoving = false;
  }
}

function generarCaracterAleatorio() {
  return String.fromCharCode(int(random(65, 1190)));
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






// Variable para almacenar el ID del intervalo para poder detenerlo más tarde si es necesario
let shuffleIntervalId = null;
document.body.addEventListener('click', function() {
  // Comprueba si el intervalo ya está establecido
  if (!shuffleIntervalId) {
    shuffleIntervalId = setInterval(function() {
     
      shuffleAscii(document.getElementById('ascii-cat'));
            shuffleAscii(document.getElementById('ascii-cat2'));

      shuffleAscii(document.getElementById('ascii-mountain'));
          shuffleAscii(document.getElementById('ascii-sol'));
      shuffleAscii(document.getElementById('ascii-luna'));
    shuffleAscii(document.getElementById('glax tree2'));
        shuffleAscii(document.getElementById('text'));
     

    }, 30); // Cambia los caracteres cada 20 milisegundos
  }
});

function shuffleAscii(element) {
  if (!element) return;

  // Guardamos el ASCII original solo la primera vez
  if (!element.dataset.baseText) {
    element.dataset.baseText = element.innerText;
  }

  const source = element.dataset.baseText;
  let newText = '';

  // tabla de reemplazo:
  // - glitchMode = true  → usa asciiCharsGlitch (con espacios, más roto)
  // - glitchMode = false → usa asciiTargetChars (shuffle normal)
  const table = glitchMode ? asciiCharsGlitch : asciiTargetChars;

  for (let char of source) {
    if (asciiTargetChars.includes(char)) {
      const randomChar = table[Math.floor(Math.random() * table.length)];
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







// ====== ARRANQUE MIDI CUANDO LA PÁGINA CARGA ======


// Instancia de p5 para las nubes
let sketch2 = function(p) {
  let asciiCat = `

   
☁☁ ☁ 


`;

  p.setup = function() {
    p.createCanvas(710, 200);
    p.textSize(32);
    p.fill(255);
    // posición inicial aleatoria
    x = p.random(p.width - 100);
    y = p.random(p.height - 100);
  };

  p.draw = function() {
    // ⬇⬇ ESTA ES LA LÍNEA IMPORTANTE
    p.clear();              // antes: p.background(0);
    // ⬆⬆ deja el canvas TRANSPARENTE, sin parche negro

    // Dibuja el ASCII
    let x = p.random(p.width - 100); 
    let y = p.random(p.height - 250);
    p.text(asciiCat, x, y, x);
  };

  p.mouseClicked = function() {
    p.clear();
    p.draw(); // redibuja en nueva posición
  };
};

new p5(sketch2, 'tree-sketch-container');

// ================== SKETCH DE LETRAS SONORAS ==================
// dentro de soundLetters(p) DESPUÉS de p.setup()
// dentro de soundLetters(p) DESPUÉS de p.setup()
window.drawMidiLetter = function(ch) {
    // borra lo anterior
    p.clear();

    const x = p.random(p.width);
    const y = p.random(p.height);

    p.fill(255);
    p.noStroke();
    p.text(ch, x, y);

    // se va casi de inmediato (no hay “tecla sostenida” visual)
    setTimeout(() => {
        p.clear();
    }, 80); // 80 ms de flash
};




let soundLetters = function(p) {
  let prevX = 0;
  let prevY = 0;
  let moving = false;

  p.setup = function() {
    const container = document.getElementById('ascii-container');
    const desiredHeight = 400;
    const cnv = p.createCanvas(container.offsetWidth, desiredHeight);

    cnv.position(container.offsetLeft, container.offsetTop);
    cnv.style('background', 'transparent');
    cnv.style('z-index', '33000');
    cnv.style('pointer-events', 'none');

    p.textSize(22);
    p.fill(255);
    p.noStroke();
    p.clear();
  };

  p.windowResized = function() {
    const container = document.getElementById('ascii-container');
    const desiredHeight = 400;
    p.resizeCanvas(container.offsetWidth, desiredHeight);
  };

  p.draw = function() {
    if (p.mouseX !== prevX || p.mouseY !== prevY) {
      moving = true;
      const char = String.fromCharCode(p.int(p.random(65, 1190)));
      p.text(char, p.mouseX, p.mouseY);
      prevX = p.mouseX;
      prevY = p.mouseY;
    } else if (moving) {
      p.clear();
      moving = false;
    }
  };
    // 🔹 API global: dibujar una letra desde MIDI
  window.drawMidiLetter = function(ch) {
    // posición aleatoria dentro del canvas de letras
    const x = p.random(p.width);
    const y = p.random(p.height);

    p.push();
    p.fill(255);
    p.textSize(22);
    p.text(ch, x, y);
    p.pop();
  };
};



new p5(soundLetters, 'ascii-container');




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
// ====== SONIDO SOBRE ascii-mountain (montaña/árbol) ======
document.getElementById('ascii-mountain').addEventListener('mousemove', function (event) {
    if (!audioCtx || !oscilador || !lettersGain) return;

    const w = this.offsetWidth || 1;
    const h = this.offsetHeight || 1;

    const normX = event.offsetX / w;
    const normY = event.offsetY / h;

    const freq = 800 + normX * 6000; // 800–6800 Hz
    oscilador.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const gainVal = Math.max(0, Math.min(1, 1 - normY));
    lettersGain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
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





// =================== LLUVIA + RAYOS + PORTAL GLITCH ===================
let rainSketch = function(p) {
    let raindrops = [];
    let lightnings = [];
    let nextStrike = 0; // cuándo cae el próximo rayo (en ms)


p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(26); // 🔹 menos FPS → menos CPU
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

// 🔹 Máximo de gotas + spawn rápido pero controlado
if (raindrops.length < 13 && p.frameCount % 2 === 0) {
    raindrops.push(new Raindrop(p));
}



    // ================= RAYOS - DESACTIVAR DURANTE GLITCH =================
    let now = p.millis();

    if (!window.portalBreak && now > nextStrike) {
const simultaneousLightnings = Math.floor(p.random(1, 2)); // muchos menos
        
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
                flashStrength += s * 0.9;   // mantenemos el peso
            } else {
                lightnings.splice(i, 1);
            }
        }

        // 🔥 FLASH MUY RÁPIDO PERO BIEN VISIBLE
     // 🔥 FLASH MÁS CORTO Y MÁS SUAVE
    if (flashStrength > 0.15) {          // solo flashea cuando es fuerte
        p.push();
        p.noStroke();

        // intensidad moderada y recortada
        const intensity = p.min(flashStrength * 0.2, 0.6);

        // menos alpha → no quema tanto
        const alpha = 130 * intensity;   // antes 220
        p.fill(255, 252, 255, alpha);
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
        let blocks = 40; // MÁS BLOQUES
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
   // ================= CLASE GOTA =================
class Raindrop {
    constructor(p) {
        this.p = p;
        this.x = p.random(p.width);
        this.y = 0;

        // profundidad
        this.z = p.random(0, 666);

        // largo casi igual
        this.len = p.map(this.z, 0, 3, 7, 6);

        // 🔹 MÁS RÁPIDAS: antes 4–10
        this.yspeed = p.map(this.z, 0, 20, 7 , 16);
    }

    update() {
        this.y += this.yspeed;

        // 🔹 GRAVEDAD MÁS FUERTE: antes 0.01–0.2
        let grav = this.p.map(this.z, 0, 60, 0.04, 0.35);
        this.yspeed += grav;
    }

  display() {
    // azul muy claro y luminoso
    this.p.stroke(165, 220, 255, 260);  // (R,G,B,Alpha)
    this.p.line(this.x, this.y, this.x, this.y + this.len);
}


    isOffScreen() {
        return this.y > this.p.height;
    }
}


    // ================= CLASE RAYO =================
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
        let steps = p.int(p.random(25, 33));
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

        this.maxLife = p.int(p.random(8, 12)); 
    }

    update() {
        // 🔹 ENVEJECEN EL DOBLE DE RÁPIDO
        this.life += 1;
    }

    display() {
        let t = this.life / this.maxLife; // 0 → 1
        let baseAlpha = this.p.map(t, 0, 1, 255, 60); 

        this.p.push();
        this.p.strokeCap(this.p.ROUND);
        this.p.strokeJoin(this.p.ROUND);
        this.p.noFill();

        let ctx = this.p.drawingContext;
        ctx.save();
        ctx.shadowBlur = 10 * (1 - t);
        ctx.shadowColor = `rgba(235,235,255,${0.7 * (1 - t)})`;

        // camino principal
        this.p.stroke(230, 230, 240, baseAlpha);
        this.p.strokeWeight(1.4);
        this.p.beginShape();
        for (let pt of this.mainPath) {
            this.p.curveVertex(pt.x, pt.y);
        }
        this.p.endShape();

        // ramas
        this.p.stroke(220, 220, 235, baseAlpha * 0.6);
        this.p.strokeWeight(0.9);
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
    // 🔹 DOBLE PARPADEO: dos picos rápidos por rayo
    let t = this.life / this.maxLife; // 0 → 1
    let v = 0;

    if (t < 0.15) {
        // subida primer flash
        v = this.p.map(t, 0.00, 0.05, 0.0, 1.0);
    } else if (t < 0.25) {
        // bajada primer flash
        v = this.p.map(t, 0.05, 0.8, 1.0, 0.0);
    } else if (t < 0.40) {
        // subida segundo flash
        v = this.p.map(t, 0.25, 0.32, 0.0, 1.0);
    } else if (t < 0.50) {
        // bajada segundo flash
        v = this.p.map(t, 0.32, 0.40, 1.0, 0.0);
    } else {
        v = 0.0;
    }

    return v * 0.95; // intensidad global moderada
}


    isDead() {
        return this.life >= this.maxLife;
    }
}


new p5(rainSketch, 'rain-sketch-container');




// === VERSIÓN CORRECTA: RUIDO BLANCO CONTROLADO POR whiteNoiseGain ===
function generarRuidoBlanco(duracion = 5) {
    if (!audioCtx) return;

    // Asegurar que existe whiteNoiseGain y está conectado al master
    if (!whiteNoiseGain) {
        whiteNoiseGain = audioCtx.createGain();
        whiteNoiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime); // nivel inicial
        whiteNoiseGain.connect(gainNode);
    }

    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duracion;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // ==== ruido fragmentado en "beats" de milisegundos ====
    let i = 0;
    while (i < bufferSize) {
        const segMs  = 20 + Math.random() * 50;          // 20–70 ms
        const segLen = Math.floor(sampleRate * (segMs / 1000));
        const activo = Math.random() < 0.55;             // 55% de segmentos con ruido

        for (let j = 0; j < segLen && i < bufferSize; j++, i++) {
            data[i] = activo ? (Math.random() * 2 - 1) * 0.7 : 0;
        }
    }

    // Apagar ruido anterior, si existe
    if (whiteNoiseSource) {
        try { whiteNoiseSource.stop(); } catch (e) {}
        try { whiteNoiseSource.disconnect(); } catch (e) {}
        whiteNoiseSource = null;
    }

    // Crear nueva fuente y pasarla por whiteNoiseGain (para usar el slider)
    whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.loop = true;                 // que siga hasta que tú la pares
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseSource.start(0);

    ruidoBlancoActivo = true;
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
        const factor = Math.random() > 0.3 ? (0.2 + Math.random() * 1.3) : 0.05;
const target = worldGainBase * factor;

try {
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setTargetAtTime(target, now, 0.01);
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
    }, 30); // MUY RÁPIDO - 10ms
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

// sketch.js — fondo atmósfera ligera y barata
let rays = [];
const NUM_RAYS = 18;   // número de rayos

// 🔹 capa offscreen para la niebla
let fogLayer;
const FOG_SCALE = 0.35;   // resolución más baja → más ligero
const FOG_CELL  = 4;      // celdas más grandes → menos rectángulos

let fogTime = 0;          // tiempo acumulado para animar la niebla

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);        // ⚠️ mucho más barato que 2
  frameRate(45);          // suficiente para fluidez visual

  c.position(0, 0);
  c.style('position', 'fixed');
  c.style('top', '0');
  c.style('left', '0');
  c.style('z-index', '-40');         // bien al fondo
  c.style('pointer-events', 'none');

  // 🔹 buffer de niebla en menor resolución
  fogLayer = createGraphics(width * FOG_SCALE, height * FOG_SCALE);
  fogLayer.pixelDensity(1);

  for (let i = 0; i < NUM_RAYS; i++) {
    rays.push(new Ray(true));
  }
}

function draw() {
  // fondo negro sólido
  noStroke();
  fill(0, 0, 0, 255);
  rect(0, 0, width, height);

  // 🔹 avanzamos el tiempo suavemente según deltaTime
  fogTime += deltaTime * 0.00055;   // si quieres más rápido, sube este valor

  // recalculamos la niebla cada frame, pero con muy pocas celdas → sigue siendo barato
  drawGreenFog();

  // dibujamos el buffer escalado a pantalla completa
  image(fogLayer, 0, 0, width, height);

  // rayos por encima
  for (let r of rays) {
    r.update();
    r.draw();
  }
}

// 🔹 Niebla plateada, fluida, MÁS brillante y barata
function drawGreenFog() {
  fogLayer.noStroke();
  fogLayer.clear();  // limpiamos el buffer, no la pantalla principal

  const cell = FOG_CELL;

  for (let x = 0; x < fogLayer.width; x += cell) {
    for (let y = 0; y < fogLayer.height; y += cell) {

      const n = noise(
        (x / FOG_SCALE) * 0.02 + fogTime * 1.2,
        (y / FOG_SCALE) * 0.02 + fogTime * 0.8
      );

      // curva de brillo más suave y luminosa
      const brightRaw   = n * n;
      const brightBoost = pow(brightRaw, 0.7);

      // Base gris-plateada (más alta)
      const base = 135 + 120 * brightBoost;

      const r = base + 15  * brightBoost;
      const g = base + 28  * brightBoost;
      const b = base + 38  * brightBoost;

      // más presencia luminosa pero sin tapar el negro
      const alpha = 14 + 90 * brightBoost;

      fogLayer.fill(r, g, b, alpha);
      fogLayer.rect(x, y, cell, cell);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // reajustar buffer cuando cambie el tamaño
  fogLayer = createGraphics(width * FOG_SCALE, height * FOG_SCALE);
  fogLayer.pixelDensity(1);
}

// =================== CLASE RAYO ===================
class Ray {
  constructor(fromTop) {
    this.reset(fromTop);
  }

  reset(fromTop) {
    this.depth = random(0.25, 1);

    this.x = random(width);
    this.baseX = this.x;
    this.xNoiseSeed = random(1000, 5000);

    this.y = fromTop ? random(-height, height) : random(-height, 0);

    this.length = random(50, 140) * this.depth;
    this.speed  = map(this.depth, 0.25, 1, 0.8, 2.4);

    this.thick = map(this.depth, 0.25, 1, 0.1, 0.5);
    this.alpha = map(this.depth, 0.25, 1, 8, 35);

    this.segmentSize = random(4, 10);
    this.gapSize     = random(4, 10);
  }

  update() {
    this.y += this.speed;

    let t = millis() * 0.0004;
    let wobble = (noise(this.xNoiseSeed, t) - 0.5) * 1.2;
    this.x = this.baseX + wobble;

    if (this.y - this.length > height) {
      this.reset(false);
    }
  }

  draw() {
    stroke(255, this.alpha);
    strokeWeight(this.thick);

    let y0 = this.y - this.length;
    for (let y = y0; y < this.y; ) {
      let seg = this.segmentSize;
      line(this.x, y, this.x, y + seg);
      y += seg + this.gapSize;
    }
  }
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




// Y también agrega esta función de pánico rápido:
function midiPanic() {
    console.log("🚨 MIDI PANIC - Limpiando todas las notas");
    Object.keys(midiVoices).forEach(key => {
        const voice = midiVoices[key];
        try {
            voice.osc.stop();
            voice.gain.disconnect();
        } catch (e) {}
    });
    midiVoices = {};
}

// Atajo de teclado para pánico
document.addEventListener('keydown', function(event) {
    if (event.key === 'p' || event.key === 'P') {
        midiPanic();
    }
});




