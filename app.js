/* ─────────────────────────────────────────────
   UTILITYX — app.js
   App registry, card rendering, modal system,
   admin panel, and all tool logic
   ───────────────────────────────────────────── */

// ─────────────────────────────────────────────
// APP REGISTRY
// ─────────────────────────────────────────────
const DEFAULT_APPS = [
  {
    id: 'calc',
    icon: '🔢',
    name: 'Calculator',
    desc: 'Fast arithmetic with keyboard support and expression memory.',
    category: 'calculator',
    type: 'builtin',
    color: '#7c6af5',
    tags: ['math', 'arithmetic'],
    visible: true,
    builtinKey: 'calc'
  },
  {
    id: 'sci',
    icon: '🔬',
    name: 'Scientific Calculator',
    desc: 'Trigonometry, logarithms, factorials, and more scientific functions.',
    category: 'calculator',
    type: 'builtin',
    color: '#a06af5',
    tags: ['math', 'science', 'engineering'],
    visible: true,
    builtinKey: 'sci'
  },
  {
    id: 'unit',
    icon: '📏',
    name: 'Unit Converter',
    desc: 'Convert Length, Weight, Temp, Volume, Speed, Area & Data instantly.',
    category: 'converter',
    type: 'builtin',
    color: '#6a9ff5',
    tags: ['units', 'measurement', 'convert'],
    visible: true,
    builtinKey: 'unit'
  },
  {
    id: 'pass',
    icon: '🔐',
    name: 'Password Generator',
    desc: 'Generate secure passwords with strength meter and custom options.',
    category: 'generator',
    type: 'builtin',
    color: '#f5a06a',
    tags: ['security', 'password'],
    visible: true,
    builtinKey: 'pass'
  },
  {
    id: 'base',
    icon: '💻',
    name: 'Base Converter',
    desc: 'Convert between Binary, Octal, Decimal and Hexadecimal.',
    category: 'converter',
    type: 'builtin',
    color: '#6af5c0',
    tags: ['binary', 'hex', 'programming'],
    visible: true,
    builtinKey: 'base'
  },
  {
    id: 'color',
    icon: '🎨',
    name: 'Color Converter',
    desc: 'Convert between HEX, RGB, and HSL color formats with live preview.',
    category: 'utility',
    type: 'builtin',
    color: '#f56a9a',
    tags: ['design', 'css', 'color'],
    visible: true,
    builtinKey: 'color'
  },
  {
    id: 'bmi',
    icon: '⚖️',
    name: 'BMI Calculator',
    desc: 'Body Mass Index calculator with health classification and visual meter.',
    category: 'calculator',
    type: 'builtin',
    color: '#5bc8f5',
    tags: ['health', 'fitness', 'body'],
    visible: true,
    builtinKey: 'bmi'
  },
  {
    id: 'sw',
    icon: '⏱',
    name: 'Stopwatch',
    desc: 'Precision timer with lap tracking and pause/resume support.',
    category: 'utility',
    type: 'builtin',
    color: '#f5e26a',
    tags: ['time', 'timer', 'sports'],
    visible: true,
    builtinKey: 'sw'
  },
  {
    id: 'text',
    icon: '📝',
    name: 'Text Tools',
    desc: '9 text transforms: uppercase, camelCase, snake_case + word/char stats.',
    category: 'utility',
    type: 'builtin',
    color: '#9af56a',
    tags: ['text', 'string', 'writing'],
    visible: true,
    builtinKey: 'text'
  },
  {
    id: 'age',
    icon: '🎂',
    name: 'Age Calculator',
    desc: 'Calculate exact age in years, months, days plus next birthday countdown.',
    category: 'calculator',
    type: 'builtin',
    color: '#f56a6a',
    tags: ['age', 'birthday', 'date'],
    visible: true,
    builtinKey: 'age'
  },
  {
    id: 'qr',
    icon: '📱',
    name: 'QR Generator',
    desc: 'Generate downloadable QR codes from links, text, or Wi-Fi strings instantly.',
    category: 'generator',
    type: 'builtin',
    color: '#6aa3f5',
    tags: ['qr', 'code', 'link'],
    visible: true,
    builtinKey: 'qr'
  },
  {
    id: 'pomo',
    icon: '🍅',
    name: 'Pomodoro Timer',
    desc: 'Boost productivity with a clean 25-minute work and 5-minute break timer.',
    category: 'utility',
    type: 'builtin',
    color: '#f56a6a',
    tags: ['time', 'focus', 'productivity'],
    visible: true,
    builtinKey: 'pomo'
  },
  {
    id: 'json',
    icon: '{ }',
    name: 'JSON Formatter',
    desc: 'Instantly beautify, format, and validate raw JSON data strings.',
    category: 'utility',
    type: 'builtin',
    color: '#f5b56a',
    tags: ['json', 'code', 'format'],
    visible: true,
    builtinKey: 'json'
  },
  {
    id: 'dev',
    icon: '👨‍💻',
    name: 'About Developer',
    desc: 'Creator profile, background details, and links to connect.',
    category: 'project',
    type: 'builtin',
    color: '#7c6af5',
    tags: ['profile', 'about', 'credits'],
    visible: true,
    builtinKey: 'dev'
  }
];

