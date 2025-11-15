// comunidade.js — Comunidade de Desenvolvimento Pessoal 2.0 (atualizado)
// Inclui: escolha de tópico para comentar + badges + exclusão de grupos com confirmação.

// ---------- CONFIG ----------
const LS_KEY = "cdp_groups_v1";
const ADMIN_PASSWORD = "João adm";

// ---------- SELECTORES ----------
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const newTopicSection = document.querySelector(".new-topic");
const newTopicForm = document.getElementById("newTopicForm");
const topicsContainer = document.getElementById("topicsContainer");
const newCommentForm = document.getElementById("newCommentForm");
const commentsContainer = document.getElementById("commentsContainer");
const commentCountSpan = document.getElementById("commentCount");
const currentYear = document.getElementById("currentYear");

// ---------- ESTADO ----------
let isAdmin = false;
let currentGroup = null;
let groups = loadGroupsFromStorage();
let selectedTopicId = null;

// ---------- UTIL ----------
function toast(msg, timeout = 2200) {
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    position: "fixed",
    bottom: "22px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(90deg, rgba(0,201,126,0.12), rgba(0,201,126,0.05))",
    color: "var(--text-main, #eaf6f3)",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(0,201,126,0.12)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
    zIndex: 12000,
    fontWeight: 600,
    opacity: "0",
    transition: "opacity 220ms ease, transform 220ms ease"
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = "1";
  });
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 260);
  }, timeout);
}

function showModal() {
  loginModal.classList.add("is-visible");
  loginModal.setAttribute("aria-hidden", "false");
  setTimeout(() => document.getElementById("adminPassword")?.focus(), 120);
}

function hideModal() {
  loginModal.classList.remove("is-visible");
  loginModal.setAttribute("aria-hidden", "true");
}

function formatBadge(role) {
  if (role === "admin") return `<span class="user-badge admin">ADM</span>`;
  if (role === "guest") return `<span class="user-badge guest">VIS</span>`;
  return "";
}

// ---------- STORAGE ----------
function loadGroupsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGroupsToStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(groups));
}

