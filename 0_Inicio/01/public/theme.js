document.addEventListener('DOMContentLoaded', () => {
  // --- Back to Top Logic ---
  const btnBackTop = document.getElementById('btn-back-top');
  
  if (btnBackTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnBackTop.classList.add('show');
      } else {
        btnBackTop.classList.remove('show');
      }
    });

    btnBackTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Dark Mode & Logo Swap Logic ---
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const htmlEl = document.documentElement;

  function setLogoForTheme(isDark) {
    const logos = document.querySelectorAll('img[alt="Pepitos Informa Logo"]');
    logos.forEach(logo => {
      const src = logo.getAttribute('src');
      if (src.includes('logo.png') || src.includes('logo-oscuro.png')) {
        const basePath = src.replace('logo.png', '').replace('logo-oscuro.png', '');
        logo.setAttribute('src', basePath + (isDark ? 'logo-oscuro.png' : 'logo.png'));
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-bs-theme', 'dark');
      document.body.setAttribute('data-bs-theme', 'dark');
      btnThemeToggle.textContent = '☀️';
      setLogoForTheme(true);
    } else {
      htmlEl.removeAttribute('data-bs-theme');
      document.body.removeAttribute('data-bs-theme');
      btnThemeToggle.textContent = '🌙';
      setLogoForTheme(false);
    }
  }

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('pepitos_theme') || 'light';
  applyTheme(savedTheme);

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pepitos_theme', next);
      applyTheme(next);
    });
  }
});
