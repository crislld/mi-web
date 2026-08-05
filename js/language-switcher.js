(() => {
  const isEnglish = /^\/en(?:\/|$)/.test(location.pathname.replace(/\\/g, '/'));
  const file = location.pathname.split('/').pop() || 'index.html';
  const counterpart = isEnglish ? `../${file}` : `en/${file}`;
  const header = document.querySelector('header .container') || document.querySelector('header');
  if (!header || document.querySelector('.language-switch')) return;
  const switcher = document.createElement('nav');
  switcher.className = 'language-switch';
  switcher.setAttribute('aria-label', isEnglish ? 'Language selector' : 'Selector de idioma');
  switcher.innerHTML = `<a href="${counterpart}" class="${isEnglish ? '' : 'active'}" lang="es">ES</a><span>/</span><a href="${counterpart}" class="${isEnglish ? 'active' : ''}" lang="en">EN</a>`;
  if (isEnglish) switcher.querySelector('a[lang="es"]').href = counterpart;
  else switcher.querySelector('a[lang="en"]').href = counterpart;
  header.append(switcher);
  const style = document.createElement('style');
  style.textContent = `.language-switch{display:flex;align-items:center;gap:.35rem;margin-left:1rem;font:600 .72rem/1 Inter,Arial,sans-serif;letter-spacing:.08em;white-space:nowrap}.language-switch a{color:inherit;text-decoration:none;opacity:.58}.language-switch a.active{color:#d4a72c;opacity:1}.language-switch span{opacity:.35}@media(max-width:820px){.language-switch{position:absolute;right:3.8rem;top:1.55rem;margin:0;font-size:.68rem}header{position:relative}}`;
  document.head.append(style);
})();
