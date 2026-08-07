const simQ = s => document.querySelector(s);

// The same simulator is also embedded in the Virtual Lab. In that context,
// keep only the interactive interface: no duplicated page header or intro.
if (new URLSearchParams(location.search).has('embed')) {
  document.documentElement.classList.add('sim-embedded');
  const embedStyle = document.createElement('style');
  embedStyle.textContent = `
    html.sim-embedded, html.sim-embedded body { margin: 0; min-height: 100%; background: #092038; overflow: hidden; }
    .sim-embedded body > header,
    .sim-embedded .sim-heading,
    .sim-embedded .sim-help,
    .sim-embedded .language-switch { display: none !important; }
    .sim-embedded .sim-page { min-height: 100vh; padding: 0 !important; display: flex; background: #092038; }
    .sim-embedded .sim-shell { width: 100%; max-width: none; margin: 0; border-radius: 0; box-shadow: none; align-self: stretch; }
    @media (max-width: 640px) {
      .sim-embedded .sim-shell { min-height: 100vh; }
    }
  `;
  document.head.append(embedStyle);
}
const simM = {
  water: { title:'M01 · TEMPERATURA DE CUBIERTA', brief:'Escanea cuatro microparcelas para estimar el estrés hídrico.', tag:'M01 / ESTRÉS HÍDRICO', camera:'Zenmuse H20T · TÉRMICA 640×512', image:'campo-cebada-aereo.jpg', metric:'Tc', base:26.4, unit:' °C' },
  vigor: { title:'M02 · VIGOR Y FENOTIPADO', brief:'Obtén muestras NDVI de las líneas de cebada del ensayo.', tag:'M02 / FENOTIPADO', camera:'MicaSense RedEdge‑P · 5 BANDAS', image:'ensayo-cebadas-mercedes.png', metric:'NDVI', base:.58, unit:'' },
  rust: { title:'M03 · SANIDAD FOLIAR', brief:'Registra síntomas visibles para priorizar el muestreo de roya.', tag:'M03 / SANIDAD FOLIAR', camera:'RGB · 20 MP · GSD 0.62 cm/px', image:'ensayo-cebadas-mercedes.png', metric:'Severidad', base:8.2, unit:' %' }
};

let simKeys = {}, simMission = 'water', simMode = 'rgb', simD, simDone, simBattery, simRecords, simTargets, simLast;
const simStage = simQ('#stage'), simField = simQ('#field'), simDrone = simQ('#drone'), simScan = simQ('#scan');

// Sustituye el icono genérico por un cuadricóptero visto desde arriba.
simDrone.innerHTML = `<svg viewBox="0 0 120 120" aria-label="Dron cuadricóptero" role="img" style="width:58px;height:58px;display:block;filter:drop-shadow(0 5px 4px #000)"><g stroke="#101d27" stroke-width="7" stroke-linecap="round"><path d="M48 48 22 22M72 48 98 22M48 72 22 98M72 72l26 26"/></g><g fill="#263d4b" stroke="#bed2d3" stroke-width="3"><ellipse cx="18" cy="18" rx="15" ry="6"/><ellipse cx="102" cy="18" rx="15" ry="6"/><ellipse cx="18" cy="102" rx="15" ry="6"/><ellipse cx="102" cy="102" rx="15" ry="6"/><path d="M43 45Q60 32 77 45v30Q60 88 43 75z"/></g><path fill="#d9f2ee" d="M51 49h18v22H51z"/><path fill="#c8a15a" d="M57 44h6v35h-6z"/><circle cx="60" cy="61" r="5" fill="#77f0d9"/></svg>`;
simDrone.style.width = '58px'; simDrone.style.height = '58px'; simDrone.style.fontSize = '0';

const simControls = new Set([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D']);
addEventListener('keydown', e => { if (simControls.has(e.key)) e.preventDefault(); simKeys[e.key.toLowerCase()] = true; }, { passive:false });
addEventListener('keyup', e => { if (simControls.has(e.key)) e.preventDefault(); simKeys[e.key.toLowerCase()] = false; }, { passive:false });

document.querySelectorAll('.mission').forEach(b => b.onclick = () => { simMission = b.dataset.m; document.querySelectorAll('.mission').forEach(x => x.classList.toggle('active', x === b)); simReset(); });
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { simMode = b.dataset.mode; document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('active', x === b)); simStage.className = 'stage ' + simMode; });
simQ('#download').onclick = () => { const head = 'mision,muestra,latitud,longitud,sensor,medida,valor\n'; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([head + simRecords.map(x => Object.values(x).join(',')).join('\n')], {type:'text/csv'})); a.download = 'agrolab-datos-' + simMission + '.csv'; a.click(); };

