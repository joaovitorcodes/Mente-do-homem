/* =====================================
   🎬 MENTE DO HOMEM — script.js (melhorado)
   ===================================== */

// ======== DADOS DE FILMES ========
const filmes = [
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

// ======== ELEMENTOS ========
const grid = document.getElementById("filmesGrid");
const searchInput = document.getElementById("searchFilmes");
const genreFilter = document.getElementById("genreFilter");
const yearSpan = document.getElementById("year2");
const btnTheme = document.getElementById("btnTheme2");
const btnMenu = document.getElementById("btnMenu2");
const mainNav = document.querySelector(".main-nav");

// ======== MOSTRAR FILMES ========
function renderFilmes(lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `<p style="text-align:center;opacity:0.8;">Nenhum resultado encontrado.</p>`;
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

    grid.appendChild(card);
  });
}

// ======== FILTRAGEM ========
function filtrarFilmes() {
  const termo = searchInput.value.toLowerCase();
  const genero = genreFilter.value;

  const filtrados = filmes.filter(f =>
    (genero === "all" || f.genero === genero) &&
    f.titulo.toLowerCase().includes(termo)
  );

  renderFilmes(filtrados);
}

// ======== EVENTOS DE FILTRO ========
searchInput.addEventListener("input", filtrarFilmes);
genreFilter.addEventListener("change", filtrarFilmes);

// ======== TEMA ESCURO / CLARO ========
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  if (document.body.classList.contains("light-theme")) {
    document.documentElement.style.setProperty("--bg", "#f2f2f2");
    document.documentElement.style.setProperty("--text", "#1a1a1a");
    document.documentElement.style.setProperty("--surface", "#ffffff");
    document.documentElement.style.setProperty("--card", "#f5f5f5");
  } else {
    document.documentElement.style.setProperty("--bg", "#050406");
    document.documentElement.style.setProperty("--text", "#f0f0f2");
    document.documentElement.style.setProperty("--surface", "#0d0d11");
    document.documentElement.style.setProperty("--card", "#151520");
  }
});

// ======== MENU MOBILE ========
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

// ======== ANO AUTOMÁTICO ========
yearSpan.textContent = new Date().getFullYear();

// ======== INICIALIZAÇÃO ========
renderFilmes(filmes);
