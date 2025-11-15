/* comunidade.js — versão unificada e limpa
   - Mantém ADMIN = adminuser / adminpassword
   - Registro/login/perfil/admin (localStorage)
   - Preview de foto, edição de perfil, exclusão de perfil
   - Sessão em sessionStorage
   - Novo tópico (mdh_topics) com armazenamento e render
   - Código defensivo: não quebra se elementos estiverem ausentes
*/

document.addEventListener('DOMContentLoaded', () => {
  // ---------- CONFIGURAÇÃO ----------
  const ADMIN_USERNAME = 'adminuser';
  const ADMIN_PASSWORD = 'adminpassword';
  const STORAGE_USERS = 'profiles';   // key compatível com seu primeiro script
  const STORAGE_TOPICS = 'mdh_topics';
  const DEFAULT_PHOTO = ''; // mantiene vazio — o HTML/CSS mostra placeholder se quiser

  // ---------- UTILITÁRIOS DOM ----------
  const $ = sel => document.getElementById(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const qs = sel => document.querySelector(sel);

  // ---------- SELETORES (defensivos) ----------
  const sections = {
    auth: $('authSection'),
    profile: $('profileSection'),
    editForm: $('editFormSection'),
    admin: $('adminSection')
  };

  // forms/auth
  const loginForm = $('loginForm');            // modal login (se existir)
  const registerForm = $('registerForm');      // opcional
  const showRegisterBtn = $('showRegisterBtn');
  const showLoginBtn = $('showLoginBtn');
  const authMsg = $('authMsg');
  const registerMsg = $('registerMsg');

  // login inputs (vários nomes possíveis para compatibilidade)
  const loginUsername = $('loginUsername') || $('loginEmail') || null;
  const loginSenha = $('loginSenha') || $('loginPassword') || null;
  const registerUsername = $('registerUsername') || null;
  const registerEmail = $('registerEmail') || null;
  const registerSenha = $('registerSenha') || null;

  // profile view/edit
  const btnLogout = $('btnLogout') || $('btnLogoutTop') || $('logoutBtn') || null;
  const btnEditProfile = $('btnEditProfile') || null;
  const btnCancelEdit = $('btnCancelEdit') || null;
  const editForm = $('editForm') || $('profileForm') || null;

  // elements for display (defensivos)
  const displayFoto = $('displayFoto') || null;
  const displayNome = $('displayNome') || null;
  const displayEmail = $('displayEmail') || null;
  const previewEditFoto = $('previewEditFoto') || $('previewFoto') || null;

  // admin panel
  const usersList = $('usersList') || null;
  const adminDisplay = $('adminDisplay') || null;
  const adminDisplayUsername = $('adminDisplayUsername') || null;
  const adminDisplayNome = $('adminDisplayNome') || null;
  const adminDisplayEmail = $('adminDisplayEmail') || null;
  const adminDisplayFoto = $('adminDisplayFoto') || null;

  // new topic
  const newTopicForm = $('newTopicForm') || qs('.new-topic form') || null;
  const topicsContainer = $('topicsContainer') || qs('.topics-container') || null;

  // comments area (optional)
  const newCommentForm = $('newCommentForm') || null;
  const commentsContainer = $('commentsContainer') || null;
  const commentCount = $('commentCount') || null;

  // --------- estado ----------
  let users = loadUsers(); // objeto username -> user
  let currentUser = null;  // object or username string (we'll normalize)
  let isAdmin = false;
  let previewDataUrl = ''; // para upload de foto (base64)

  // ---------- STORAGE HELPERS ----------
  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    } catch (e) {
      console.error('Erro lendo users do localStorage', e);
      return {};
    }
  }
  function saveUsers() {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Erro gravando users', e);
    }
  }

  function loadTopics() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_TOPICS) || '[]');
    } catch {
      return [];
    }
  }
  function saveTopics(list) {
    try {
      localStorage.setItem(STORAGE_TOPICS, JSON.stringify(list));
    } catch (e) {
      console.error('Erro salvando tópicos', e);
    }
  }

  // ---------- SESSÃO ----------
  function setSessionUser(userObjOrString, adminFlag = false) {
    if (!userObjOrString) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAdmin');
      currentUser = null;
      isAdmin = false;
      return;
    }
    // armazenar objeto mínimo { username, nome?, perfil? } para compatibilidade
    if (typeof userObjOrString === 'string') {
      sessionStorage.setItem('currentUser', JSON.stringify(userObjOrString));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(userObjOrString));
    }
    sessionStorage.setItem('isAdmin', adminFlag ? 'true' : 'false');
    isAdmin = !!adminFlag;
    currentUser = userObjOrString;
  }

  function getSessionUserNormalized() {
    const stored = sessionStorage.getItem('currentUser');
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      // parsed pode ser string (username) ou objeto
      if (typeof parsed === 'object' && parsed.username) return parsed;
      if (typeof parsed === 'string') {
        const u = users[parsed];
        return u ? u : parsed;
      }
      return null;
    } catch {
      // stored not JSON — fallback
      const str = stored;
      return users[str] ? users[str] : str;
    }
  }

  // ---------- UI helpers ----------
  function hideAllSections() {
    Object.values(sections).forEach(s => { if (s) s.classList.add('hidden'); });
  }
  function showSection(el) { if (el) el.classList.remove('hidden'); }

  function safeText(v) { return (v === undefined || v === null) ? '' : v; }

  // ---------- RENDER / ADMIN ----------
  function renderAdminList() {
    if (!usersList || !adminDisplay) return;
    usersList.innerHTML = '';
    adminDisplay.classList.add('hidden');

    const keys = Object.keys(users).sort();
    keys.forEach(username => {
      if (username === ADMIN_USERNAME) return; // não listar admin
      const li = document.createElement('li');
      li.textContent = username + (users[username].nome ? ` (${users[username].nome})` : '');
      li.className = 'admin-user-item';
      li.addEventListener('click', () => {
        adminDisplay.classList.remove('hidden');
        adminDisplayUsername && (adminDisplayUsername.textContent = username);
        adminDisplayNome && (adminDisplayNome.textContent = safeText(users[username].nome || 'N/A'));
        adminDisplayEmail && (adminDisplayEmail.textContent = safeText(users[username].email || 'N/A'));
        adminDisplayFoto && (adminDisplayFoto.src = users[username].foto || DEFAULT_PHOTO || '');
      });
      usersList.appendChild(li);
    });
  }

  function renderProfileView() {
    // se admin
    if (isAdmin) {
      hideAllSections();
      showSection(sections.admin || adminDisplay);
      renderAdminList();
      return;
    }

    // usuário padrão
    const sess = getSessionUserNormalized();
    if (!sess) {
      // se não tiver sessão, mostra auth
      hideAllSections();
      showSection(sections.auth);
      if (registerForm) registerForm.classList.add('hidden');
      return;
    }

    // se sess é string -> username ; se objeto -> object
    let usernameKey = (typeof sess === 'string') ? sess : (sess.username || sess);
    const userObj = users[usernameKey] || sess;
    hideAllSections();
    showSection(sections.profile);

    // atualiza UI display se existir
    if (displayFoto) displayFoto.src = (userObj && userObj.foto) ? userObj.foto : (DEFAULT_PHOTO || '');
    if (displayNome) displayNome.textContent = (userObj && (userObj.nome || (userObj.perfil && userObj.perfil.nome))) || usernameKey;
    if (displayEmail) displayEmail.textContent = (userObj && (userObj.email || (userObj.perfil && userObj.perfil.email))) || '';

    // preenche campos de edição defensivamente
    if (editForm) {
      const nameField = editForm.querySelector('[name="nome"]') || editForm.querySelector('#editNome');
      const fotoPreview = previewEditFoto;
      if (nameField) nameField.value = (userObj && (userObj.nome || (userObj.perfil && userObj.perfil.nome))) || '';
      if (fotoPreview) {
        fotoPreview.src = (userObj && (userObj.foto || (userObj.perfil && userObj.perfil.foto))) || DEFAULT_PHOTO || '';
      }
    }
  }

  // ---------- AUTH: handlers (defensivos) ----------
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', () => {
      if (loginForm) loginForm.classList.add('hidden');
      if (registerForm) registerForm.classList.remove('hidden');
      if (authMsg) authMsg.textContent = '';
    });
  }
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
      if (registerForm) registerForm.classList.add('hidden');
      if (loginForm) loginForm.classList.remove('hidden');
      if (registerMsg) registerMsg.textContent = '';
    });
  }

  // login submit (compatível com username/email)
  if (loginForm && loginSenha) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (authMsg) authMsg.textContent = '';

      const entered = (loginUsername && loginUsername.value || '').trim();
      const senha = loginSenha.value || '';

      if (!entered || !senha) {
        if (authMsg) authMsg.textContent = 'Preencha os campos.';
        return;
      }

      // admin direct (suporta username adminuser)
      if ((entered === ADMIN_USERNAME) && senha === ADMIN_PASSWORD) {
        // marca sessão como admin (cria admin user entry se necessário)
        users = loadUsers();
        if (!users[ADMIN_USERNAME]) {
          users[ADMIN_USERNAME] = { nome: ADMIN_USERNAME, email: ADMIN_USERNAME, senha: ADMIN_PASSWORD, foto: DEFAULT_PHOTO };
          saveUsers();
        }
        setSessionUser(ADMIN_USERNAME, true);
        // recarrega UI
        renderProfileView();
        return;
      }

      // procurar por username exato primeiro
      users = loadUsers();
      if (users[entered] && users[entered].senha === senha) {
        setSessionUser(entered, false);
        renderProfileView();
        return;
      }

      // procurar por email (compatibilidade com segundo script)
      const foundKey = Object.keys(users).find(k => (users[k].email || '').toLowerCase() === entered.toLowerCase());
      if (foundKey && users[foundKey].senha === senha) {
        setSessionUser(foundKey, false);
        renderProfileView();
        return;
      }

      if (authMsg) authMsg.textContent = 'E-mail/Usuário ou senha incorretos.';
    });
  }

  // registro (se existir)
  if (registerForm && registerUsername && registerEmail && registerSenha) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (registerMsg) registerMsg.textContent = '';

      const username = (registerUsername.value || '').trim();
      const email = (registerEmail.value || '').trim().toLowerCase();
      const senha = (registerSenha.value || '').trim();

      if (!username || !email || !senha) {
        if (registerMsg) registerMsg.textContent = 'Preencha todos os campos.';
        return;
      }
      if (senha.length < 4) {
        if (registerMsg) registerMsg.textContent = 'Senha muito curta.';
        return;
      }
      users = loadUsers();
      if (users[username]) {
        if (registerMsg) registerMsg.textContent = 'Nome de usuário já existe.';
        return;
      }
      // email duplicado?
      const emailExists = Object.values(users).some(u => (u.email || '').toLowerCase() === email);
      if (emailExists) {
        if (registerMsg) registerMsg.textContent = 'E-mail já cadastrado.';
        return;
      }
      if (username === ADMIN_USERNAME) {
        if (registerMsg) registerMsg.textContent = 'Nome de usuário reservado.';
        return;
      }

      // cria usuário simples compatível com ambos scripts
      users[username] = {
        username,
        nome: username,
        email,
        senha,
        foto: DEFAULT_PHOTO,
        perfil: { nome: username, foto: DEFAULT_PHOTO }
      };
      saveUsers();
      alert('Cadastro realizado! Faça login.');
      if (loginForm) {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        if (loginUsername) loginUsername.value = username;
        if (loginSenha) loginSenha.value = '';
      }
    });
  }

  // editar perfil: preview foto (mecanismo defensivo p/ inputs variáveis)
  const fileInputs = $$('input[type="file"]');
  fileInputs.forEach(inp => {
    inp.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewDataUrl = ev.target.result;
        // tenta atualizar previewEditFoto ou previewFoto
        if (previewEditFoto) previewEditFoto.src = previewDataUrl;
        const pf = $('previewFoto');
        if (pf) pf.src = previewDataUrl;
      };
      reader.readAsDataURL(file);
    });
  });

  // editar perfil submit (defensivo: usa editForm se existir)
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // assegura user logged
      const sess = getSessionUserNormalized();
      if (!sess) return alert('Nenhum usuário logado.');
      users = loadUsers();
      const usernameKey = (typeof sess === 'string') ? sess : (sess.username || sess);
      const userObj = users[usernameKey] || (users[usernameKey] = { username: usernameKey, perfil: {} });

      // coleta possíveis campos dentro do form (compatibilidade)
      const nameField = editForm.querySelector('[name="nome"]') || editForm.querySelector('#editNome');
      const emailField = editForm.querySelector('[name="email"]') || editForm.querySelector('#editEmail');
      const ageField = editForm.querySelector('[name="idade"]') || null;
      const bioField = editForm.querySelector('[name="bio"]') || null;

      userObj.nome = (nameField && nameField.value.trim()) || userObj.nome || usernameKey;
      if (emailField) userObj.email = emailField.value.trim() || userObj.email;
      // perfil detalhado (defensivo)
      userObj.perfil = userObj.perfil || {};
      if (ageField) userObj.perfil.idade = ageField.value || userObj.perfil.idade || '';
      if (bioField) userObj.perfil.bio = bioField.value.trim() || userObj.perfil.bio || '';

      // foto: usa previewDataUrl se definido
      if (previewDataUrl && previewDataUrl.startsWith('data:image/')) {
        userObj.foto = previewDataUrl;
        userObj.perfil.foto = previewDataUrl;
      } else {
        userObj.foto = userObj.foto || DEFAULT_PHOTO;
      }

      users[usernameKey] = userObj;
      saveUsers();
      setSessionUser(userObj, isAdmin);
      alert('Perfil salvo com sucesso!');
      // atualiza view
      renderProfileView();
    });
  }

  // btnEditProfile navigation
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      hideAllSections();
      showSection(sections.editForm);
    });
  }
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      renderProfileView();
    });
  }

  // logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      setSessionUser(null, false);
      alert('Você saiu da sessão.');
      setTimeout(() => location.reload(), 150);
    });
  }

  // admin delete function (exposta)
  function adminDeleteUser(username) {
    if (!confirm(`Excluir o usuário "${username}"? Esta ação é irreversível.`)) return;
    users = loadUsers();
    delete users[username];
    saveUsers();
    renderAdminList();
    alert('Usuário excluído.');
  }
  window.__adminDeleteUser = adminDeleteUser; // debug

  // adiciona botão de excluir no painel admin (se existir adminDisplay)
  if (adminDisplay) {
    const area = document.createElement('div');
    area.className = 'admin-actions';
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Excluir Usuário Selecionado';
    delBtn.addEventListener('click', () => {
      const target = adminDisplayUsername && adminDisplayUsername.textContent;
      if (target) adminDeleteUser(target);
    });
    area.appendChild(delBtn);
    adminDisplay.appendChild(area);
  }

  // ---------- NOVO TÓPICO (integração simples) ----------
  function renderTopics() {
    if (!topicsContainer) return;
    const topics = loadTopics();
    topicsContainer.innerHTML = '';
    if (!topics.length) {
      topicsContainer.innerHTML = '<p class="muted">Nenhum tópico criado ainda.</p>';
      return;
    }
    topics.slice().reverse().forEach(t => {
      const div = document.createElement('div');
      div.className = 'topic-card';
      div.innerHTML = `
        <h3>${escapeHtml(t.title)}</h3>
        <small>${escapeHtml(t.type)} • ${new Date(t.date).toLocaleString()}</small>
        <p>${escapeHtml(t.description)}</p>
        <div style="margin-top:8px"><button class="btn view-topic" data-id="${t.id}">Abrir</button></div>
      `;
      topicsContainer.appendChild(div);
    });

    // attach view buttons (opens detail if you have a detail implementation)
    topicsContainer.querySelectorAll('.view-topic').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openTopicDetail(id);
      });
    });
  }

  function openTopicDetail(id) {
    // se houver uma view de detalhe no DOM, preencha; caso contrário, apenas alerta
    const topics = loadTopics();
    const t = topics.find(x => x.id === id);
    if (!t) return;
    const detailTitle = $('detailTitle');
    const detailCategory = $('detailCategory');
    const detailAuthor = $('detailAuthor');
    const detailContent = $('detailContent');
    if (detailTitle) detailTitle.textContent = t.title;
    if (detailCategory) detailCategory.textContent = t.type;
    if (detailAuthor) detailAuthor.textContent = t.author || 'Anônimo';
    if (detailContent) detailContent.innerHTML = `<p>${escapeHtml(t.description)}</p>`;
    // mostra a view detail se existir
    const listView = $('listView');
    const detailView = $('detailView');
    if (listView) listView.classList.add('hidden');
    if (detailView) detailView.classList.remove('hidden');
  }

  if (newTopicForm) {
    newTopicForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (newTopicForm.querySelector('#topicTitle') || newTopicForm.querySelector('[name="title"]')).value.trim();
      const description = (newTopicForm.querySelector('#topicDesc') || newTopicForm.querySelector('[name="description"]')).value.trim();
      const type = (newTopicForm.querySelector('#topicType') || newTopicForm.querySelector('[name="type"]')).value;

      if (!title || !description || !type) {
        alert('Por favor, preencha todos os campos do tópico.');
        return;
      }

      const topics = loadTopics();
      const topic = {
        id: 't' + Date.now(),
        title,
        description,
        type,
        author: (getSessionUserNormalized() && (getSessionUserNormalized().nome || getSessionUserNormalized().username)) || 'Anônimo',
        date: new Date().toISOString()
      };
      topics.push(topic);
      saveTopics(topics);
      // limpa
      newTopicForm.reset();
      renderTopics();
      // scroll para tópicos
      topicsContainer && topicsContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- COMENTÁRIOS simples (se existir) ----------
  if (newCommentForm && commentsContainer) {
    newCommentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = $('commentAuthor') ? $('commentAuthor').value.trim() : 'Anônimo';
      const content = $('commentContent') ? $('commentContent').value.trim() : '';
      if (!content) return alert('Comentário vazio.');
      // armazenar por tópico futuramente; por enquanto push global
      const key = 'mdh_comments';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ id: 'c' + Date.now(), author, content, date: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
      $('commentContent') && ($('commentContent').value = '');
      renderComments();
    });
  }
  function renderComments() {
    if (!commentsContainer) return;
    const list = JSON.parse(localStorage.getItem('mdh_comments') || '[]');
    commentsContainer.innerHTML = '';
    if (!list.length) {
      commentsContainer.innerHTML = '<p class="muted">Nenhum comentário.</p>';
      commentCount && (commentCount.textContent = '0');
      return;
    }
    list.slice().reverse().forEach(c => {
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<strong>${escapeHtml(c.author)}</strong> • <small>${new Date(c.date).toLocaleString()}</small><p>${escapeHtml(c.content)}</p>`;
      commentsContainer.appendChild(div);
    });
    commentCount && (commentCount.textContent = String(list.length));
  }

  // ---------- UI pequeno helpers ----------
  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- Inicialização ----------
  (function init() {
    users = loadUsers();
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed.username) currentUser = parsed;
        else if (typeof parsed === 'string' && users[parsed]) currentUser = users[parsed];
        else currentUser = parsed;
      } catch {
        if (users[stored]) currentUser = users[stored];
        else currentUser = stored;
      }
    } else {
      currentUser = null;
    }
    isAdmin = (sessionStorage.getItem('isAdmin') === 'true');

    // render topics & comments immediately if containers exist
    renderTopics();
    renderComments();

    // se usuário logado, mostra perfil/admin; se não, mostra auth
    if (currentUser) {
      renderProfileView();
    } else {
      hideAllSections();
      showSection(sections.auth);
      if (registerForm) registerForm.classList.add('hidden');
    }

    // inicializa dropdown toggles (se houver)
    initDropdowns();
    // inicializa mobile menu toggle se houver
    initMobileMenu();
  })();

  // ---------- Dropdowns / Mobile menu (simples e defensivos) ----------
  function initDropdowns() {
    $$('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = btn.closest('.dropdown');
        if (!parent) return;
        // fecha outros
        $$('.dropdown.active').forEach(d => { if (d !== parent) d.classList.remove('active'); });
        parent.classList.toggle('active');
      });
    });
    document.addEventListener('click', () => {
      $$('.dropdown.active').forEach(d => d.classList.remove('active'));
    });
  }

  function initMobileMenu() {
    const btnMenu = $('btnMenu') || $('btnMenu2');
    const nav = $('mainNav') || qs('.main-nav');
    if (!btnMenu || !nav) return;
    btnMenu.addEventListener('click', () => {
      nav.classList.toggle('menu-open');
      if (!nav.style.display || nav.style.display === 'none') {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
      } else nav.style.display = 'none';
    });
  }

  // expose some helpers for debugging / external use
  window._comunidade = {
    loadUsers,
    saveUsers,
    loadTopics,
    saveTopics,
    renderTopics,
    renderComments,
    adminDeleteUser
  };
});
