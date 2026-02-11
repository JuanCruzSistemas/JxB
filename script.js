// Configuración
const letterText = `Soy horrible con las palabras y cartas, pero estoy mejorando jajaja. 
Te volviste muy importante para mí, de las primeras cosas que pienso al despertarme (tarde XD) y de las últimas antes de irme a dormir (también tarde 🧐).
Hay muchas cosas que me gustaría vivir con vos, y quisiera aprovechar para eso cada segundo del tiempo… Ah y hablando de tiempo, hace cuánto nos conocimos…?`;

const startDate = new Date('2025-05-01T23:31:00');

let noClickCount = 0;
let clockInterval;
let backgroundMusic;

// Iniciar secuencia al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar música
    backgroundMusic = document.getElementById('background-music');
    
    // Intentar reproducir automáticamente
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Reproducción iniciada exitosamente
            console.log('Música iniciada');
        }).catch(error => {
            // La reproducción automática fue bloqueada
            // Crear un botón para que el usuario inicie la música
            console.log('Reproducción automática bloqueada, esperando interacción del usuario');
            
            // Intentar reproducir con cualquier interacción
            document.body.addEventListener('click', function startMusic() {
                backgroundMusic.play();
                document.body.removeEventListener('click', startMusic);
            }, { once: true });
        });
    }
    
    setTimeout(() => {
        startSequence();
    }, 1000);
});

function startSequence() {
    const envelope = document.getElementById('envelope');
    
    // Abrir sobre
    envelope.classList.add('open');
    envelope.classList.remove('close');
    
    // Después de 3 segundos, sacar la carta completamente
    setTimeout(() => {
        pullOutLetter();
    }, 3000);
}

function pullOutLetter() {
    const letter = document.querySelector('.letter');
    const envelope = document.getElementById('envelope');
    
    letter.classList.add('full-out');
    envelope.classList.add('fully-open');
    
    // Escribir el texto de la carta
    setTimeout(() => {
        typeWriter(letterText, 0);
    }, 800);
}

function typeWriter(text, index) {
    const letterTextElement = document.getElementById('letter-text');
    
    if (index < text.length) {
        letterTextElement.textContent += text.charAt(index);
        setTimeout(() => {
            typeWriter(text, index + 1);
        }, 50); // Velocidad de escritura
    } else {
        // Esperar 5 segundos después de terminar de escribir
        setTimeout(() => {
            startWhiteTransition();
        }, 5000);
    }
}

function startWhiteTransition() {
    const whiteTransition = document.getElementById('white-transition');
    whiteTransition.classList.add('active');
    
    // Después de la transición, mostrar directamente el reloj
    setTimeout(() => {
        showClock();
    }, 2000);
}

function showClock() {
    const clockContainer = document.getElementById('clock-container');
    
    clockContainer.classList.add('visible');
    
    // Iniciar el reloj
    startClock();
    
    // Después de 5 segundos, mostrar mensaje intermedio
    setTimeout(() => {
        showIntermediateMessage();
    }, 5000);
}

function startClock() {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

function showIntermediateMessage() {
    const intermediateMessage = document.getElementById('intermediate-message');
    
    intermediateMessage.classList.add('visible');
    
    // Después de 6 segundos, mostrar pregunta final
    setTimeout(() => {
        showValentineQuestion();
    }, 6000);
}

function showValentineQuestion() {
    const clockContainer = document.getElementById('clock-container');
    const intermediateMessage = document.getElementById('intermediate-message');
    const valentineQuestion = document.getElementById('valentine-question');
    
    clockContainer.classList.add('small');
    intermediateMessage.classList.add('fade-out');
    
    setTimeout(() => {
        valentineQuestion.classList.add('visible');
        setupButtons();
    }, 1000);
}

function setupButtons() {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const finalMessage = document.getElementById('final-message');
    const btnRestart = document.getElementById('btn-restart');
    
    btnNo.addEventListener('click', function() {
        noClickCount++;
        
        // Hacer el NO más pequeño y el SÍ más grande
        btnNo.style.transform = `scale(${1 - (noClickCount * 0.15)})`;
        btnNo.style.opacity = `${1 - (noClickCount * 0.2)}`;
        btnYes.style.transform = `scale(${1 + (noClickCount * 0.1)})`;
        
        // Si ya no es visible, ocultarlo
        if (noClickCount >= 5) {
            btnNo.style.display = 'none';
        }
    });
    
    btnYes.addEventListener('click', function() {
        btnYes.style.display = 'none';
        btnNo.style.display = 'none';
        
        if (noClickCount > 0) {
            finalMessage.innerHTML = 'Sabía que dirías que sí<br><br>Te adoro demonio, ya venite para acá así te abrazoooooo';
        } else {
            finalMessage.textContent = 'Te adoro demonio, ya venite para acá así te abrazoooooo';
        }
        
        finalMessage.classList.add('visible');
        
        // Mostrar el botón de reinicio después de 3 segundos
        setTimeout(() => {
            btnRestart.classList.add('visible');
        }, 3000);
    });
    
    // Funcionalidad del botón de reinicio
    btnRestart.addEventListener('click', function() {
        // Detener la música
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        
        // Recargar la página
        location.reload();
    });
}