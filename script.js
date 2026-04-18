// ===== BANCO DE PREGUNTAS =====
const BANCO = [
  { pregunta: "¿Cuál de estas es una oración simple?", opciones: ["Juan corre", "Juan corre y María canta", "Porque llueve"], correcta: 0 },
  { pregunta: "¿Cuántos verbos conjugados tiene una oración simple?", opciones: ["1", "2", "3"], correcta: 0 },
  { pregunta: "¿Cómo puede presentarse el sujeto en una oración simple?", opciones: ["Solo implícito", "Expreso u omitido", "Solo explícito"], correcta: 1 },
  { pregunta: '"El perro ladra." ¿Es una oración simple?', opciones: ["Sí", "No"], correcta: 0 },
  { pregunta: "Identifica el verbo en: 'María canta'", opciones: ["María", "canta", "ninguno"], correcta: 1 },
  { pregunta: "¿Cuál es un ejemplo de oración pasiva?", opciones: ["El niño come manzanas", "El televisor fue revisado por el técnico", "Pedro estudia matemáticas"], correcta: 1 },
  { pregunta: "Una oración simple está compuesta por:", opciones: ["Solo sujeto", "Solo predicado", "Sujeto y predicado"], correcta: 2 },
  { pregunta: "'Llueve mucho.' ¿Qué tipo de sujeto tiene?", opciones: ["Sujeto explícito", "Sujeto tácito", "Sujeto omitido (unipersonal)"], correcta: 2 },
  { pregunta: "¿Cuál es el núcleo del sujeto en 'El gato negro duerme'?", opciones: ["El", "gato", "negro"], correcta: 1 },
  { pregunta: "Identifica la oración con sujeto tácito:", opciones: ["Ella corre rápido", "Corremos juntos", "Los niños juegan"], correcta: 1 }
];

// ===== CONFIG =====
const PREGUNTAS_POR_RONDA = 5;
let TIEMPO_POR_PREGUNTA = 10;

// ===== VARIABLES =====
let preguntasRonda = [];
let indice = 0;
let puntos = 0;
let tiempoRestante;
let intervalo;

// ===== MEZCLAR =====
function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ===== PANTALLAS =====
function mostrarPantalla(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== MODO OSCURO =====
function toggleModo() {
  document.body.classList.toggle("dark");
}

// ===== INICIAR =====
function iniciarJuego() {

  // 🎮 nivel seleccionado
  TIEMPO_POR_PREGUNTA = parseInt(document.getElementById("nivel").value);

  preguntasRonda = mezclar(BANCO).slice(0, PREGUNTAS_POR_RONDA);
  indice = 0;
  puntos = 0;

  // 🎵 música
  const music = document.getElementById("bg-music");
  if (music) {
    music.volume = 0.3;
    music.play().catch(() => {});
  }

  // 🔊 sonido inicio
  const inicioSound = document.getElementById("inicio-sound");
  if (inicioSound) inicioSound.play().catch(() => {});

  mostrarPantalla('s-juego');
  mostrarPregunta();
}

// ===== EFECTO ESCRITURA =====
function escribirTexto(id, texto) {
  let i = 0;
  const el = document.getElementById(id);
  el.textContent = "";

  const inter = setInterval(() => {
    el.textContent += texto[i];
    i++;
    if (i >= texto.length) clearInterval(inter);
  }, 20);
}

// ===== MOSTRAR PREGUNTA =====
function mostrarPregunta() {
  if (indice >= PREGUNTAS_POR_RONDA) {
    finalizar();
    return;
  }

  const p = preguntasRonda[indice];

  escribirTexto("pregunta-txt", p.pregunta);

  document.getElementById('prog-actual').textContent = indice + 1;
  document.getElementById('hud-puntos').textContent = puntos;
  document.getElementById('prog-fill').style.width =
    ((indice + 1) / PREGUNTAS_POR_RONDA * 100) + '%';

  const contenedor = document.getElementById('opciones');
  contenedor.innerHTML = '';

  p.opciones.forEach((texto, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = texto;
    btn.onclick = () => responder(i);
    contenedor.appendChild(btn);
  });

  iniciarTimer();
}

// ===== TIMER =====
function iniciarTimer() {
  tiempoRestante = TIEMPO_POR_PREGUNTA;
  actualizarTimer();
  clearInterval(intervalo);

  intervalo = setInterval(() => {
    tiempoRestante--;
    actualizarTimer();

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      siguientePregunta();
    }
  }, 1000);
}

