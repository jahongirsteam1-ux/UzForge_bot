export const MINIAPP_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UzForge – Bot Yaratish Platformasi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    :root {
      --bg: #0f172a;
      --card: rgba(30,41,59,0.75);
      --card-hover: rgba(51,65,85,0.9);
      --text: #f8fafc;
      --muted: #94a3b8;
      --purple: #8b5cf6;
      --blue: #3b82f6;
      --cyan: #06b6d4;
      --green: #10b981;
      --border: rgba(255,255,255,0.08);
      --glow: rgba(139,92,246,0.25);
      --radius: 16px;
      --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: radial-gradient(circle at 0% 0%, rgba(139,92,246,0.12) 0%, transparent 50%),
                  radial-gradient(circle at 100% 100%, rgba(59,130,246,0.12) 0%, transparent 50%),
                  var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .page { display: none; padding: 1.25rem; padding-bottom: 5.5rem; }
    .page.active { display: block; animation: fadeUp 0.4s ease-out; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

    /* Cards */
    .card {
      background: var(--card);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
      transition: var(--transition);
      margin-bottom: 1rem;
    }
    .card:hover { background: var(--card-hover); border-color: var(--glow); transform: translateY(-2px); }

    /* Gradient text */
    .grad { background: linear-gradient(135deg, var(--cyan), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Buttons */
    .btn-primary {
      background: linear-gradient(135deg, var(--purple), var(--blue));
      color: white; border: none; border-radius: 12px;
      padding: 0.75rem 1.25rem; font-weight: 600; font-size: 0.95rem;
      cursor: pointer; width: 100%; transition: var(--transition);
      box-shadow: 0 4px 15px rgba(139,92,246,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 6px 20px rgba(139,92,246,0.5); }
    .btn-ghost {
      background: rgba(255,255,255,0.05); border: 1px solid var(--border);
      color: var(--text); border-radius: 12px; padding: 0.6rem 1rem;
      font-weight: 500; font-size: 0.875rem; cursor: pointer; transition: var(--transition);
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }

    /* Page titles */
    .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.4rem; }
    .page-sub { font-size: 0.875rem; color: var(--muted); margin-bottom: 1.25rem; }

    /* Bot list item */
    .bot-item { display: flex; align-items: center; gap: 1rem; padding: 0.9rem; border-radius: 12px; background: rgba(255,255,255,0.03); margin-bottom: 0.75rem; }
    .bot-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
    .bot-name { font-weight: 600; font-size: 0.95rem; }
    .bot-handle { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
    .badge-active { font-size: 0.7rem; font-weight: 700; color: var(--green); background: rgba(16,185,129,0.15); padding: 3px 8px; border-radius: 20px; }
    
    /* Stats grid */
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .stat-box { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 1rem; text-align: center; }
    .stat-num { font-size: 1.6rem; font-weight: 700; }
    .stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 4px; }

    /* Template card */
    .tpl-icon { font-size: 1.8rem; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 0.75rem; flex-shrink: 0; }
    .tpl-name { font-weight: 700; font-size: 0.95rem; }
    .tpl-desc { font-size: 0.8rem; color: var(--muted); margin: 4px 0 10px; line-height: 1.4; }
    .tpl-price { font-size: 0.75rem; font-weight: 700; }
    .tpl-header { display: flex; align-items: flex-start; gap: 0.9rem; }
    .tpl-body { flex: 1; }

    /* Profile row */
    .profile-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 0.6rem; }
    .profile-label { font-size: 0.875rem; color: var(--muted); }
    .profile-val { font-weight: 600; font-size: 0.95rem; }

    /* Bottom nav */
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: rgba(15,23,42,0.85); backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-around;
      padding: 0.6rem 0 calc(0.6rem + env(safe-area-inset-bottom, 0px));
      z-index: 100;
    }
    .nav-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; color: var(--muted); font-size: 0.7rem; font-family: inherit; cursor: pointer; transition: var(--transition); padding: 6px 16px; border-radius: 12px; }
    .nav-btn svg { width: 22px; height: 22px; fill: currentColor; }
    .nav-btn.active { color: var(--cyan); }
    .nav-btn.active { background: rgba(6,182,212,0.1); }

    /* Create bot modal */
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; align-items: flex-end; }
    .modal.open { display: flex; }
    .modal-sheet { background: #1e293b; border-radius: 20px 20px 0 0; padding: 1.5rem; width: 100%; animation: slideSheet 0.3s ease-out; }
    @keyframes slideSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .modal-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; }
    .input-group { margin-bottom: 1rem; }
    .input-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 6px; display: block; }
    .input-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; color: var(--text); font-family: inherit; font-size: 0.95rem; outline: none; transition: var(--transition); }
    .input-field:focus { border-color: var(--purple); background: rgba(255,255,255,0.08); }
    .modal-close { float: right; background: none; border: none; color: var(--muted); font-size: 1.5rem; cursor: pointer; line-height: 1; }
  </style>
