(() => {
  const path = location.pathname.replace(/\\/g, '/');
  const isEnglish = /\/en(?:\/|$)/.test(path);
  const file = location.pathname.split('/').pop() || 'index.html';
  const spanishHref = isEnglish ? `../${file}` : file;
  const englishHref = isEnglish ? file : `en/${file}`;
  const headerContainer = document.querySelector('header .container');

  if (!document.body || document.querySelector('.language-switch')) return;

  const switcher = document.createElement('nav');
  switcher.className = 'language-switch';
  switcher.setAttribute('aria-label', isEnglish ? 'Language selector' : 'Selector de idioma');
  switcher.innerHTML = `
    <a href="${spanishHref}" class="${isEnglish ? '' : 'active'}" lang="es" aria-label="Espa&#241;ol" title="Espa&#241;ol">
      <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>
    </a>
    <a href="${englishHref}" class="${isEnglish ? 'active' : ''}" lang="en" aria-label="English" title="English">
      <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4"/><path d="M0 0 30 20M30 0 0 20" stroke="#c8102e" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3"/></svg>
    </a>`;

  (headerContainer || document.body).append(switcher);

  const style = document.createElement('style');
  style.textContent = `.language-switch{position:static;z-index:auto;display:flex;flex:0 0 auto;align-items:center;gap:.42rem;margin-left:1rem;white-space:nowrap}.language-switch a{display:grid;place-items:center;width:1.72rem;height:1.18rem;text-decoration:none;opacity:.68;border-radius:3px;overflow:hidden;transition:opacity .2s,transform .2s,box-shadow .2s}.language-switch svg{display:block;width:100%;height:100%}.language-switch a:hover{opacity:1;transform:translateY(-1px)}.language-switch a.active{opacity:1;box-shadow:0 0 0 2px #d4a72c}@media(min-width:901px){.language-switch{position:fixed;top:28px;right:30px;z-index:3200;margin:0}header .container>nav:not(.language-switch){transform:translateX(calc(-1 * clamp(112px,9vw,170px)))!important;gap:clamp(12px,1.35vw,28px)!important}header .container>nav:not(.language-switch)>a{font-size:clamp(.68rem,.88vw,.9rem)!important}}@media(max-width:900px){.language-switch{position:fixed!important;inset:20px 92px auto auto!important;width:auto!important;height:auto!important;min-height:0!important;padding:0!important;margin:0!important;background:transparent!important;transform:none!important;transition:none!important;z-index:3200!important;gap:6px!important}}`;
  document.head.append(style);
})();