function simReset() {
  const m = simM[simMission]; simD = {x:10,y:87,vx:0,vy:0}; simDone = 0; simBattery = 88; simRecords = [];
  simTargets?.forEach(x => x.remove()); simTargets = [];
  [[30,54],[58,32],[74,61],[47,76]].forEach(([x,y]) => { const e = document.createElement('div'); e.className = 'target'; e.style.left = x + '%'; e.style.top = y + '%'; simStage.append(e); simTargets.push(e); });
  simField.style.backgroundImage = `url('img/laboratorio/${m.image}')`;
  simQ('#missionTitle').textContent = m.title; simQ('#brief').textContent = m.brief; simQ('#missionTag').textContent = m.tag; simQ('#cameraTag').textContent = m.camera;
  simQ('#score').textContent = '00 / 04'; simQ('#progress').style.width = '0%'; simQ('#log').textContent = 'Esperando adquisición…';
  simQ('#readout').innerHTML = 'GPS RTK: FIX ± 1.8 cm<br>IMU: estable · 100 Hz<br>Fotogramas: 0 · Geotags: 0';
}
function simTick(now) {
  const dt = Math.min(.04, (now - simLast) / 1000 || 0); simLast = now;
  const ax = (simKeys.a || simKeys.arrowleft ? -1 : 0) + (simKeys.d || simKeys.arrowright ? 1 : 0);
  const ay = (simKeys.w || simKeys.arrowup ? -1 : 0) + (simKeys.s || simKeys.arrowdown ? 1 : 0);
  simD.vx += (ax * 72 - simD.vx * 3) * dt; simD.vy += (ay * 72 - simD.vy * 3) * dt;
  simD.x = Math.max(2, Math.min(98, simD.x + simD.vx * dt)); simD.y = Math.max(2, Math.min(98, simD.y + simD.vy * dt));
  const speed = Math.hypot(simD.vx, simD.vy); simBattery = Math.max(0, simBattery - dt * (.09 + speed * .007 + (simKeys[' '] ? .32 : 0)));
  simDrone.style.left = simD.x + '%'; simDrone.style.top = simD.y + '%'; simScan.style.left = simD.x + '%'; simScan.style.top = simD.y + '%'; simScan.classList.toggle('active', !!simKeys[' ']);
  simQ('#battery').textContent = Math.ceil(simBattery) + '%'; simQ('#batteryBar').style.width = simBattery + '%'; simQ('#speed').textContent = (speed / 10).toFixed(1) + ' m/s';
  if (simKeys[' ']) simTargets.forEach(e => { if (e.classList.contains('done')) return; const r = e.getBoundingClientRect(), s = simStage.getBoundingClientRect(), x = (r.left + r.width / 2 - s.left) / s.width * 100, y = (r.top + r.height / 2 - s.top) / s.height * 100; if (Math.hypot(simD.x - x, simD.y - y) < 7 && speed < 21) { e.classList.add('done'); simDone++; const m = simM[simMission], value = (m.base + (Math.random()-.5) * (simMission === 'vigor' ? .18 : simMission === 'rust' ? 7 : 4)).toFixed(simMission === 'vigor' ? 2 : 1); simRecords.push({mision:simMission,muestra:simDone,latitud:(41.701+simD.y*.000012).toFixed(6),longitud:(-.872+simD.x*.000015).toFixed(6),sensor:simMode,medida:m.metric,valor:value+m.unit}); simQ('#score').textContent = '0' + simDone + ' / 04'; simQ('#progress').style.width = simDone * 25 + '%'; simQ('#readout').innerHTML = `GPS RTK: FIX ± 1.8 cm<br>IMU: estable · 100 Hz<br>Fotogramas: ${simDone * 18} · Geotags: ${simDone}`; simQ('#log').innerHTML = `[${simDone}] ${m.metric}: <b>${value}${m.unit}</b> · ${simMode.toUpperCase()}<br>` + simQ('#log').innerHTML; } });
  requestAnimationFrame(simTick);
}
simReset(); requestAnimationFrame(simTick);

// Cada sensor inicia una adquisición independiente: se pueden volver a capturar las parcelas.
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
  simMode = b.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('active', x === b));
  simStage.className = 'stage ' + simMode;
  simReset();
  simQ('#log').textContent = 'Sensor ' + b.textContent.trim().toUpperCase() + ' preparado. Nueva adquisición iniciada…';
});

