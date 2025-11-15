// ===============================
// 🎬 MENTE DO HOMEM — videos.js
// Funções: Tema, ano dinâmico, playlist e animação
// ===============================

// --- ANO AUTOMÁTICO ---
document.getElementById("year3").textContent = new Date().getFullYear();

// --- TEMA ESCURO/CLARO ---
const themeBtn = document.getElementById("btnTheme3");
const body = document.body;

// Carrega tema salvo
const savedTheme = localStorage.getItem("theme") || "dark";
body.dataset.theme = savedTheme;
updateThemeIcon(savedTheme);

themeBtn.addEventListener("click", () => {
  const newTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeBtn.textContent = theme === "dark" ? "🌞" : "🌙";
  if (theme === "light") {
    document.documentElement.style.setProperty("--bg-main", "#f5f5f7");
    document.documentElement.style.setProperty("--text", "#1c1c1c");
    document.documentElement.style.setProperty("--text-muted", "#555");
    document.documentElement.style.setProperty("--bg-card", "#ffffff");
    document.documentElement.style.setProperty("--accent-glow", "#c92060");
    document.documentElement.style.setProperty("--accent2-glow", "#7443d3");
  } else {
    document.documentElement.style.setProperty("--bg-main", "#070609");
    document.documentElement.style.setProperty("--text", "#f5f5f5");
    document.documentElement.style.setProperty("--text-muted", "#a1a1a1");
    document.documentElement.style.setProperty("--bg-card", "#111016");
    document.documentElement.style.setProperty("--accent-glow", "#ff2d55");
    document.documentElement.style.setProperty("--accent2-glow", "#a45ee5");
  }
}

// --- ANIMAÇÃO DE ENTRADA ---
window.addEventListener("load", () => {
  document.querySelector(".container").style.opacity = "0";
  setTimeout(() => {
    document.querySelector(".container").style.transition = "opacity 0.8s ease";
    document.querySelector(".container").style.opacity = "1";
  }, 200);
});

// --- PLAYLIST DE VÍDEOS ---
const videoGrid = document.getElementById("videoGrid");

// Exemplo de playlist (adicione os vídeos que quiser)
const videos = [
  {
    title: "O Poder De cair Fora",
    url: "videos/O poder de sair fora.mp4",
  },
  {
    title: "O Poder dos Hábitos",
    url: "videos/ninja 2.mp4",
  },
  {
    title: "Motivação Diária",
    url: "videos/Papo reto, poucas ideias.mp4",
  },
  {
    title: "Foco e Disciplina",
    url: "videos/Disciplina.mp4",
  },
];

// Gera os vídeos dinamicamente
videos.forEach((video) => {
  const card = document.createElement("div");
  card.className = "video-card";
  card.innerHTML = `
    <iframe src="${video.url}" 
            title="${video.title}" 
            allowfullscreen loading="lazy"></iframe>
    <h3 style="margin-top:10px; color:var(--accent2-glow);">${video.title}</h3>
  `;
  videoGrid.appendChild(card);
});