// Load state from localStorage or use defaults
let appRegistry = loadRegistry();

function loadRegistry() {
  let reg = JSON.parse(JSON.stringify(DEFAULT_APPS));
  try {
    const saved = localStorage.getItem('ux_registry');
    if (saved) {
      let savedParsed = JSON.parse(saved);
      DEFAULT_APPS.forEach(da => {
        if (!savedParsed.find(s => s.id === da.id)) {
          savedParsed.push(da);
        }
      });
      reg = savedParsed;
    }
  } catch(e) {}
  return reg;
}

function saveRegistry() {
  try { localStorage.setItem('ux_registry', JSON.stringify(appRegistry)); } catch(e) {}
}

// ─────────────────────────────────────────────
// USER PINS
// ─────────────────────────────────────────────
function getUserPins() {
  try {
    return JSON.parse(localStorage.getItem('ux_user_pinned')) || [];
  } catch(e) { return []; }
}
function saveUserPins(pins) {
  try { localStorage.setItem('ux_user_pinned', JSON.stringify(pins)); } catch(e) {}
}
function toggleUserPin(id, event) {
  if (event) event.stopPropagation();
  let pins = getUserPins();
  if (pins.includes(id)) {
    pins = pins.filter(p => p !== id);
  } else {
    if (pins.length >= 3) {
      showToast('Maximum 3 apps can be pinned!');
      return;
    }
    pins.push(id);
  }
  saveUserPins(pins);
  renderApps();
}

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
let isDark = localStorage.getItem('ux_theme') !== 'light';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('themeLabel').textContent = isDark ? 'Light' : 'Dark';
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('ux_theme', isDark ? 'dark' : 'light');
  applyTheme();
}

// ─────────────────────────────────────────────
// CARD RENDERING
// ─────────────────────────────────────────────
let activeFilter = 'all';

function getCategoryLabel(cat) {
  const map = { calculator:'Calculator', converter:'Converter', generator:'Generator', utility:'Utility', project:'Project' };
  return map[cat] || cat;
}

function getBadgeClass(app) {
  if (app.type === 'website') return 'external';
  if (app.category === 'project') return 'project';
  return '';
}

function renderApps() {
  const grid = document.getElementById('appsGrid');
  const empty = document.getElementById('emptyState');
  const filtered = appRegistry.filter(a =>
    (activeFilter === 'all' || a.category === activeFilter)
  );

  const visible = filtered.filter(a => a.visible !== false);
  const userPins = getUserPins();

  visible.sort((a, b) => {
    const aUserPin = userPins.includes(a.id);
    const bUserPin = userPins.includes(b.id);
    const aAdminPin = !!a.adminPinned;
    const bAdminPin = !!b.adminPinned;

    if (aUserPin && !bUserPin) return -1;
    if (!aUserPin && bUserPin) return 1;
    if (aAdminPin && !bAdminPin) return -1;
    if (!aAdminPin && bAdminPin) return 1;
    return 0;
  });

  document.getElementById('appCount').textContent = appRegistry.filter(a => a.visible !== false).length;

  if (visible.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = visible.map((app, i) => {
    const isUserPinned = userPins.includes(app.id);
    const badgeClass = getBadgeClass(app);
    const badgeLabel = app.type === 'website' ? '🔗 Website' : getCategoryLabel(app.category);
    const typeIcon = app.type === 'website' ? '↗' : '▶';
    const tags = (app.tags || []).slice(0, 3).map(t => `<span class="card-tag">${t}</span>`).join('');
    
    const promotedBadge = app.adminPinned ? `<span class="admin-promoted-badge">🌟 Promoted</span>` : '';

    return `
      <div class="app-card" onclick="openApp('${app.id}')" style="--card-accent:${app.color};animation-delay:${i*0.04}s">
        <button class="card-pin-btn ${isUserPinned ? 'pinned' : ''}" onclick="toggleUserPin('${app.id}', event)" title="${isUserPinned ? 'Unpin' : 'Pin app (max 3)'}">📌</button>
        <div class="card-top">
          <div class="card-icon-wrap" style="background:${app.color}18;border-color:${app.color}33">${app.icon}</div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; position:relative; z-index:2;">
            ${promotedBadge}
            <span class="card-badge ${badgeClass}">${badgeLabel}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-name">${app.name}</div>
          <div class="card-desc">${app.desc}</div>
        </div>
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
        <div class="card-footer">
          <span class="card-open-btn">Open app →</span>
          <span class="card-type-icon">${typeIcon}</span>
        </div>
      </div>`;
  }).join('');
}

function filterApps(category) {
  activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-filter="${category}"]`).classList.add('active');
  renderApps();
}

// ─────────────────────────────────────────────
// MODAL SYSTEM
// ─────────────────────────────────────────────
let currentOpenAppId = null;

function openApp(id) {
  const app = appRegistry.find(a => a.id === id);
  if (!app) return;
  currentOpenAppId = id;

  document.getElementById('modalIcon').textContent = app.icon;
  document.getElementById('modalTitle').textContent = app.name;
  document.getElementById('modalDesc').textContent = app.desc;

  const body = document.getElementById('modalBody');

  if (app.type === 'website' && app.url) {
    body.innerHTML = `
      <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <span style="font-size:0.75rem;color:var(--text3)">Loading: <a href="${app.url}" target="_blank" style="color:var(--accent)">${app.url}</a></span>
        <a href="${app.url}" target="_blank" class="btn btn-primary btn-sm">Open in new tab ↗</a>
      </div>
      <iframe src="${app.url}" class="app-iframe" title="${app.name}" loading="lazy"></iframe>
    `;
  } else if (app.type === 'builtin' && app.builtinKey) {
    const store = document.getElementById('store-' + app.builtinKey);
    if (store) {
      body.innerHTML = '';
      const clone = store.cloneNode(true);
      clone.removeAttribute('id');
      body.appendChild(clone);
      // Re-init if needed
      if (app.builtinKey === 'unit') updateUnitOptions();
      if (app.builtinKey === 'age') {
        const _t = new Date();
        const asofEl = body.querySelector('#asofInput');
        if (asofEl) asofEl.value = pad(_t.getDate()) + '/' + pad(_t.getMonth()+1) + '/' + _t.getFullYear();
      }
    }
  } else {
    body.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text3)">App content not found.</div>`;
  }

  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay') && e.type !== 'click') return;
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  _closeModal();
}

