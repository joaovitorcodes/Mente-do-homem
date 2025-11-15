/* =======================================================
   MENTE DO HOMEM — script_combinado.js (Ebooks e Filmes)
   ======================================================= */

// =======================
//   DADOS
// =======================

/* --- EBOOKS DISPONÍVEIS --- */
const ebooksData = [
  {
    titulo: "Desperte-Seu-Potencial",
    autor: "João Vitor",
    categoria: "mentalidade",
    preco: 15.0,
    descricao: "Esse ebook é para quem quer evoluir a cada dia; esse ebook é uma autoajuda para servir para quem quer crescer na vida.",
    imagem: "https://s3.amazonaws.com/production.kirvano.com/products/2b3b2d2b-04df-4378-835b-5175c7d8abfa/cover-1762643966291.webp",
    link: "https://pay.kirvano.com/f2206f1f-8725-487f-a37b-9afaf367d4bd"
  },
  {
    titulo: "O Poder da Palavra",
    autor: "João Vitor",
    categoria: "habitos",
    preco: 27.5,
    descricao: "Este e-book explora o poder inerente à palavra, tanto falada quanto escrita, e como ela molda nossa realidade, influencia nossos relacionamentos e impacta o mundo ao nosso redor. Desde a importância.",
    imagem: "https://s3.amazonaws.com/production.kirvano.com/products/089491ea-bd47-49a2-ae5b-bc1ba3e9712e/cover-1744952693484.webp",
    link: "https://pay.kirvano.com/5017377b-3a7c-4a7a-b73e-0d855c3f741e"
  },
  {
    titulo: "como ganhar dinheiro em casa",
    autor: "João Vitor",
    categoria: "habitos",
    preco: 27.99,
    descricao: "Descubra 50 formas práticas de ganhar dinheiro sem sair de casa! Ideias acessíveis, lucrativas e fáceis de começar hoje. Transforme seu tempo livre em renda extra agora mesmo!",
    imagem: "https://s3.amazonaws.com/production.kirvano.com/products/e3cc74d9-9289-4065-9332-a4019e86dd28/cover-1749263181705.webp",
    link: "https://pay.kirvano.com/155b7feb-176a-434c-87ce-d80de1f87cca"
  },
  {
    titulo: "Mentalidade de Sucesso",
    autor: "João Vitor",
    categoria: "mentalidade",
    preco: 30.00,
    descricao: "Pequenos hábitos. Grandes mudanças. Um guia prático para transformar sua vida com passos simples.",
    imagem: "https://s3.amazonaws.com/production.kirvano.com/products/4a8f3635-a3cf-4524-8f87-ae51f116dfdb/cover-1744305680787.webp",
    link: "https://pay.kirvano.com/39b43d59-cf5b-4b2e-b2a2-616e25eb3cf4"
  }
];

// ======== DADOS DE FILMES ========
const filmesData = [
  {
    titulo: "Em Busca da Felicidade",
    genero: "drama",
    descricao: "Baseado em uma história real, mostra a jornada inspiradora de Chris Gardner em busca de uma vida melhor.",
    imagem: "data:image/jpeg;base64,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",
    link: "https://www.hbomax.com/br/pt/movies/a-procura-da-felicidade/7ddaa0e4-7235-40d4-8b96-485f71e86509?utm_source=universal_search"
  },
  {
    titulo: "Sim Senhor!",
    genero: "Romance",
    descricao: "Carl Allen é um homem que perdeu muitas oportunidades por causa da palavra não. Ele decide ir para um seminário de autoajuda para aprender a dizer sim.",
    imagem: "https://m.media-amazon.com/images/S/pv-target-images/93c670a4c21235724c5e7afbb0a72474cc47fd9d185eeff98fe71f9a22e08a96.jpg",
    link: "https://www.hbomax.com/br/pt/movies/sim-senhor/d52bdabf-7e77-4c3a-91f0-77cdebb24ae0?utm_source=universal_search"
  },
  {
    titulo: "Coach Carter",
    genero: "sports",
    descricao: "Em 1999, Ken Carter retorna para sua antiga escola em Richmond, Califórnia, aceitando se tornar o treinador do time de basquete para colocá-lo em forma.",
    imagem: "https://preview.redd.it/coach-carter-2005-v0-w913tc7yj0nd1.jpeg?auto=webp&s=6d561f35b6859a9b0c169bacbdc2186330239eaa",
    link: "https://www.netflix.com/br/title/70019004?source=35&fromWatch=true"
  },
  {
    titulo: "O Jogo da Imitação",
    genero: "drama",
    descricao: "O Jogo da Imitação é um drama biográfico intenso sobre o matemático Alan Turing durante a Segunda Guerra Mundial.",
    imagem: "https://portalclubedeengenharia.org.br/wp-content/uploads/2024/07/01-10-o-jogo-da-imitacao.jpg",
    link: "https://www.hbomax.com/br/pt/movies/o-jogo-da-imitacao/83e518fa-7f76-47d0-a607-227b53bf3e6c?utm_source=universal_search"
  },
  {
    titulo: "Hacks",
    genero: "drama",
    descricao: "Uma relação obscura de mentoria se forma entre uma comediante lendária de Las Vegas e uma escritora de comédia convencida e excluída de 25 anos.",
    imagem: "https://br.web.img3.acsta.net/pictures/21/04/29/18/00/2941226.jpg",
    link: "https://www.hbomax.com/br/pt/shows/hacks/67e940b7-aab2-46ce-a62b-c7308cde9de7?utm_source=universal_search"
  },
  {
    titulo: "Peaky Blinders",
    genero: "drama",
    descricao: "Uma notória gangue da Inglaterra de 1919 ascende no submundo liderada pelo cruel Tommy Shelby, um criminoso disposto a subir na vida a qualquer preço.",
    imagem: "https://images.justwatch.com/poster/174596723/s718/peaky-blinders.jpg",
    link: "https://www.netflix.com/br/title/80002479?source=35&fromWatch=true"
  }
];