</head>
<body>

<!-- DASHBOARD -->
<div class="page active" id="page-dashboard">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
    <div>
      <h1 class="page-title">Asosiy panel</h1>
      <p class="page-sub" id="user-name">Xush kelibsiz!</p>
    </div>
    <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--purple));display:flex;align-items:center;justify-content:center;font-weight:700;" id="user-avatar">U</div>
  </div>

  <div class="card">
    <h3 style="font-weight:600;margin-bottom:1rem;" class="grad">Mening Botlarim</h3>
    <div class="bot-item">
      <div class="bot-avatar" style="background:linear-gradient(135deg,var(--blue),var(--purple))">M</div>
      <div style="flex:1">
        <div class="bot-name">Mening Do'konim</div>
        <div class="bot-handle">@my_shop_bot</div>
      </div>
      <span class="badge-active">● Faol</span>
    </div>
    <button class="btn-primary" onclick="openCreateModal()">+ Yangi bot yaratish</button>
  </div>

  <div class="card">
    <h3 style="font-weight:600;margin-bottom:0.9rem;" class="grad">Statistika</h3>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-num grad">124</div><div class="stat-label">Mijozlar</div></div>
      <div class="stat-box"><div class="stat-num grad">1.2k</div><div class="stat-label">Xabarlar</div></div>
      <div class="stat-box"><div class="stat-num grad">3</div><div class="stat-label">Botlar</div></div>
      <div class="stat-box"><div class="stat-num grad">98%</div><div class="stat-label">Uptime</div></div>
    </div>
  </div>
</div>

<!-- STORE -->
<div class="page" id="page-store">
  <h1 class="page-title">Shablonlar Do'koni</h1>
  <p class="page-sub">Tayyor shablondan birini tanlang va 1 daqiqada botingizni yarating.</p>

  <div class="card">
    <div class="tpl-header">
      <div class="tpl-icon">🛒</div>
      <div class="tpl-body">
        <div class="tpl-name">Internet Do'kon</div>
        <div class="tpl-desc">Sotuvlar, to'lovlar va mahsulotlar katalogi bilan to'liq do'kon boti.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tpl-price grad">Tekin</span>
          <button class="btn-ghost">O'rnatish</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="tpl-header">
      <div class="tpl-icon">✉️</div>
      <div class="tpl-body">
        <div class="tpl-name">Murojaat Bot</div>
        <div class="tpl-desc">Mijozlar murojaatlarini qabul qilish va adminga yo'naltirish.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tpl-price grad">Tekin</span>
          <button class="btn-ghost">O'rnatish</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="tpl-header">
      <div class="tpl-icon">💳</div>
      <div class="tpl-body">
        <div class="tpl-name">Avto Kassa</div>
        <div class="tpl-desc">Avtomatik to'lov qabul qilish, check yuborish va hisobot.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tpl-price grad">15,000 so'm</span>
          <button class="btn-ghost">O'rnatish</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="tpl-header">
      <div class="tpl-icon">🎬</div>
      <div class="tpl-body">
        <div class="tpl-name">Kino Bot</div>
        <div class="tpl-desc">Kino bazasi bilan izlash, saqlash va avtomatik yuborish boti.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tpl-price grad">25,000 so'm</span>
          <button class="btn-ghost">O'rnatish</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="tpl-header">
      <div class="tpl-icon">📚</div>
      <div class="tpl-body">
        <div class="tpl-name">Test va Viktorina</div>
        <div class="tpl-desc">Savol-javob, ball tizimi, reyting — o'quv markazlari uchun ideal.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="tpl-price grad">20,000 so'm</span>
          <button class="btn-ghost">O'rnatish</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PROFILE -->
