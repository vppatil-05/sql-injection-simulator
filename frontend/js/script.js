const API = '';

// --- Utilities ---
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function show(el, html) { if (el) { el.innerHTML = html; el.classList.add('fade-in'); } }

// --- Mode Toggle ---
let currentMode = 'vulnerable';
function initModeToggle() {
  $$('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      $$('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// --- LOGIN ---
function initLogin() {
  const form = $('#login-form');
  if (!form) return;
  initModeToggle();

  // Example injections
  $$('.example-item').forEach(item => {
    item.addEventListener('click', () => {
      const u = item.dataset.user;
      const p = item.dataset.pass;
      if (u) $('#username').value = u;
      if (p) $('#password').value = p;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = $('#username').value;
    const password = $('#password').value;

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, mode: currentMode })
      });
      const data = await res.json();
      renderLoginResult(data, username, password);
    } catch (err) {
      show($('#result'), `<div class="result-box fail"><div class="result-title">❌ Error</div>${err.message}</div>`);
    }
  });
}

function renderLoginResult(data, username, password) {
  // Query viewer
  show($('#query-display'), `<code>${escHtml(data.query)}</code>`);

  // Visualizer
  let vizHtml = `
    <div class="viz-step input"><span class="viz-label">Input</span><span class="viz-value">username: ${escHtml(username)} | password: ${escHtml(password)}</span></div>
    <div class="viz-step query"><span class="viz-label">Query</span><span class="viz-value">${escHtml(data.query)}</span></div>
    <div class="viz-step ${data.injectionDetected ? 'attack' : 'result'}"><span class="viz-label">Detection</span><span class="viz-value">${data.injectionDetected ? '🚨 SQL Injection Detected!' : '✅ Clean Input'}</span></div>
    <div class="viz-step ${data.success ? 'result' : 'attack'}"><span class="viz-label">Result</span><span class="viz-value">${escHtml(data.message)}</span></div>
  `;
  show($('#visualizer'), vizHtml);

  // Result
  let cls = data.success ? 'success' : 'fail';
  if (data.injectionDetected && !data.success) cls = 'warning';
  let html = `<div class="result-box ${cls}"><div class="result-title">${data.message}</div>`;
  if (data.data && data.data.length) {
    html += '<table><tr><th>ID</th><th>Username</th><th>Role</th></tr>';
    data.data.forEach(u => { html += `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.role}</td></tr>`; });
    html += '</table>';
  }
  if (data.injectionDetected) html += `<p style="margin-top:0.5rem"><span class="badge badge-attack">⚠ INJECTION DETECTED</span></p>`;
  html += '</div>';
  show($('#result'), html);
}