// =======================
//   ELEMENTOS
// =======================

// --- Ebooks ---
const ebookGrid = document.getElementById("ebooksGrid");
const ebookSearchInput = document.getElementById("searchEbooks");
const ebookCategorySelect = document.getElementById("categoryEbook");
// Assumindo que os elementos de Ano e Tema serão unificados no DOM.

// --- Filmes ---
const filmeGrid = document.getElementById("filmesGrid");
const filmeSearchInput = document.getElementById("searchFilmes");
const filmeGenreFilter = document.getElementById("genreFilter");
const btnMenu = document.getElementById("btnMenu2");
const mainNav = document.querySelector(".main-nav");

// --- Comum ---
// Tentando suportar botões de tema com IDs diferentes (btnTheme4 e btnTheme2)
const themeButtons = [
  document.getElementById("btnTheme4"),
  document.getElementById("btnTheme2")
].filter(btn => btn !== null); // Filtra se algum ID não existir

const yearSpans = [
  document.getElementById("year4"),
  document.getElementById("year2")
].filter(span => span !== null);

// =======================
//   LÓGICA COMUM
// =======================

/* --- ANO AUTOMÁTICO --- */
const currentYear = new Date().getFullYear();
yearSpans.forEach(span => {
  span.textContent = currentYear;
});

/* --- TEMA CLARO/ESCURO --- */

// Aplica o tema imediatamente se estiver no localStorage
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  // O código original de filmes usava a classe 'light-theme' e modificava variáveis CSS
  // Para unificar, vou preferir o toggle de classe no 'body' e a lógica de CSS em JS,
  // mas o código original de ebooks só usava a classe 'light'.
  // Vamos adaptar a função para aplicar o CSS dos filmes também quando for 'light'.
  applyTheme(true);
} else {
  // Garante que o tema escuro/default está aplicado no CSS (se o light-theme CSS estiver ativo)
  // Se o body não tiver a classe 'light', assume-se o tema 'dark'.
  applyTheme(false);
}

function applyTheme(isLight) {
  if (isLight) {
    // Lógica CSS para tema claro (do filmes.js)
    document.documentElement.style.setProperty("--bg", "#f2f2f2");
    document.documentElement.style.setProperty("--text", "#1a1a1a");
    document.documentElement.style.setProperty("--surface", "#ffffff");
    document.documentElement.style.setProperty("--card", "#f5f5f5");
  } else {
    // Lógica CSS para tema escuro (do filmes.js)
    document.documentElement.style.setProperty("--bg", "#050406");
    document.documentElement.style.setProperty("--text", "#f0f0f2");
    document.documentElement.style.setProperty("--surface", "#0d0d11");
    document.documentElement.style.setProperty("--card", "#151520");
  }

  // Define a classe 'light' no body (do ebooks.js)
  document.body.classList.toggle("light", isLight);
}


