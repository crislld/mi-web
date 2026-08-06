(() => {
  const path = location.pathname.replace(/\\/g, '/');
  const isEnglish = /\/en(?:\/|$)/.test(path);
  const file = location.pathname.split('/').pop() || 'index.html';
  const spanishHref = isEnglish ? `../${file}` : file;
  const englishHref = isEnglish ? file : `en/${file}`;
  const header = document.querySelector('header .container') || document.querySelector('header');
  if (!header || document.querySelector('.language-switch')) return;
  const switcher = document.createElement('nav');
  switcher.className = 'language-switch';
  switcher.setAttribute('aria-label', isEnglish ? 'Language selector' : 'Selector de idioma');
  switcher.innerHTML = `<a href="${spanishHref}" class="${isEnglish ? '' : 'active'}" lang="es" aria-label="Español" title="Español">🇪🇸</a><a href="${englishHref}" class="${isEnglish ? 'active' : ''}" lang="en" aria-label="English" title="English">🇬🇧</a>`;
  header.append(switcher);
  const style = document.createElement('style');
  style.textContent = `.language-switch{display:flex;align-items:center;gap:.35rem;margin-left:1rem;white-space:nowrap}.language-switch a{display:grid;place-items:center;width:1.65rem;height:1.25rem;text-decoration:none;opacity:.55;font-size:1.08rem;line-height:1;border-radius:3px;transition:opacity .2s,transform .2s,box-shadow .2s}.language-switch a:hover{opacity:1;transform:translateY(-1px)}.language-switch a.active{opacity:1;box-shadow:0 0 0 1px #d4a72c}@media(max-width:820px){.language-switch{position:absolute;right:3.8rem;top:1.3rem;margin:0}header{position:relative}}`;
  document.head.append(style);
})();