<div class="page" id="page-profile">
  <h1 class="page-title">Shaxsiy Kabinet</h1>
  <p class="page-sub" style="margin-bottom:1.25rem;">Hisobingiz ma'lumotlari</p>

  <div class="card" style="margin-bottom:1rem;">
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;">
      <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--purple));display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;" id="profile-avatar">U</div>
      <div>
        <div style="font-weight:700;font-size:1.1rem;" id="profile-name">Foydalanuvchi</div>
        <div style="font-size:0.8rem;color:var(--muted);" id="profile-id">ID: —</div>
      </div>
    </div>
    <div class="profile-row"><span class="profile-label">Balans</span><span class="profile-val grad">0 so'm</span></div>
    <div class="profile-row"><span class="profile-label">Tarif</span><span class="profile-val" style="color:var(--cyan);">FREE</span></div>
    <div class="profile-row"><span class="profile-label">Botlar soni</span><span class="profile-val">1 / 3</span></div>
    <button class="btn-primary" style="margin-top:0.75rem;">💳 Hisobni to'ldirish</button>
  </div>

  <div class="card">
    <h3 style="font-weight:600;margin-bottom:0.9rem;" class="grad">Referal dasturi</h3>
    <p style="font-size:0.85rem;color:var(--muted);margin-bottom:1rem;">Har bir do'stingiz uchun <strong style="color:var(--text);">5,000 so'm</strong> bonus oling!</p>
    <button class="btn-ghost" style="width:100%;">🔗 Referal havolani nusxalash</button>
  </div>
</div>

<!-- BOTTOM NAV -->
<nav class="bottom-nav">
  <button class="nav-btn" id="nav-store" onclick="switchPage('store')">
    <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.8-2.2-5-5-5S7 3.2 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.7 0 3 1.3 3 3H9c0-1.7 1.3-3 3-3zm7 17H5V8h14v12z"/></svg>
    Do'kon
  </button>
  <button class="nav-btn active" id="nav-dashboard" onclick="switchPage('dashboard')">
    <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
    Asosiy
  </button>
  <button class="nav-btn" id="nav-profile" onclick="switchPage('profile')">
    <svg viewBox="0 0 24 24"><path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/></svg>
    Kabinet
  </button>
</nav>

<!-- CREATE BOT MODAL -->
<div class="modal" id="create-modal">
  <div class="modal-sheet">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <span class="modal-title">Yangi bot yaratish</span>
      <button class="modal-close" onclick="closeCreateModal()">×</button>
    </div>
    <div class="input-group">
      <label class="input-label">Bot nomi</label>
      <input class="input-field" type="text" placeholder="Masalan: Mening Do'konim" id="bot-name-input" />
    </div>
    <div class="input-group">
      <label class="input-label">Bot tokeni (@BotFather dan olingan)</label>
      <input class="input-field" type="text" placeholder="123456:ABC-DEF..." id="bot-token-input" />
    </div>
    <button class="btn-primary" onclick="createBot()">✅ Bot yaratish</button>
  </div>
</div>

<script>
  // Telegram Web App
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user) {
      const name = user.first_name || 'Foydalanuvchi';
      const initial = name[0].toUpperCase();
      document.getElementById('user-name').textContent = name + ' ga xush kelibsiz!';
      document.getElementById('user-avatar').textContent = initial;
      document.getElementById('profile-avatar').textContent = initial;
      document.getElementById('profile-name').textContent = name;
      document.getElementById('profile-id').textContent = 'ID: ' + user.id;
    }
  }

  function switchPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.getElementById('nav-' + name).classList.add('active');
  }

  function openCreateModal() {
    document.getElementById('create-modal').classList.add('open');
  }

  function closeCreateModal() {
    document.getElementById('create-modal').classList.remove('open');
  }

  function createBot() {
    const name = document.getElementById('bot-name-input').value;
    const token = document.getElementById('bot-token-input').value;
    if (!name || !token) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    closeCreateModal();
    alert("Bot yaratildi! Tez orada ishga tushadi.");
  }

  // Close modal on backdrop click
  document.getElementById('create-modal').addEventListener('click', function(e) {
    if (e.target === this) closeCreateModal();
  });
</script>
</body>
</html>`;