function _closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentOpenAppId = null;
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) _closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    _closeModal();
    closeAdmin();
  }
});

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
const ADMIN_PASS = '2511219';
let adminUnlocked = false;

function openAdmin() {
  document.getElementById('adminOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (adminUnlocked) {
    showAdminDashboard();
  } else {
    document.getElementById('adminLoginScreen').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    setTimeout(() => document.getElementById('adminPassInput').focus(), 100);
  }
}

function closeAdmin() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeAdminOverlay(e) {
  if (e.target === document.getElementById('adminOverlay')) closeAdmin();
}

function checkAdminPass() {
  const val = document.getElementById('adminPassInput').value;
  if (val === ADMIN_PASS) {
    adminUnlocked = true;
    document.getElementById('adminError').style.display = 'none';
    document.getElementById('adminPassInput').value = '';
    showAdminDashboard();
  } else {
    document.getElementById('adminError').style.display = 'block';
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassInput').focus();
  }
}

function showAdminDashboard() {
  document.getElementById('adminLoginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
  switchAdminTab('apps');
  renderAdminAppsList();
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('atab-' + tab).classList.add('active');
  document.getElementById('atcontent-' + tab).classList.add('active');
}

function renderAdminAppsList() {
  const list = document.getElementById('adminAppsList');
  list.innerHTML = appRegistry.map((app, i) => {
    const isVisible = app.visible !== false;
    const isCustom = !DEFAULT_APPS.find(d => d.id === app.id);
    const isPinned = !!app.adminPinned;
    return `
      <div class="admin-app-item">
        <div class="admin-app-icon">${app.icon}</div>
        <div class="admin-app-info">
          <div class="admin-app-name">${app.name}</div>
          <div class="admin-app-cat">${getCategoryLabel(app.category)} · ${app.type === 'website' ? '🔗 Website' : '⚙️ Built-in'}</div>
        </div>
        <div class="admin-app-actions">
          <button class="toggle-btn ${isPinned ? 'visible' : ''}" onclick="toggleAppAdminPin('${app.id}')">
            ${isPinned ? '🌟 Unpin' : '📌 Pin'}
          </button>
          <button class="toggle-btn ${isVisible ? 'visible' : 'hidden'}" onclick="toggleAppVisibility('${app.id}')">
            ${isVisible ? '👁 Visible' : '🚫 Hidden'}
          </button>
          ${isCustom ? `<button class="delete-btn" onclick="deleteApp('${app.id}')">🗑</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function toggleAppVisibility(id) {
  const app = appRegistry.find(a => a.id === id);
  if (!app) return;
  app.visible = app.visible === false ? true : false;
  saveRegistry();
  renderAdminAppsList();
  renderApps();
}

function toggleAppAdminPin(id) {
  const app = appRegistry.find(a => a.id === id);
  if (!app) return;
  app.adminPinned = !app.adminPinned;
  saveRegistry();
  renderAdminAppsList();
  renderApps();
}

function deleteApp(id) {
  if (!confirm('Delete this app permanently?')) return;
  appRegistry = appRegistry.filter(a => a.id !== id);
  saveRegistry();
  renderAdminAppsList();
  renderApps();
}

function toggleAppTypeFields() {
  const type = document.getElementById('newAppType').value;
  document.getElementById('websiteFields').style.display = type === 'website' ? 'block' : 'none';
}

function syncColorHex() {
  const val = document.getElementById('newAppColorHex').value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    document.getElementById('newAppColor').value = val;
  }
}
document.getElementById('newAppColor').addEventListener('input', function() {
  document.getElementById('newAppColorHex').value = this.value;
});

function addNewApp() {
  const errEl = document.getElementById('addAppError');
  const okEl  = document.getElementById('addAppSuccess');
  errEl.style.display = 'none';
  okEl.style.display = 'none';

  const icon  = document.getElementById('newAppIcon').value.trim() || '📦';
  const name  = document.getElementById('newAppName').value.trim();
  const desc  = document.getElementById('newAppDesc').value.trim();
  const cat   = document.getElementById('newAppCategory').value;
  const type  = document.getElementById('newAppType').value;
  const url   = document.getElementById('newAppUrl').value.trim();
  const color = document.getElementById('newAppColorHex').value.trim() || '#7c6af5';
  const tagsRaw = document.getElementById('newAppTags').value.trim();
  const tags  = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!name) { errEl.textContent = '❌ App name is required.'; errEl.style.display = 'block'; return; }
  if (!desc) { errEl.textContent = '❌ Description is required.'; errEl.style.display = 'block'; return; }
  if (type === 'website' && !url) { errEl.textContent = '❌ URL is required for website apps.'; errEl.style.display = 'block'; return; }

  const id = 'custom_' + Date.now();
  const newApp = { id, icon, name, desc, category: cat, type, color, tags, visible: true };
  if (type === 'website') newApp.url = url;

  appRegistry.push(newApp);
  saveRegistry();
  renderApps();
  renderAdminAppsList();

  // Clear form
  ['newAppIcon','newAppName','newAppDesc','newAppUrl','newAppTags'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  document.getElementById('newAppColorHex').value = '#7c6af5';
  document.getElementById('newAppColor').value = '#7c6af5';

  okEl.textContent = `✅ "${name}" added successfully!`;
  okEl.style.display = 'block';
  setTimeout(() => okEl.style.display = 'none', 3000);

  switchAdminTab('apps');
}

// ─────────────────────────────────────────────
// COPY & TOAST
// ─────────────────────────────────────────────
function copyResult(id) {
  const modal = document.getElementById('modalBody');
  const el = modal.querySelector('#' + id) || document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent || el.value || '').catch(()=>{});
  showToast('Copied!');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

// ─────────────────────────────────────────────
// MINI CALCULATOR
// ─────────────────────────────────────────────
let calcExpr = '';
function getCalcEls() {
  const modal = document.getElementById('modalBody');
  return {
    expr: modal.querySelector('#calcExpr'),
    val:  modal.querySelector('#calcVal')
  };
}
function calcInput(v) {
  calcExpr += v;
  const { expr, val } = getCalcEls();
  if (expr) expr.textContent = calcExpr.replace(/\*/g,'×').replace(/\//g,'÷');
  if (val) val.textContent = calcExpr || '0';
}
function calcClear() {
  calcExpr = '';
  const { expr, val } = getCalcEls();
  if (expr) expr.textContent = '';
  if (val) val.textContent = '0';
}
function calcBackspace() {
  calcExpr = calcExpr.slice(0,-1);
  const { expr } = getCalcEls();
  if (expr) expr.textContent = calcExpr.replace(/\*/g,'×').replace(/\//g,'÷');
}
function calcEquals() {
  try {
    const res = Function('"use strict";return (' + calcExpr + ')')();
    const rounded = +parseFloat(res).toPrecision(12);
    const { expr, val } = getCalcEls();
    if (val) val.textContent = rounded;
    if (expr) expr.textContent = calcExpr.replace(/\*/g,'×').replace(/\//g,'÷') + ' =';
    calcExpr = String(rounded);
  } catch(e) {
    const { val } = getCalcEls();
    if (val) val.textContent = 'Error';
  }
}

// ─────────────────────────────────────────────
// SCIENTIFIC CALCULATOR
// ─────────────────────────────────────────────
let sciExpr = '';
function getSciEls() {
  const modal = document.getElementById('modalBody');
  return { expr: modal.querySelector('#sciExpr'), val: modal.querySelector('#sciVal') };
}
function sciInput(v) {
  sciExpr += v;
  const { expr, val } = getSciEls();
  if (expr) expr.textContent = sciExpr;
  if (val) val.textContent = sciExpr || '0';
}
function sciFunc(fn) {
  const funcs = { sin:'Math.sin', cos:'Math.cos', tan:'Math.tan', log:'Math.log10', ln:'Math.log', sqrt:'Math.sqrt', abs:'Math.abs' };
  sciExpr += funcs[fn] + '(';
  const { expr } = getSciEls();
  if (expr) expr.textContent = sciExpr;
}
function sciClear() {
  sciExpr = '';
  const { expr, val } = getSciEls();
  if (expr) expr.textContent = '';
  if (val) val.textContent = '0';
}
function sciBackspace() {
  sciExpr = sciExpr.slice(0,-1);
  const { expr } = getSciEls();
  if (expr) expr.textContent = sciExpr;
}
function factorial(n) { if(n<=1) return 1; return n * factorial(n-1); }
function sciEquals() {
  try {
    let expr = sciExpr;
    const modal = document.getElementById('modalBody');
    const degEl = modal.querySelector('#degMode');
    const deg = degEl ? degEl.checked : true;
    if (deg) {
      expr = expr.replace(/Math\.sin\(/g,'Math.sin(Math.PI/180*')
                 .replace(/Math\.cos\(/g,'Math.cos(Math.PI/180*')
                 .replace(/Math\.tan\(/g,'Math.tan(Math.PI/180*');
    }
    expr = expr.replace(/(\d+)!/g, (m,n) => factorial(parseInt(n)));
    const res = Function('"use strict";return (' + expr + ')')();
    const rounded = +parseFloat(res).toPrecision(10);
    const { expr: exprEl, val } = getSciEls();
    if (val) val.textContent = rounded;
    if (exprEl) exprEl.textContent = sciExpr + ' =';
    sciExpr = String(rounded);
  } catch(e) {
    const { val } = getSciEls();
    if (val) val.textContent = 'Error';
  }
}

// ─────────────────────────────────────────────
// UNIT CONVERTER
// ─────────────────────────────────────────────
const unitData = {
  length: { units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch'], toBase: [1,1000,0.01,0.001,1609.34,0.9144,0.3048,0.0254] },
  weight: { units: ['Kilogram','Gram','Milligram','Pound','Ounce','Ton'], toBase: [1,0.001,0.000001,0.453592,0.0283495,1000] },
  volume: { units: ['Liter','Milliliter','Gallon (US)','Quart','Pint','Cup','Fluid Oz'], toBase: [1,0.001,3.78541,0.946353,0.473176,0.236588,0.0295735] },
  speed:  { units: ['m/s','km/h','mph','knot','ft/s'], toBase: [1,0.277778,0.44704,0.514444,0.3048] },
  area:   { units: ['m²','km²','cm²','hectare','acre','ft²','in²'], toBase: [1,1e6,0.0001,10000,4046.86,0.092903,0.00064516] },
  data:   { units: ['Byte','Kilobyte','Megabyte','Gigabyte','Terabyte','Bit'], toBase: [1,1024,1048576,1073741824,1099511627776,0.125] }
};
function getModalEl(sel) {
  return document.getElementById('modalBody').querySelector(sel) || document.querySelector(sel);
}
function updateUnitOptions() {
  const cat = getModalEl('#unitCategory');
  if (!cat) return;
  const from = getModalEl('#fromUnit');
  const to = getModalEl('#toUnit');
  if (!from || !to) return;
  if (cat.value === 'temp') {
    const opts = ['Celsius','Fahrenheit','Kelvin'];
    from.innerHTML = opts.map(o=>`<option>${o}</option>`).join('');
    to.innerHTML = opts.map(o=>`<option>${o}</option>`).join('');
    to.value = 'Fahrenheit';
  } else {
    const units = unitData[cat.value].units;
    from.innerHTML = units.map(u=>`<option>${u}</option>`).join('');
    to.innerHTML = units.map(u=>`<option>${u}</option>`).join('');
    to.selectedIndex = 1;
  }
}
function swapUnits() {
  const f = getModalEl('#fromUnit'), t = getModalEl('#toUnit');
  if (!f||!t) return;
  [f.value, t.value] = [t.value, f.value];
}
function convertUnit() {
  const cat = getModalEl('#unitCategory').value;
  const val = parseFloat(getModalEl('#unitInput').value);
  const from = getModalEl('#fromUnit').value;
  const to = getModalEl('#toUnit').value;
  if (isNaN(val)) return;
  let result;
  if (cat === 'temp') {
    let celsius;
    if (from==='Celsius') celsius=val;
    else if (from==='Fahrenheit') celsius=(val-32)*5/9;
    else celsius=val-273.15;
    if (to==='Celsius') result=celsius;
    else if (to==='Fahrenheit') result=celsius*9/5+32;
    else result=celsius+273.15;
  } else {
    const d = unitData[cat];
    const fi=d.units.indexOf(from), ti=d.units.indexOf(to);
    result = val * d.toBase[fi] / d.toBase[ti];
  }
  const rounded = +parseFloat(result).toPrecision(8);
  const resBox = getModalEl('#unitResult');
  const resVal = getModalEl('#unitResultVal');
  if (resBox) resBox.style.display = 'block';
  if (resVal) resVal.textContent = `${rounded} ${to}`;
}

// ─────────────────────────────────────────────
// PASSWORD GENERATOR
// ─────────────────────────────────────────────
function generatePass() {
  const len = parseInt(getModalEl('#passLen').value);
  const count = parseInt(getModalEl('#passCount').value) || 1;
  const upper = getModalEl('#passUpper').checked;
  const lower = getModalEl('#passLower').checked;
  const num   = getModalEl('#passNum').checked;
  const sym   = getModalEl('#passSym').checked;
  let chars = '';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (num)   chars += '0123456789';
  if (sym)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) { getModalEl('#passOutput').textContent = 'Select at least one option!'; return; }
  const passes = [];
  for (let c=0; c<Math.min(count,10); c++) {
    let pass = '';
    for (let i=0; i<len; i++) pass += chars[Math.floor(Math.random()*chars.length)];
    passes.push(pass);
  }
  getModalEl('#passOutput').textContent = passes.join('\n');
  let strength = 0;
  if (len>=12) strength++; if (len>=20) strength++;
  if (upper&&lower) strength++; if (num) strength++; if (sym) strength++;
  const colors = ['#f56a6a','#f5a06a','#f5e26a','#6af5c0','#6af5c0'];
  const labels = ['Very Weak','Weak','Fair','Strong','Very Strong'];
  const bar = getModalEl('#strengthBar');
  const lbl = getModalEl('#strengthLabel');
  if (bar) { bar.style.background = colors[Math.min(strength,4)]; bar.style.width = ((strength+1)/5*100)+'%'; }
  if (lbl) lbl.textContent = labels[Math.min(strength,4)];
}

// ─────────────────────────────────────────────
// BASE CONVERTER
// ─────────────────────────────────────────────
let fromBase = 2;
function setBaseFrom(b) {
  fromBase = b;
  document.querySelectorAll('[id^="base-chip-"]').forEach(el => el.classList.remove('active'));
  const chip = getModalEl('#base-chip-'+b);
  if (chip) chip.classList.add('active');
  convertBase();
}
function convertBase() {
  const input = getModalEl('#baseInput');
  if (!input) return;
  const val = input.value.trim();
  const ids = ['baseBin','baseOct','baseDec','baseHex'];
  if (!val) { ids.forEach(id => { const el = getModalEl('#'+id); if(el) el.textContent='—'; }); return; }
  try {
    const dec = parseInt(val, fromBase);
    if (isNaN(dec)) throw new Error();
    const vals = [dec.toString(2), dec.toString(8), dec.toString(10), dec.toString(16).toUpperCase()];
    ids.forEach((id,i) => { const el = getModalEl('#'+id); if(el) el.textContent = vals[i]; });
  } catch(e) {
    ids.forEach(id => { const el = getModalEl('#'+id); if(el) el.textContent='Invalid'; });
  }
}

// ─────────────────────────────────────────────
// COLOR CONVERTER
// ─────────────────────────────────────────────
function fromHex() {
  let hex = getModalEl('#hexInput').value;
  if (!hex.startsWith('#')) hex = '#'+hex;
  if (hex.length === 7) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    setRGB(r,g,b);
  }
}
function fromPicker() {
  const hex = getModalEl('#colorPicker').value;
  getModalEl('#hexInput').value = hex;
  fromHex();
}
function fromRGB() {
  const r=parseInt(getModalEl('#rVal').value)||0;
  const g=parseInt(getModalEl('#gVal').value)||0;
  const b=parseInt(getModalEl('#bVal').value)||0;
  const hex='#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  getModalEl('#hexInput').value = hex;
  getModalEl('#colorPicker').value = hex;
  getModalEl('#colorPreview').style.background = hex;
  const hsl = rgbToHsl(r,g,b);
  getModalEl('#hVal').value = Math.round(hsl[0]);
  getModalEl('#sVal').value = Math.round(hsl[1]);
  getModalEl('#lVal').value = Math.round(hsl[2]);
  getModalEl('#cssOutput').textContent = `rgb(${r}, ${g}, ${b})`;
}
function fromHSL() {
  const h=parseInt(getModalEl('#hVal').value)||0;
  const s=parseInt(getModalEl('#sVal').value)||0;
  const l=parseInt(getModalEl('#lVal').value)||0;
  const rgb = hslToRgb(h,s,l);
  getModalEl('#rVal').value=rgb[0]; getModalEl('#gVal').value=rgb[1]; getModalEl('#bVal').value=rgb[2];
  fromRGB();
}
function setRGB(r,g,b) {
  getModalEl('#rVal').value=r; getModalEl('#gVal').value=g; getModalEl('#bVal').value=b;
  fromRGB();
}
function rgbToHsl(r,g,b) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}
  else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}h/=6;}
  return [h*360,s*100,l*100];
}
function hslToRgb(h,s,l) {
  s/=100;l/=100;
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}
  else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}
  return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
}

// ─────────────────────────────────────────────
// BMI CALCULATOR
// ─────────────────────────────────────────────
function updateBMILabels() {
  const imp = getModalEl('#bmiUnit').value === 'imperial';
  const wl = getModalEl('#weightLabel'); if(wl) wl.textContent = imp?'Weight (lbs)':'Weight (kg)';
  const hl = getModalEl('#heightLabel'); if(hl) hl.textContent = imp?'Height (inches)':'Height (cm)';
}
function calcBMI() {
  const unit = getModalEl('#bmiUnit').value;
  let w = parseFloat(getModalEl('#bmiWeight').value);
  let h = parseFloat(getModalEl('#bmiHeight').value);
  if (isNaN(w)||isNaN(h)) return;
  let bmi;
  if (unit==='metric') bmi=w/((h/100)**2);
  else bmi=(w/(h**2))*703;
  bmi=+bmi.toFixed(1);
  let cat,color;
  if(bmi<18.5){cat='Underweight';color='#5bc8f5';}
  else if(bmi<25){cat='Normal weight ✓';color='#6af5c0';}
  else if(bmi<30){cat='Overweight';color='#f5e26a';}
  else{cat='Obese';color='#f56a6a';}
  const pct = Math.min(Math.max((bmi-10)/35,0),1)*100;
  const res = getModalEl('#bmiResult'); if(res) res.style.display='block';
  const ptr = getModalEl('#bmiPointer'); if(ptr) ptr.style.left=pct+'%';
  const val = getModalEl('#bmiValue'); if(val){val.textContent=bmi;val.style.color=color;}
  const catEl = getModalEl('#bmiCategory'); if(catEl) catEl.textContent=cat;
}

// ─────────────────────────────────────────────
// STOPWATCH
// ─────────────────────────────────────────────
let swInterval, swStartTime, swElapsed=0, swRunning=false, laps=[];
function swStart() {
  const btn = getModalEl('#swStartBtn');
  const lapBtn = getModalEl('#swLapBtn');
  if (!swRunning) {
    swStartTime = Date.now() - swElapsed;
    swInterval = setInterval(swTick, 10);
    swRunning = true;
    if (btn) btn.textContent = '⏸ Pause';
    if (lapBtn) lapBtn.disabled = false;
  } else {
    clearInterval(swInterval);
    swElapsed = Date.now() - swStartTime;
    swRunning = false;
    if (btn) btn.textContent = '▶ Resume';
  }
}
function swTick() {
  const t = Date.now() - swStartTime;
  const ms = Math.floor((t%1000)/10).toString().padStart(2,'0');
  const s = Math.floor(t/1000%60).toString().padStart(2,'0');
  const m = Math.floor(t/60000%60).toString().padStart(2,'0');
  const h = Math.floor(t/3600000).toString().padStart(2,'0');
  const setEl = (id,v) => { const el=getModalEl('#'+id); if(el) el.textContent=v; };
  setEl('swH',h); setEl('swM',m); setEl('swS',s); setEl('swMs',ms);
}
function swLap() {
  const t = Date.now() - swStartTime;
  const s=Math.floor(t/1000%60).toString().padStart(2,'0');
  const m=Math.floor(t/60000%60).toString().padStart(2,'0');
  const h=Math.floor(t/3600000).toString().padStart(2,'0');
  laps.push(`${h}:${m}:${s}`);
  const list = getModalEl('#lapsList');
  if (list) list.innerHTML = laps.map((l,i)=>`<div class="lap-item"><span>Lap ${i+1}</span><span>${l}</span></div>`).reverse().join('');
}
function swReset() {
  clearInterval(swInterval);
  swRunning=false; swElapsed=0; laps=[];
  ['swH','swM','swS','swMs'].forEach(id => { const el=getModalEl('#'+id); if(el) el.textContent='00'; });
  const btn=getModalEl('#swStartBtn'); if(btn) btn.textContent='▶ Start';
  const lapBtn=getModalEl('#swLapBtn'); if(lapBtn) lapBtn.disabled=true;
  const list=getModalEl('#lapsList'); if(list) list.innerHTML='';
}

// ─────────────────────────────────────────────
// TEXT TOOLS
// ─────────────────────────────────────────────
function analyzeText() {
  const el = getModalEl('#textInput');
  if (!el) return;
  const t = el.value;
  const setEl = (id,v) => { const e=getModalEl('#'+id); if(e) e.textContent=v; };
  setEl('statChars', t.length);
  setEl('statWords', t.trim() ? t.trim().split(/\s+/).length : 0);
  setEl('statLines', t ? t.split('\n').length : 0);
  setEl('statSentences', (t.match(/[.!?]+/g)||[]).length);
  setEl('statRead', Math.ceil((t.trim().split(/\s+/).filter(Boolean).length)/200));
}
function textTransform(type) {
  const el = getModalEl('#textInput');
  if (!el) return;
  const t = el.value;
  let result;
  switch(type) {
    case 'upper': result=t.toUpperCase(); break;
    case 'lower': result=t.toLowerCase(); break;
    case 'title': result=t.replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase()); break;
    case 'camel': result=t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(m,c)=>c.toUpperCase()); break;
    case 'snake': result=t.toLowerCase().replace(/\s+/g,'_'); break;
    case 'kebab': result=t.toLowerCase().replace(/\s+/g,'-'); break;
    case 'reverse': result=t.split('').reverse().join(''); break;
    case 'trim': result=t.replace(/\s+/g,' ').trim(); break;
    default: result=t;
  }
  el.value = result;
  analyzeText();
}

