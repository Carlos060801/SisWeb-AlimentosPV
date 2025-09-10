// Router + Auth (solo muestra login al abrir; sin header/sidebar en rutas públicas)
const $app = document.getElementById('app');
const $header = document.getElementById('header');
const $sidebar = document.getElementById('sidebar');

const routes = {
  '/login': 'views/login.html',
  '/signup': 'views/signup.html',
  '/recuperar': 'views/recuperar.html',
  '/dashboard': 'views/dashboard.html',
  '/registro': 'views/registro.html',
  '/inventario': 'views/inventario.html',
  '/alertas': 'views/alertas.html',
  '/donaciones': 'views/donaciones.html',
  '/reportes': 'views/reportes.html',
  '/404': 'views/404.html'
};

const PROTECTED = new Set(['/dashboard','/registro','/inventario','/alertas','/donaciones','/reportes']);
const PUBLIC    = new Set(['/login','/signup','/recuperar']);

// ===== Store helpers =====
function getUsers(){ try { return JSON.parse(localStorage.getItem('users')||'[]'); } catch{ return []; } }
function saveUsers(list){ localStorage.setItem('users', JSON.stringify(list)); }
function getCurrentUser(){ try { return JSON.parse(localStorage.getItem('currentUser')||'null'); } catch{ return null; } }
function setCurrentUser(u){ if (u) localStorage.setItem('currentUser', JSON.stringify(u)); else localStorage.removeItem('currentUser'); }

// ---- Productos (inventario) ----
const PROD_KEY = 'productos';
function getProductos(){ try { return JSON.parse(localStorage.getItem(PROD_KEY)||'[]'); } catch{ return []; } }
function saveProductos(list){
  localStorage.setItem(PROD_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('app:data'));
}
const newId = (p='p') => p + '_' + Math.random().toString(36).slice(2,9);
function daysUntil(s){
  if (!s) return null;
  const d = new Date(s+'T00:00:00'); if (isNaN(d)) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((d - now)/86400000);
}

// ---- Donaciones ----
const DON_KEY = 'donaciones';
function getDonaciones(){ try { return JSON.parse(localStorage.getItem(DON_KEY) || '[]'); } catch { return []; } }
function saveDonaciones(list){
  localStorage.setItem(DON_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('app:data'));
}

// ===== Reportes: factores de cálculo (por si los usas luego)
const KG_POR_UNIDAD   = 1.0;
const FAMILIAS_POR_20U= 1 / 20;
const PRECIO_PROMEDIO = 15000;

// ===== UI helpers =====
async function loadFragment(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo cargar '+ url);
  return await res.text();
}

async function renderChrome() {
  const user = getCurrentUser();
  if (!user) {
    $header.innerHTML = '';
    $sidebar.innerHTML = '';
    $header.removeAttribute('data-ready');
    $sidebar.removeAttribute('data-ready');
    return;
  }
  if (!$header.dataset.ready) {
    $header.innerHTML = await loadFragment('components/header.html');
    $header.dataset.ready = '1';
    bindHeader();
    updateAuthUI();
  }
  if (!$sidebar.dataset.ready) {
    $sidebar.innerHTML = await loadFragment('components/sidebar.html');
    $sidebar.dataset.ready = '1';
    $sidebar.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href^="#/"]');
      if (!a) return;
      e.preventDefault();
      navigate(a.getAttribute('href').slice(1));
    });
  }
}

function bindHeader(){
  const logoutBtn = $header.querySelector('[data-logout]');
  if (logoutBtn) logoutBtn.addEventListener('click', ()=>{
    setCurrentUser(null);
    renderChrome();
    navigate('/login');
  });
}

function updateAuthUI(){
  const user = getCurrentUser();
  const status   = $header.querySelector('[data-auth-status]');
  const label    = $header.querySelector('[data-user-label]');
  const loginLink= $header.querySelector('[data-login]');
  const logoutBtn= $header.querySelector('[data-logout]');
  if (!status) return;
  if (user){
    status.textContent = 'Conectado';
    if (label)    label.textContent = ` | ${user.name} (${user.email})`;
    if (loginLink)loginLink.style.display = 'none';
    if (logoutBtn)logoutBtn.style.display = 'inline-flex';
  } else {
    status.textContent = 'Desconectado';
    if (label)    label.textContent = '';
    if (loginLink)loginLink.style.display = 'inline-flex';
    if (logoutBtn)logoutBtn.style.display = 'none';
  }
}

// ===== Router =====
function currentPath(){
  const h = location.hash.replace('#','');
  const p = h ? (h.startsWith('/') ? h : '/'+h) : '/login';
  const user = getCurrentUser();
  if (!user && PROTECTED.has(p)) return '/login';
  return p;
}