const simResetButton = document.createElement('button');
simResetButton.type = 'button';
simResetButton.textContent = 'Reiniciar';
simResetButton.title = 'Reiniciar misión';
simResetButton.style.cssText = 'border:1px solid #ffffff33;border-radius:4px;background:#12344f;color:#d7e7e9;padding:7px 9px;font-size:10px;cursor:pointer';
simResetButton.onclick = () => { simReset(); simQ('#log').textContent = 'Misión reiniciada. Esperando adquisición…'; };
document.querySelector('.camera-switch').append(simResetButton);

// Controles táctiles para móvil: no dependen del teclado y no desplazan la página.
const simTouchStyle = document.createElement('style');
simTouchStyle.textContent = `
  .sim-touch-controls{display:none}
  @media(max-width:640px){
    .sim-touch-controls{display:flex;justify-content:space-between;align-items:center;padding:14px 16px 18px;background:#092038;border-top:1px solid #ffffff19;touch-action:none}
    .sim-touch-pad{position:relative;width:126px;height:126px}
    .sim-touch-pad button,.sim-touch-scan{position:absolute;border:1px solid #a9d7cd77;background:#143952;color:#effbf5;font-weight:700;touch-action:none;-webkit-user-select:none;user-select:none}
    .sim-touch-pad button{width:40px;height:40px;border-radius:10px;font-size:18px}
    .sim-touch-pad .up{left:43px;top:0}.sim-touch-pad .left{left:0;top:43px}.sim-touch-pad .right{right:0;top:43px}.sim-touch-pad .down{left:43px;bottom:0}
    .sim-touch-scan{position:static;width:105px;height:105px;border-radius:50%;font-size:12px;letter-spacing:.5px;color:#77f0d9;background:#123f4a;box-shadow:0 0 0 7px #77f0d91a}
    .sim-touch-scan:active{background:#27746e;transform:scale(.96)}
    .data-panel{border-top:1px solid #ffffff18}.sim-heading h1{font-size:40px}.sim-heading p{font-size:14px}.sim-shell{margin-top:0}
  }`;
document.head.append(simTouchStyle);
const simTouch = document.createElement('div');
simTouch.className = 'sim-touch-controls';
simTouch.innerHTML = `<div class="sim-touch-pad"><button class="up" data-touch="w" aria-label="Subir">↑</button><button class="left" data-touch="a" aria-label="Izquierda">←</button><button class="right" data-touch="d" aria-label="Derecha">→</button><button class="down" data-touch="s" aria-label="Bajar">↓</button></div><button class="sim-touch-scan" data-touch=" ">MANTÉN<br>ESCANEAR</button>`;
document.querySelector('.flight').append(simTouch);
simTouch.querySelectorAll('[data-touch]').forEach(button => {
  const key = button.dataset.touch;
  const set = (value, event) => { event.preventDefault(); simKeys[key] = value; };
  button.addEventListener('pointerdown', event => set(true, event));
  button.addEventListener('pointerup', event => set(false, event));
  button.addEventListener('pointercancel', event => set(false, event));
  button.addEventListener('pointerleave', event => set(false, event));
});

// Capas reales del ensayo: NDVI y temperatura. La RGB es una reconstrucción visual generada
// a partir de la geometría del mismo campo, por lo que se identifica como simulada en la interfaz.
const simCameraAssets = {
  rgb: { file:'campo-rgb-simulado.png', tag:'RGB · ORTOMOSAICO SIMULADO · 20 MP' },
  ndvi: { file:'campo-ndvi-real.png', tag:'NDVI REAL · MAPA DE VIGOR' },
  thermal: { file:'campo-termica-real.png', tag:'TÉRMICA REAL · TEMPERATURA DE CUBIERTA' }
};
const simCameraStyle = document.createElement('style');
simCameraStyle.textContent = '#stage.uses-camera-image .spectral{display:none!important}#stage.uses-camera-image .field{filter:none!important;background-position:center center!important;background-size:contain!important;background-repeat:no-repeat!important;background-color:#fff!important}';
document.head.append(simCameraStyle);
function simApplyCameraImage() {
  const asset = simCameraAssets[simMode];
  simStage.classList.add('uses-camera-image');
  simField.style.backgroundImage = `url('img/laboratorio/${asset.file}')`;
  simQ('#cameraTag').textContent = asset.tag;
}
const simBaseReset = simReset;
simReset = function () { simBaseReset(); simApplyCameraImage(); };
document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => {
  simMode = button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item === button));
  simStage.className = 'stage ' + simMode;
  simReset();
  simQ('#log').textContent = 'Capa ' + button.textContent.trim().toUpperCase() + ' preparada. Nueva adquisición iniciada…';
});
simApplyCameraImage();