// --- PRODUCTS ---
function initProducts() {
  const form = $('#search-form');
  if (!form) return;
  initModeToggle();

  $$('.example-item').forEach(item => {
    item.addEventListener('click', () => {
      $('#search-input').value = item.dataset.search || '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const search = $('#search-input').value;

    try {
      const res = await fetch(`${API}/api/products/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search, mode: currentMode })
      });
      const data = await res.json();
      renderProductResult(data, search);
    } catch (err) {
      show($('#result'), `<div class="result-box fail"><div class="result-title">❌ Error</div>${err.message}</div>`);
    }
  });
}

function renderProductResult(data, search) {
  show($('#query-display'), `<code>${escHtml(data.query)}</code>`);

  let vizHtml = `
    <div class="viz-step input"><span class="viz-label">Input</span><span class="viz-value">${escHtml(search)}</span></div>
    <div class="viz-step query"><span class="viz-label">Query</span><span class="viz-value">${escHtml(data.query)}</span></div>
    <div class="viz-step ${data.injectionDetected ? 'attack' : 'result'}"><span class="viz-label">Detection</span><span class="viz-value">${data.injectionDetected ? '🚨 SQL Injection Detected!' : '✅ Clean Input'}</span></div>
    <div class="viz-step result"><span class="viz-label">Result</span><span class="viz-value">${data.data.length} product(s) returned</span></div>
  `;
  show($('#visualizer'), vizHtml);

  let html = `<div class="result-box ${data.injectionDetected ? 'warning' : 'success'}"><div class="result-title">${data.message}</div>`;
  if (data.data && data.data.length) {
    html += '<table><tr><th>ID</th><th>Product</th><th>Description</th><th>Price</th></tr>';
    data.data.forEach(p => { html += `<tr><td>${p.id}</td><td>${escHtml(p.name)}</td><td>${escHtml(p.description||'')}</td><td>$${p.price}</td></tr>`; });
    html += '</table>';
  }
  if (data.injectionDetected) html += `<p style="margin-top:0.5rem"><span class="badge badge-attack">⚠ INJECTION DETECTED</span></p>`;
  html += '</div>';
  show($('#result'), html);
}

// --- DASHBOARD ---
async function initDashboard() {
  if (!$('#stats-grid')) return;
  await loadStats();
  await loadLogs();
  setInterval(loadStats, 5000);
  setInterval(loadLogs, 5000);
}

async function loadStats() {
  try {
    const res = await fetch(`${API}/api/logs/stats`);
    const s = await res.json();
    show($('#stat-total'), s.total);
    show($('#stat-attacks'), s.attacks);
    show($('#stat-success'), s.successful);
    show($('#stat-failed'), s.failed);
  } catch(e) {}
}

async function loadLogs() {
  try {
    const res = await fetch(`${API}/api/logs`);
    const { data } = await res.json();
    let html = '';
    data.slice(0, 50).forEach(log => {
      html += `<tr>
        <td>${escHtml(log.input || '')}</td>
        <td><span class="badge ${log.is_attack ? 'badge-attack' : 'badge-safe'}">${log.is_attack ? 'ATTACK' : 'SAFE'}</span></td>
        <td>${escHtml(log.result || '')}</td>
        <td>${log.timestamp}</td>
      </tr>`;
    });
    show($('#logs-body'), html);
  } catch(e) {}
}

// --- ADMIN ---
async function initAdmin() {
  if (!$('#admin-products')) return;
  await loadAdminProducts();

  $('#add-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#prod-name').value;
    const description = $('#prod-desc').value;
    const price = $('#prod-price').value;
    await fetch(`${API}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price })
    });
    $('#prod-name').value = ''; $('#prod-desc').value = ''; $('#prod-price').value = '';
    loadAdminProducts();
  });
}

async function loadAdminProducts() {
  try {
    const res = await fetch(`${API}/api/admin/products`);
    const { data } = await res.json();
    let html = '';
    data.forEach(p => {
      html += `<tr>
        <td>${p.id}</td><td>${escHtml(p.name)}</td><td>$${p.price}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button></td>
      </tr>`;
    });
    show($('#admin-products'), html);
  } catch(e) {}
}

async function deleteProduct(id) {
  await fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE' });
  loadAdminProducts();
}

// --- AUTO ATTACK ---
async function runAutoAttack() {
  const attacks = [
    { user: "' OR '1'='1", pass: "' OR '1'='1", desc: "Classic OR bypass" },
    { user: "admin'--", pass: "anything", desc: "Comment bypass" },
    { user: "' UNION SELECT * FROM users--", pass: "", desc: "UNION attack" },
    { user: "'; DROP TABLE users;--", pass: "", desc: "DROP TABLE attack" },
    { user: "admin", pass: "admin123", desc: "Normal login (control)" }
  ];

  const container = $('#auto-results');
  if (!container) return;
  container.innerHTML = '<p style="color:var(--purple)">🤖 Running automated attacks...</p>';

  for (const atk of attacks) {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: atk.user, password: atk.pass, mode: 'vulnerable' })
      });
      const data = await res.json();
      container.innerHTML += `
        <div class="viz-step ${data.success ? 'result' : 'attack'}" style="margin-top:0.5rem">
          <span class="viz-label">${atk.desc}</span>
          <span class="viz-value">
            Input: <code>${escHtml(atk.user)}</code> →
            ${data.success ? '<span style="color:var(--green)">✅ Success</span>' : '<span style="color:var(--red)">❌ Failed</span>'}
            (${data.data?.length || 0} rows)
          </span>
        </div>`;
      await new Promise(r => setTimeout(r, 500));
    } catch(e) {}
  }
  container.innerHTML += '<p style="color:var(--green);margin-top:1rem">✅ Auto attack complete! Check dashboard for logs.</p>';
}

// --- Utilities ---
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initProducts();
  initDashboard();
  initAdmin();
});