async function navigate(path) {
  const user = getCurrentUser();
  if (!user && PROTECTED.has(path)) path = '/login';

  if (PUBLIC.has(path)) {
    $header.innerHTML = '';
    $sidebar.innerHTML = '';
    $header.removeAttribute('data-ready');
    $sidebar.removeAttribute('data-ready');
  } else {
    await renderChrome();
  }

  const url = routes[path] || routes['/404'];
  try {
    $app.innerHTML = await loadFragment(url);
    if (location.hash !== '#'+path) history.pushState({}, '', '#'+path);
    markActive(path);

    // ===== Bindings por vista =====
    if (path === '/login')      bindLogin();
    if (path === '/signup')     bindSignup();
    if (path === '/recuperar')  bindReset();

    if (path === '/registro')   bindRegistro();
    if (path === '/inventario') mountInventario();
    if (path === '/alertas')    mountAlertas();
    if (path === '/donaciones') mountDonaciones();
    if (path === '/reportes')   mountReportes();
    if (path === '/dashboard')  mountDashboard();   // ← Dashboard dinámico

  } catch (err) {
    console.error(err);
    $app.innerHTML = '<div class="card"><h2>Error cargando la vista.</h2></div>';
  }
}

function markActive(path){
  const links = $sidebar.querySelectorAll('a[href^="#/"]');
  links.forEach(a=>{
    const href = a.getAttribute('href').slice(1);
    a.classList.toggle('active', href === path);
  });
}

// ===== View logic: Auth =====
function bindSignup(){
  const form = document.getElementById('signup-form');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    if (users.some(u => u.email === data.email.trim().toLowerCase())){
      alert('Ese correo ya está registrado.');
      return;
    }
    users.push({ name: data.name.trim(), email: data.email.trim().toLowerCase(), password: data.password });
    saveUsers(users);
    alert('Cuenta creada. Ahora inicia sesión.');
    navigate('/login');
  });
}

function bindLogin(){
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    const user = users.find(u => u.email === data.email.trim().toLowerCase() && u.password === data.password);
    if (!user){
      alert('Correo o contraseña inválidos.');
      return;
    }
    setCurrentUser({ name: user.name, email: user.email });
    updateAuthUI();
    renderChrome().then(()=> navigate('/dashboard'));
  });
}

function bindReset(){
  const form = document.getElementById('reset-form');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    const idx = users.findIndex(u => u.email === data.email.trim().toLowerCase());
    if (idx === -1){
      alert('No existe una cuenta con ese correo.');
      return;
    }
    users[idx].password = data.password;
    saveUsers(users);
    alert('Contraseña actualizada. Inicia sesión.');
    navigate('/login');
  });
}

// ===== View logic: Registro (guardar y redirigir) =====
function bindRegistro(){
  const form = document.getElementById('form-registro') || document.querySelector('#registro form');
  if (!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.id = newId('p');
    data.cantidad = Number(data.cantidad || 0);

    const list = getProductos();
    list.push(data);
    saveProductos(list);

    form.reset();
    navigate('/inventario');
  });
}