// ─────────────────────────────────────────────
// AGE CALCULATOR
// ─────────────────────────────────────────────
function pad(n) { return String(n).padStart(2,'0'); }

function formatDateInput(el) {
  let v = el.value.replace(/\D/g,'');
  if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
  if (v.length > 5) v = v.slice(0,5) + '/' + v.slice(5,9);
  el.value = v;
}
function parseDMY(s) {
  const p = s.split('/');
  if (p.length!==3||p[2].length!==4) return null;
  const d = new Date(+p[2], +p[1]-1, +p[0]);
  return isNaN(d) ? null : d;
}
function calcAge() {
  const dobEl = getModalEl('#dobInput');
  const asofEl = getModalEl('#asofInput');
  if (!dobEl||!asofEl) return;
  const dob  = parseDMY(dobEl.value);
  const asof = parseDMY(asofEl.value);
  if (!dob||!asof) return;
  let years=asof.getFullYear()-dob.getFullYear();
  let months=asof.getMonth()-dob.getMonth();
  let days=asof.getDate()-dob.getDate();
  if (days<0){months--;days+=new Date(asof.getFullYear(),asof.getMonth(),0).getDate();}
  if (months<0){years--;months+=12;}
  const totalDays=Math.floor((asof-dob)/86400000);
  const nextBday=new Date(asof.getFullYear(),dob.getMonth(),dob.getDate());
  if(nextBday<asof)nextBday.setFullYear(asof.getFullYear()+1);
  const daysUntilBday=Math.ceil((nextBday-asof)/86400000);
  const res=getModalEl('#ageResult'); if(res) res.style.display='block';
  const setEl=(id,v)=>{const e=getModalEl('#'+id);if(e)e.textContent=v;};
  setEl('ageYears',years); setEl('ageMonths',months); setEl('ageDays',days);
  const extra=getModalEl('#ageExtra');
  if(extra) extra.innerHTML=`Total days lived: <strong>${totalDays.toLocaleString()}</strong><br>Total weeks: <strong>${Math.floor(totalDays/7).toLocaleString()}</strong><br>Next birthday in: <strong>${daysUntilBday} days</strong>`;
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
applyTheme();
renderApps();

// Default admin fields
document.getElementById('newAppColor').addEventListener('input', function() {
  document.getElementById('newAppColorHex').value = this.value;
});

// ─────────────────────────────────────────────
// QR GENERATOR
// ─────────────────────────────────────────────
function generateQR() {
  const input = getModalEl('#qrInput').value.trim();
  if (!input) return;
  const qrImg = getModalEl('#qrImage');
  const qrRes = getModalEl('#qrResult');
  
  // Public API for QR Code
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(input)}&margin=10`;
  qrImg.src = url;
  qrRes.style.display = 'block';
}
function downloadQR() {
  const qrImg = getModalEl('#qrImage');
  if (!qrImg || !qrImg.src) return;
  
  // Trigger download cross-origin gracefully
  fetch(qrImg.src).then(res => res.blob()).then(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'UtilityX_QRCode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).catch(e => {
    const a = document.createElement('a');
    a.href = qrImg.src;
    a.download = 'UtilityX_QRCode.png';
    a.target = '_blank';
    a.click();
  });
}

// ─────────────────────────────────────────────
// POMODORO TIMER
// ─────────────────────────────────────────────
let pomoInterval;
let pomoSeconds = 25 * 60;
let pomoRunning = false;
let pomoMode = 'work'; // 'work' or 'break'

function updatePomoDisplay() {
  const m = Math.floor(pomoSeconds / 60).toString().padStart(2, '0');
  const s = (pomoSeconds % 60).toString().padStart(2, '0');
  const timeEl = getModalEl('#pomoTime');
  if (timeEl) timeEl.textContent = `${m}:${s}`;
}
function setPomoMode(mode) {
  pomoMode = mode;
  pomoRunning = false;
  clearInterval(pomoInterval);
  const btn = getModalEl('#pomoStartBtn');
  if (btn) btn.textContent = '▶ Start';
  
  const wBtn = getModalEl('#pomoWork');
  const bBtn = getModalEl('#pomoBreak');
  
  if (mode === 'work') {
    pomoSeconds = 25 * 60;
    if (wBtn) wBtn.classList.add('active');
    if (bBtn) bBtn.classList.remove('active');
    const timeEl = getModalEl('#pomoTime');
    if (timeEl) timeEl.style.color = 'var(--accent2)';
  } else {
    pomoSeconds = 5 * 60;
    if (wBtn) wBtn.classList.remove('active');
    if (bBtn) bBtn.classList.add('active');
    const timeEl = getModalEl('#pomoTime');
    if (timeEl) timeEl.style.color = 'var(--accent3)'; 
  }
  updatePomoDisplay();
}
function pomoStart() {
  const btn = getModalEl('#pomoStartBtn');
  if (!pomoRunning) {
    if (pomoSeconds <= 0) setPomoMode(pomoMode);
    pomoRunning = true;
    if (btn) btn.textContent = '⏸ Pause';
    pomoInterval = setInterval(() => {
      pomoSeconds--;
      updatePomoDisplay();
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoRunning = false;
        if (btn) btn.textContent = '▶ Restart';
        showToast(pomoMode === 'work' ? 'Time for a break!' : 'Back to work!');
      }
    }, 1000);
  } else {
    pomoRunning = false;
    clearInterval(pomoInterval);
    if (btn) btn.textContent = '▶ Resume';
  }
}
function pomoReset() {
  setPomoMode(pomoMode);
}

// ─────────────────────────────────────────────
// JSON FORMATTER
// ─────────────────────────────────────────────
function formatJSON() {
  const input = getModalEl('#jsonInput').value;
  const err = getModalEl('#jsonError');
  const res = getModalEl('#jsonResultBox');
  const out = getModalEl('#jsonOutput');
  if (!input.trim()) return;
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    if (out) out.textContent = formatted;
    if (err) err.style.display = 'none';
    if (res) res.style.display = 'block';
  } catch(e) {
    if (err) err.style.display = 'block';
    if (res) res.style.display = 'none';
  }
}
function minifyJSON() {
  const input = getModalEl('#jsonInput').value;
  const err = getModalEl('#jsonError');
  const res = getModalEl('#jsonResultBox');
  const out = getModalEl('#jsonOutput');
  if (!input.trim()) return;
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    if (out) out.textContent = minified;
    if (err) err.style.display = 'none';
    if (res) res.style.display = 'block';
  } catch(e) {
    if (err) err.style.display = 'block';
    if (res) res.style.display = 'none';
  }
}