// ---------- RENDER ----------
function renderGroups() {
  topicsContainer.innerHTML = "";

  if (groups.length === 0) {
    topicsContainer.innerHTML = `<p style="color:var(--text-muted)">Nenhum grupo criado ainda.</p>`;
    return;
  }

  groups.forEach(group => {
    const div = document.createElement("div");
    div.className = "topic-card";

    const creatorBadge = group.createdByRole ? formatBadge(group.createdByRole) : "";

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;">
        <div>
          ${creatorBadge}<strong style="color:var(--accent)">${escapeHtml(group.name)}</strong>
          <div style="color:var(--text-muted);margin-top:6px">${escapeHtml(group.description)}</div>
          <small style="color:var(--text-muted)">Tópicos: ${group.topics.length}</small>
        </div>
      </div>
    `;

    const btnWrap = document.createElement("div");
    btnWrap.style.display = "flex";
    btnWrap.style.gap = "8px";

    const btnEnter = document.createElement("button");
    btnEnter.textContent = "Entrar no Grupo";
    btnEnter.addEventListener("click", () => enterGroup(group.id));
    btnWrap.appendChild(btnEnter);

    if (isAdmin) {
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Excluir Grupo";
      btnDelete.style.background = "#b82828";
      btnDelete.addEventListener("click", () => deleteGroup(group.id));
      btnWrap.appendChild(btnDelete);
    }

    div.appendChild(btnWrap);
    topicsContainer.appendChild(div);
  });
}

function deleteGroup(groupId) {
  if (!isAdmin) return;

  const group = groups.find(g => g.id === groupId);
  if (!group) return;

  const confirmDelete = confirm(
    `Tem certeza que deseja excluir o grupo "${group.name}"?\nEssa ação não poderá ser desfeita.`
  );

  if (!confirmDelete) {
    toast("Exclusão cancelada.");
    return;
  }

  groups = groups.filter(g => g.id !== groupId);
  saveGroupsToStorage();

  currentGroup = null;
  selectedTopicId = null;

  toast("Grupo excluído com sucesso!");
  renderGroups();
}

function renderGroupTopics() {
  topicsContainer.innerHTML = "";
  commentsContainer.innerHTML = "";
  commentCountSpan.textContent = "0";

  const headerDiv = document.createElement("div");
  headerDiv.className = "topic-card";

  headerDiv.innerHTML = `
    <h3>${escapeHtml(currentGroup.name)}</h3>
    <p style="color:var(--text-muted)">${escapeHtml(currentGroup.description)}</p>
    <small style="color:var(--text-muted)">Tópicos: ${currentGroup.topics.length}</small>
  `;

  const backBtn = document.createElement("button");
  backBtn.textContent = "Voltar à lista";
  backBtn.addEventListener("click", showListView);

  headerDiv.appendChild(backBtn);
  topicsContainer.appendChild(headerDiv);

  if (currentGroup.topics.length === 0) {
    topicsContainer.innerHTML += `<p style="color:var(--text-muted)">Nenhum tópico neste grupo.</p>`;
    return;
  }

  currentGroup.topics.forEach(topic => {
    const div = document.createElement("div");
    div.className = "topic-card";

    const creatorBadge = topic.createdByRole ? formatBadge(topic.createdByRole) : "";

    div.innerHTML = `
      ${creatorBadge}<strong style="color:var(--accent)">${escapeHtml(topic.title)}</strong>
      <div style="color:var(--text-muted);margin-top:6px">${escapeHtml(topic.description)}</div>
      <small style="color:var(--text-muted)">Tipo: ${escapeHtml(topic.type)}</small>
    `;

    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "8px";

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "Ver comentários";
    viewBtn.addEventListener("click", () => {
      selectedTopicId = topic.id;
      renderComments(topic);
    });

    const commentBtn = document.createElement("button");
    commentBtn.textContent = "Comentar";
    commentBtn.addEventListener("click", () => {
      selectedTopicId = topic.id;
      renderComments(topic);
      document.getElementById("commentAuthor")?.focus();
      toast("Tópico selecionado para comentar.");
    });

    wrap.append(viewBtn, commentBtn);
    div.appendChild(wrap);
    topicsContainer.appendChild(div);
  });

  if (selectedTopicId) {
    const topic = currentGroup.topics.find(t => t.id === selectedTopicId);
    if (topic) renderComments(topic);
  }
}

function renderComments(topic) {
  commentsContainer.innerHTML = "";

  const header = document.createElement("div");
  header.className = "topic-card";
  header.innerHTML = `<strong style="color:var(--accent)">${escapeHtml(topic.title)}</strong>`;
  commentsContainer.appendChild(header);

  if (!topic.comments.length) {
    commentsContainer.innerHTML += `<p style="color:var(--text-muted)">Nenhum comentário.</p>`;
    commentCountSpan.textContent = "0";
    return;
  }

  topic.comments.forEach(comment => {
    const div = document.createElement("div");
    div.className = "comment";
    const badgeHtml = comment.role ? formatBadge(comment.role) : "";
    div.innerHTML = `
      <div>${badgeHtml}<strong>${escapeHtml(comment.author)}</strong></div>
      <p>${escapeHtml(comment.content)}</p>
    `;
    commentsContainer.appendChild(div);
  });

  commentCountSpan.textContent = String(topic.comments.length);
}

// ---------- LOGIN ----------
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const pwd = document.getElementById("adminPassword")?.value.trim() || "";

    isAdmin = pwd === ADMIN_PASSWORD;
    hideModal();

    toast(isAdmin ? "Bem-vindo, Administrador!" : "Entrou como visitante.");
    toggleNewTopicSection();
    renderGroups();

    document.getElementById("adminPassword").value = "";
  });
}

function loginAsGuest() {
  isAdmin = false;
  hideModal();
  toggleNewTopicSection();
  renderGroups();
  toast("Entrou como visitante.");
}

function logout() {
  isAdmin = false;
  currentGroup = null;
  selectedTopicId = null;
  showModal();
  toast("Sessão encerrada.");
}

function toggleNewTopicSection() {
  newTopicSection.style.display = isAdmin ? "block" : "none";
}

// ---------- CRIAR GRUPO ----------
if (newTopicForm) {
  newTopicForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!isAdmin) return toast("Somente ADM cria grupos.");

    const title = document.getElementById("topicTitle").value.trim();
    const description = document.getElementById("topicDesc").value.trim();
    const type = document.getElementById("topicType").value;

    if (!title || !description) return toast("Preencha tudo.");

    groups.unshift({
      id: `group_${Date.now()}`,
      name: title,
      description,
      createdByRole: "admin",
      topics: []
    });

    saveGroupsToStorage();
    renderGroups();
    newTopicForm.reset();
    toast("Grupo criado!");
  });
}

function enterGroup(groupId) {
  currentGroup = groups.find(g => g.id === groupId);
  selectedTopicId = null;
  renderGroupTopics();
  saveGroupsToStorage();
}

// ---------- ADICIONAR TÓPICO ----------
function addTopicToCurrentGroup(title, description, type) {
  if (!currentGroup) return toast("Escolha um grupo.");
  currentGroup.topics.unshift({
    id: `topic_${Date.now()}`,
    title,
    description,
    type,
    createdByRole: isAdmin ? "admin" : "guest",
    comments: []
  });
  saveGroupsToStorage();
  renderGroupTopics();
  toast("Tópico adicionado.");
}

// ---------- COMENTÁRIOS ----------
if (newCommentForm) {
  newCommentForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!currentGroup) return toast("Escolha um grupo.");
    if (!selectedTopicId) return toast("Selecione um tópico para comentar.");

    const author = document.getElementById("commentAuthor").value.trim();
    const content = document.getElementById("commentContent").value.trim();

    if (!author || !content) return toast("Preencha tudo.");

    const topic = currentGroup.topics.find(t => t.id === selectedTopicId);

    topic.comments.push({
      author,
      content,
      role: isAdmin ? "admin" : "guest",
      createdAt: Date.now()
    });

    saveGroupsToStorage();
    renderComments(topic);
    newCommentForm.reset();
    toast("Comentário enviado!");
  });
}

// ---------- HELPERS ----------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showListView() {
  currentGroup = null;
  selectedTopicId = null;
  renderGroups();
}

// ---------- INIT ----------
(function init() {
  if (currentYear) currentYear.textContent = new Date().getFullYear();
  toggleNewTopicSection();
  renderGroups();
  showModal();
})();

// ---------- EXPORTS ----------
window.loginAsGuest = loginAsGuest;
window.logout = logout;
window.enterGroup = enterGroup;
window.addTopicToCurrentGroup = addTopicToCurrentGroup;
window.showListView = showListView;