// ===== View logic: Inventario =====
function mountInventario(){
  const tbody = document.getElementById('inv-body') || document.querySelector('#inventario tbody');
  if (!tbody) return;

  const search = document.getElementById('inv-search') || document.querySelector('#inventario input[type="search"]');
  const filt7  = document.getElementById('filt-7');
  const filt5  = document.getElementById('filt-5');

  function pintar(){
    const all = getProductos();
    let list = all;

    const q = (search?.value || '').toLowerCase();
    if (q) list = list.filter(p => JSON.stringify(p).toLowerCase().includes(q));

    if (filt7?.checked) list = list.filter(p => { const d=daysUntil(p.f_vencimiento); return d!==null && d<=7; });
    if (filt5?.checked) list = list.filter(p => { const d=daysUntil(p.f_vencimiento); return d!==null && d<=5; });

    tbody.innerHTML = '';
    list.forEach(p=>{
      const d = daysUntil(p.f_vencimiento);
      const tr = document.createElement('tr');
      if (d !== null && d <= 7 && d > 5) tr.classList.add('is-warn');
      if (d !== null && d <= 5)          tr.classList.add('is-danger');

      const estadoClass = (p.estado||'').toLowerCase().includes('donación') ? 'danger'
                        : (p.estado||'').toLowerCase().includes('promoción') ? 'warn'
                        : 'ok';

      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre||''}</td>
        <td>${p.categoria||''}</td>
        <td>${p.f_vencimiento||''}</td>
        <td>${p.cantidad||0}</td>
        <td><span class="tag ${estadoClass}">${p.estado||'Disponible'}</span></td>
        <td class="actions-cell">
          <a href="#/registro" class="btn tiny" data-edit="${p.id}">Editar</a>
          <button class="btn tiny ghost" data-del="${p.id}">Eliminar</button>
          <button class="btn tiny">Copiar ID</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  search && search.addEventListener('input', pintar);
  filt7  &&  filt7.addEventListener('change', pintar);
  filt5  &&  filt5.addEventListener('change', pintar);

  tbody.addEventListener('click', (e)=>{
    const del  = e.target.closest('[data-del]');
    const copy = e.target.closest('[data-copy]');
    if (del){
      const id = del.getAttribute('data-del');
      const next = getProductos().filter(x => x.id !== id);
      saveProductos(next);
      pintar();
    }
    if (copy){
      const id = copy?.getAttribute('data-copy');
      if (id) {
        navigator.clipboard?.writeText(id);
        alert('ID copiado: ' + id);
      }
    }
  });

  window.addEventListener('app:data', pintar);
  pintar();
}

// ===== View logic: Alertas =====
function mountAlertas(){
  const L7  = document.getElementById('alerta-7');
  const L5  = document.getElementById('alerta-5');
  const LOK = document.getElementById('alerta-ok');
  if (!L7 || !L5 || !LOK) return;

  const fmt = (p) => `${p.nombre || '(s/n)'} — vence ${p.f_vencimiento || 's/d'} (${Number(p.cantidad||0)} u.)`;

  function paint(){
    const prods = getProductos();

    const soon7 = []; // >5 y ≤7
    const five5 = []; // ≤5
    const ok    = []; // >7 o sin fecha válida

    prods.forEach(p=>{
      const dv = daysUntil(p.f_vencimiento);
      if (dv === null || dv > 7) ok.push(p);
      else if (dv <= 5) five5.push(p);
      else soon7.push(p);
    });

    L7.innerHTML  = soon7.length ? soon7.map(p => `<li>${fmt(p)}</li>`).join('')  : '<li>No hay avisos</li>';
    L5.innerHTML  = five5.length ? five5.map(p => `<li>${fmt(p)}</li>`).join('')  : '<li>No hay avisos</li>';
    LOK.innerHTML = ok.length    ? ok.map(p => `<li>${fmt(p)}</li>`).join('')     : '<li>No hay avisos</li>';
  }

  window.addEventListener('app:data', paint);
  paint();
}

// ===== View logic: Donaciones =====
function mountDonaciones(){
  const tbody = document.getElementById('don-prod-body');
  const form  = document.getElementById('form-donacion');
  if (!tbody || !form) return;

  function paint(){
    const list = getProductos();
    const elegibles = list.filter(p=>{
      const d = daysUntil(p.f_vencimiento);
      const porVencer = d !== null && d <= 5;
      const marcadoDon = (p.estado || '').toLowerCase().includes('donación');
      return porVencer || marcadoDon;
    });

    tbody.innerHTML = '';
    elegibles.forEach(p=>{
      const d = daysUntil(p.f_vencimiento);
      const tr = document.createElement('tr');
      if (d !== null && d <= 5) tr.classList.add('is-danger');
      else if (d !== null && d <= 7) tr.classList.add('is-warn');

      tr.innerHTML = `
        <td><input type="checkbox" data-id="${p.id}"></td>
        <td>${p.id}</td>
        <td>${p.nombre || ''}</td>
        <td>${p.f_vencimiento || ''}</td>
        <td>${p.cantidad || 0}</td>
        <td>
          <span class="tag ${
            (p.estado||'').toLowerCase().includes('donación') ? 'danger' :
            (p.estado||'').toLowerCase().includes('promoción') ? 'warn' : 'ok'
          }">${p.estado || 'Disponible'}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const cantidadTotal = Number(data.cantidad || 0);
    if (!cantidadTotal || cantidadTotal <= 0) { alert('Indica una cantidad válida'); return; }

    const ids = Array.from(tbody.querySelectorAll('input[type="checkbox"]:checked'))
                     .map(ch => ch.getAttribute('data-id'));
    if (!ids.length){ alert('Selecciona al menos un producto'); return; }

    const inv = getProductos();
    let restante = cantidadTotal;
    const regs = [];

    for (const id of ids){
      if (restante <= 0) break;
      const prod = inv.find(p => p.id === id);
      if (!prod) continue;

      const puede = Math.min(restante, Number(prod.cantidad || 0));
      if (puede <= 0) continue;

      regs.push({
        id: newId('d'),
        productoId: prod.id,
        productoNombre: prod.nombre,
        fecha: data.fecha,
        cantidad: puede,
        organizacion: data.organizacion,
        contacto: data.contacto || ''
      });

      prod.cantidad = Number(prod.cantidad || 0) - puede;
      if (prod.cantidad <= 0){
        prod.cantidad = 0;
        prod.estado = 'Donado';
      } else if ((prod.estado||'').toLowerCase().includes('disponible')) {
        prod.estado = 'En donación';
      }

      restante -= puede;
    }

    if (!regs.length){ alert('No se pudo asignar cantidad a los productos seleccionados'); return; }

    const dons = getDonaciones();
    saveDonaciones(dons.concat(regs));
    saveProductos(inv);

    form.reset();
    tbody.querySelectorAll('input[type="checkbox"]').forEach(ch => ch.checked = false);
    paint();

    alert('Entrega registrada correctamente');
  });

  window.addEventListener('app:data', paint);
  paint();
}

// ===== Reportes =====
function exportCSV(nombre, rows){
  const header = Object.keys(rows[0] || {});
  const csv = [header.join(',')].concat(
    rows.map(r => header.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombre + '.csv'; a.click();
  URL.revokeObjectURL(url);
}

function mountReportes(){
  const $rescatados = document.getElementById('rep-rescatados');
  const $donados    = document.getElementById('rep-donados');

  const $barRes     = document.getElementById('rep-rescatados-bar');
  const $barDon     = document.getElementById('rep-donados-bar');

  const expBtns     = document.querySelectorAll('[data-exp]');

  const pct = (val, base=100) => Math.max(0, Math.min(100, Math.round((val / (base||1)) * 100)));

  function recompute(){
    const prods = getProductos();
    const dons  = getDonaciones();

    const totalUnidades  = prods.reduce((s,p)=> s + Number(p.cantidad||0), 0);
    const totalDonadas   = dons.reduce((s,d)=> s + Number(d.cantidad||0), 0);

    $rescatados && ($rescatados.textContent = totalUnidades + totalDonadas);
    $donados    && ($donados.textContent    = totalDonadas);

    $barRes && ($barRes.style.width = pct(totalUnidades + totalDonadas, 100) + '%');
    $barDon && ($barDon.style.width = pct(totalDonadas, 100) + '%');

    expBtns.forEach(btn=>{
      btn.onclick = ()=>{
        const t = btn.getAttribute('data-exp') || '';
        if (t.endsWith('-xls')){
          if (t.startsWith('donados')){
            const rows = dons.map(d => ({
              id: d.id, productoId: d.productoId, producto: d.productoNombre||'',
              fecha: d.fecha||'', cantidad: d.cantidad||0,
              organizacion: d.organizacion||'', contacto: d.contacto||''
            }));
            exportCSV('donaciones', rows);
          } else if (t.startsWith('rescatados')){
            const rows = prods.map(p => ({
              id: p.id, nombre: p.nombre||'', categoria: p.categoria||'',
              vence: p.f_vencimiento||'', cantidad: p.cantidad||0, estado: p.estado||''
            }));
            exportCSV('inventario', rows);
          }
        } else if (t.endsWith('-pdf')){
          window.print();
        }
      };
    });
  }

  window.addEventListener('app:data', recompute);
  recompute();
}

// ===== Dashboard (círculo pequeño no invasivo) =====
function mountDashboard(){
  const circle = document.querySelector('.progress-circle'); // contenedor con --pct
  const $pct   = document.getElementById('dash-pct');        // texto del %
  const $don   = document.getElementById('dash-donaciones'); // unidades donación
  const $alert = document.getElementById('dash-alertas');    // cantidad alertas
  if (!circle || !$pct || !$don || !$alert) return;

  function paint(){
    const prods = getProductos();
    const dons  = getDonaciones();

    const total   = prods.length;
    const vencen7 = prods.filter(p=>{
      const d = daysUntil(p.f_vencimiento);
      return d!==null && d<=7;
    }).length;
    const pct = total ? Math.round((vencen7/total)*100) : 0;

    const totalDon = dons.reduce((s,d)=> s + Number(d.cantidad||0), 0);

    const alertas = prods.filter(p=>{
      const d = daysUntil(p.f_vencimiento);
      return (d!==null && d<=7) || (p.estado||'').toLowerCase().includes('donación');
    }).length;

    // Actualiza círculo (usa CSS var --pct en dashboard.html)
    circle.style.setProperty('--pct', pct);
    $pct.textContent = pct + '%';
    $don.textContent = totalDon;
    $alert.textContent = alertas;
  }

  window.addEventListener('app:data', paint);
  paint();
}

// ===== Boot =====
window.addEventListener('hashchange', ()=> navigate(currentPath()));
window.addEventListener('popstate', ()=> navigate(currentPath()));
(async function init(){
  navigate(currentPath());
})();
