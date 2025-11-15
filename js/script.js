/* ============================================================
    MENTE DO HOMEM — script.js COMPLETO E CORRIGIDO
    Tema light/dark • Menu mobile • Frases • Modal • Ano
    ============================================================ */

/* ==========================
    ELEMENTOS PRINCIPAIS
    ========================== */
const btnMenu = document.getElementById("btnMenu");
const mainNav = document.getElementById("mainNav");
const btnTheme = document.getElementById("btnTheme");
const body = document.body;

const fraseBox = document.getElementById("fraseBox");
const prevFrase = document.getElementById("prevFrase");
const nextFrase = document.getElementById("nextFrase");

const dailyTip = document.getElementById("dailyTip");

const modalNewsletter = document.getElementById("modalNewsletter");
const openNewsletter = document.getElementById("openNewsletter");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const yearSpan = document.getElementById("year");


/* ============================================================
    ✅ MENU MOBILE CORRIGIDO (Abre/Fecha)
    ============================================================ */
// 1. Ouve o clique no botão do menu (☰)
if (btnMenu && mainNav) {
    btnMenu.addEventListener("click", () => {
        // Alterna a classe que abre/fecha o menu
        mainNav.classList.toggle("mobile-open");
        
        // Opcional: Alterna o texto do botão (de ☰ para X), se necessário no CSS
        btnMenu.classList.toggle("is-active"); 
        
        // Se você quiser mudar o ícone para "X", precisa de uma classe no CSS para 'is-active'
        // Exemplo: btnMenu.textContent = mainNav.classList.contains("mobile-open") ? "✕" : "☰";
    });
}

// 2. Fecha o menu ao clicar em um link
const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

// Adiciona um ouvinte de evento para cada link dentro do menu
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Verifica se o menu está aberto e se o dispositivo é móvel
        if (mainNav.classList.contains('mobile-open')) {
            // Remove a classe para fechar o menu
            mainNav.classList.remove('mobile-open');
            btnMenu.classList.remove("is-active"); 
        }
    });
});


/* ============================================================
    TEMA DARK/LIGHT — com salvamento
    ============================================================ */
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light");
}

btnTheme?.addEventListener("click", () => {
    body.classList.toggle("light");

    // salva
    if (body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});


/* ============================================================
    FRASES DO DIA — Carrossel manual
    ============================================================ */
const frases = [
    "A disciplina constrói o que a motivação não consegue manter.",
    "Um pequeno passo hoje evita um grande arrependimento amanhã.",
    "O sucesso é feito de ações simples repetidas diariamente.",
    "Força é continuar mesmo quando ninguém está vendo.",
    "Você não precisa ser perfeito, só constante."
];

let fraseIndex = 0;

function atualizarFrase() {
    if (fraseBox) {
        fraseBox.textContent = frases[fraseIndex];
    }
}

prevFrase?.addEventListener("click", () => {
    fraseIndex = (fraseIndex - 1 + frases.length) % frases.length;
    atualizarFrase();
});

nextFrase?.addEventListener("click", () => {
    fraseIndex = (fraseIndex + 1) % frases.length;
    atualizarFrase();
});

// primeira frase
if (fraseBox) {
    atualizarFrase();
}


/* ============================================================
    DICA DO DIA
    ============================================================ */
const dicas = [
    "Respire fundo 5 vezes antes de começar qualquer tarefa.",
    "Escreva 3 metas simples para hoje.",
    "Remova uma distração por 30 minutos.",
    "Tome um copo de água ao acordar.",
    "Faça algo pela sua saúde ainda hoje."
];

if (dailyTip) {
    dailyTip.textContent = dicas[Math.floor(Math.random() * dicas.length)];
}


/* ============================================================
    NEWSLETTER — MODAL
    ============================================================ */
openNewsletter?.addEventListener("click", () => {
    if (modalNewsletter) {
        modalNewsletter.classList.add("show");
        modalNewsletter.setAttribute("aria-hidden", "false");
    }
});

closeModal?.addEventListener("click", () => {
    if (modalNewsletter) {
        modalNewsletter.classList.remove("show");
        modalNewsletter.setAttribute("aria-hidden", "true");
    }
});

cancelModal?.addEventListener("click", () => {
    if (modalNewsletter) {
        modalNewsletter.classList.remove("show");
        modalNewsletter.setAttribute("aria-hidden", "true");
    }
});

// fechar clicando fora do modal
modalNewsletter?.addEventListener("click", (e) => {
    if (e.target === modalNewsletter) {
        modalNewsletter.classList.remove("show");
        modalNewsletter.setAttribute("aria-hidden", "true");
    }
});


/* ============================================================
    ANO AUTOMÁTICO NO FOOTER
    ============================================================ */
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}