function actualizarTimer() {
  const el = document.getElementById('timer-num');
  el.textContent = tiempoRestante;

  // efecto latido
  el.style.transform = "scale(1.3)";
  setTimeout(() => el.style.transform = "scale(1)", 100);

  if (tiempoRestante > 5) el.className = 'ok';
  else if (tiempoRestante > 2) el.className = 'warn';
  else el.className = 'urgente';
}

// ===== EFECTO +1 =====
function mostrarPunto() {
  const el = document.createElement("div");
  el.textContent = "+1";
  el.style.position = "absolute";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.transform = "translate(-50%, -50%)";
  el.style.fontSize = "40px";
  el.style.color = "gold";
  el.style.fontWeight = "bold";
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 600);
}

// ===== RESPONDER =====
function responder(opcionElegida) {
  clearInterval(intervalo);

  const correcta = preguntasRonda[indice].correcta;
  const botones = document.querySelectorAll('.opt-btn');

  const sonidoCorrecto = document.getElementById('sonido-correcto');
  const sonidoError = document.getElementById('sonido-error');

  botones.forEach((btn, i) => {
    btn.disabled = true;

    if (i === correcta) btn.classList.add('correcto');
    else if (i === opcionElegida) btn.classList.add('incorrecto');
  });

  if (opcionElegida === correcta) {
    puntos++;
    document.getElementById('hud-puntos').textContent = puntos;
    mostrarPunto();
    if (sonidoCorrecto) sonidoCorrecto.play().catch(() => {});
  } else {
    if (sonidoError) sonidoError.play().catch(() => {});
  }

  // flash visual
  document.body.style.background = "#1e3a8a";
  setTimeout(() => document.body.style.background = "", 200);

  setTimeout(siguientePregunta, 900);
}

// ===== SIGUIENTE =====
function siguientePregunta() {
  indice++;
  mostrarPregunta();
}

// ===== FINAL + RANKING =====
function finalizar() {
  mostrarPantalla('s-resultado');

  document.getElementById('res-score').textContent = puntos;

  const resultados = [
    { min: 5, emoji: '🏆', msg: '¡Perfecto!', sub: 'Dominas la gramática.' },
    { min: 4, emoji: '🌟', msg: '¡Casi perfecto!', sub: 'Muy buen nivel.' },
    { min: 3, emoji: '📜', msg: 'Buen trabajo', sub: 'Sigue practicando.' },
    { min: 2, emoji: '📚', msg: 'Puedes mejorar', sub: 'Inténtalo otra vez.' },
    { min: 0, emoji: '💪', msg: 'No te rindas', sub: 'Sigue aprendiendo.' }
  ];

  const r = resultados.find(item => puntos >= item.min);

  document.getElementById('res-emoji').textContent = r.emoji;
  document.getElementById('res-msg').textContent = r.msg;
  document.getElementById('res-sub').textContent = r.sub;

  // 🏆 ranking
  let mejores = JSON.parse(localStorage.getItem("ranking")) || [];
  mejores.push(puntos);
  mejores.sort((a, b) => b - a);
  mejores = mejores.slice(0, 5);

  localStorage.setItem("ranking", JSON.stringify(mejores));

  document.getElementById('res-sub').textContent +=
    " | Mejores: " + mejores.join(", ");
}

// ===== REINICIAR =====
function reiniciar() {
  iniciarJuego();
} 