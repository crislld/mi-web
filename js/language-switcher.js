(() => {
  const normalizedPath = location.pathname.replace(/\\/g, '/');
  const isEnglish = /\/en(?:\/|$)/.test(normalizedPath);
  const file = normalizedPath.split('/').pop() || 'index.html';
  const spanishHref = isEnglish ? `../${file}` : file;
  const englishHref = isEnglish ? file : `en/${file}`;

  if (!document.body || document.querySelector('.language-switch')) return;

  const switcher = document.createElement('nav');
  switcher.className = 'language-switch';
  switcher.setAttribute('aria-label', isEnglish ? 'Language selector' : 'Selector de idioma');
  switcher.innerHTML = `
    <a href="${spanishHref}" class="${isEnglish ? '' : 'active'}" lang="es" aria-label="Spanish" title="Español">
      <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>
    </a>
    <a href="${englishHref}" class="${isEnglish ? 'active' : ''}" lang="en" aria-label="English" title="English">
      <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#012169"/><path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4"/><path d="M0 0 30 20M30 0 0 20" stroke="#c8102e" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3"/></svg>
    </a>`;
  document.body.append(switcher);

  // A page with the hamburger keeps the selector beside it. The remaining
  // headers use the far-right corner, with only the DG monogram on mobile.
  if (document.querySelector('.menu-toggle')) document.body.classList.add('has-menu-toggle');

  const style = document.createElement('style');
  style.textContent = `
    .language-switch {
      position: fixed !important;
      top: 26px !important;
      right: 28px !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      transform: none !important;
      white-space: nowrap !important;
    }
    .language-switch a {
      display: block !important;
      width: 30px !important;
      height: 20px !important;
      overflow: hidden !important;
      border-radius: 3px !important;
      text-decoration: none !important;
      opacity: .72;
      box-shadow: 0 0 0 1px rgba(255,255,255,.45);
      transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
    }
    .language-switch svg { display: block !important; width: 100% !important; height: 100% !important; }
    .language-switch a:hover { opacity: 1; transform: translateY(-1px); }
    .language-switch a.active { opacity: 1; box-shadow: 0 0 0 2px #d4a72c; }
    @media (min-width: 901px) {
      header .container > nav:not(.language-switch) {
        margin-right: clamp(92px, 8vw, 150px) !important;
        max-width: calc(100% - clamp(92px, 8vw, 150px)) !important;
      }
    }
    @media (max-width: 900px) {
      html, body { max-width: 100%; overflow-x: hidden; }
      header .logo-texto { display: none !important; }
      header .logo { gap: 0 !important; }
      .language-switch { top: 26px !important; right: 20px !important; gap: 6px !important; }
      .language-switch a { width: 27px !important; height: 18px !important; }
      body.has-menu-toggle .language-switch { right: 76px !important; }
    }
  `;
  document.head.append(style);
})();