function toggleTheme() {
  const isLight = !document.body.classList.contains("light");
  applyTheme(isLight);
  // Salva no localStorage
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Adiciona o listener para todos os botões de tema encontrados
themeButtons.forEach(btn => {
  btn.addEventListener("click", toggleTheme);
});


// ======== MENU MOBILE (do filmes.js) ========
if (btnMenu && mainNav) {
  btnMenu.addEventListener("click", () => {
    mainNav.classList.toggle("show-menu");
    if (mainNav.classList.contains("show-menu")) {
      mainNav.style.display = "flex";
      mainNav.style.flexDirection = "column";
      mainNav.style.background = "rgba(10,10,12,0.95)";
      mainNav.style.position = "absolute";
      mainNav.style.top = "60px";
      mainNav.style.right = "20px";
      mainNav.style.padding = "20px";
      mainNav.style.borderRadius = "12px";
    } else {
      mainNav.removeAttribute("style");
    }
  });
}


// =======================
//   LÓGICA EBOOKS
// =======================

/* --- GERAR CARDS --- */
function renderEbooks(lista) {
  if (!ebookGrid) return; // Garante que o elemento existe
  ebookGrid.innerHTML = "";
  lista.forEach((ebook) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${ebook.imagem}" alt="${ebook.titulo}" style="width:100%;border-radius:8px;">
      <h3>${ebook.titulo}</h3>
      <p><strong>Autor:</strong> ${ebook.autor}</p>
      <p>${ebook.descricao}</p>
      <p><strong>R$ ${ebook.preco.toFixed(2)}</strong></p>

      <a href="${ebook.link}" class="btnComprar" target="_blank">
        Comprar Agora
      </a>
    `;
    ebookGrid.appendChild(card);
  });
}

/* --- FILTRAGEM --- */
function filtrarEbooks() {
  if (!ebookSearchInput || !ebookCategorySelect) return;
  const termo = ebookSearchInput.value.toLowerCase();
  const categoria = ebookCategorySelect.value;

  const filtrados = ebooksData.filter((ebook) => {
    const tituloMatch = ebook.titulo.toLowerCase().includes(termo);
    const autorMatch = ebook.autor.toLowerCase().includes(termo);
    const categoriaMatch = categoria === "all" || ebook.categoria === categoria;
    return (tituloMatch || autorMatch) && categoriaMatch;
  });

  renderEbooks(filtrados);
}

/* --- EVENTOS DE FILTRO --- */
if (ebookSearchInput) {
  ebookSearchInput.addEventListener("input", filtrarEbooks);
}
if (ebookCategorySelect) {
  ebookCategorySelect.addEventListener("change", filtrarEbooks);
}

// =======================
//   LÓGICA FILMES
// =======================

// ======== MOSTRAR FILMES ========
function renderFilmes(lista) {
  if (!filmeGrid) return; // Garante que o elemento existe
  filmeGrid.innerHTML = "";

  if (lista.length === 0) {
    filmeGrid.innerHTML = `<p style="text-align:center;opacity:0.8;">Nenhum resultado encontrado.</p>`;
    return;
  }

  lista.forEach(filme => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}">
      <h3>${filme.titulo}</h3>
      <p>${filme.descricao}</p>

      ${filme.link
        ? `<a href="${filme.link}" target="_blank" class="btnLinkFilme" style="
              display:inline-block;
              margin-top:12px;
              padding:10px 14px;
              background:var(--accent-2);
              color:white;
              border-radius:8px;
              font-weight:600;
              text-decoration:none;
            ">Assistir / Ver mais</a>`
        : ""
      }
    `;

    filmeGrid.appendChild(card);
  });
}

// ======== FILTRAGEM ========
function filtrarFilmes() {
  if (!filmeSearchInput || !filmeGenreFilter) return;
  const termo = filmeSearchInput.value.toLowerCase();
  const genero = filmeGenreFilter.value;

  const filtrados = filmesData.filter(f =>
    (genero === "all" || f.genero === genero) &&
    f.titulo.toLowerCase().includes(termo)
  );

  renderFilmes(filtrados);
}

// ======== EVENTOS DE FILTRO ========
if (filmeSearchInput) {
  filmeSearchInput.addEventListener("input", filtrarFilmes);
}
if (filmeGenreFilter) {
  filmeGenreFilter.addEventListener("change", filtrarFilmes);
}

// =======================
//   INICIALIZAÇÃO GERAL
// =======================

// Inicialização de Ebooks
if (ebookGrid) {
  renderEbooks(ebooksData);
  filtrarEbooks();
}

// Inicialização de Filmes
if (filmeGrid) {
  renderFilmes(filmesData);
}