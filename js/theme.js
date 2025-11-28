window.theme = (() => {
  // Depends on window.language.applyTranslations
  const { applyTranslations } = window.language;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function initThemeToggle() {
    const header = document.querySelector('header');
    if (!header) return;

    // Existing Dark/Light Mode Toggle
    let btn = document.getElementById('theme-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.type = 'button';
      btn.className = 'theme-toggle';
      btn.textContent = '🌓'; // Simple icon for now
      header.appendChild(btn);
    }

    // New Style Switcher Toggle
    let styleBtn = document.getElementById('style-switcher-btn');
    if (!styleBtn) {
      styleBtn = document.createElement('button');
      styleBtn.id = 'style-switcher-btn';
      styleBtn.type = 'button';
      styleBtn.className = 'theme-toggle'; // Reuse class for styling
      styleBtn.style.marginLeft = '10px';
      styleBtn.textContent = '🎨';
      header.appendChild(styleBtn);
    }

    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // Initialize Style Switcher
    initStyleSwitcher(styleBtn);

    btn.addEventListener('click', () => {
      const next = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
      applyTranslations();
    });
  }

  function initStyleSwitcher(btn) {
    const themeLink = document.getElementById('theme-stylesheet');
    if (!themeLink) return;

    const themes = {
      default: { name: 'Default', url: 'css/themes/default/main.css' }
    };

    // Create Dropdown Container
    const dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown';

    // Populate Dropdown
    Object.keys(themes).forEach(key => {
      const item = document.createElement('button');
      item.className = 'theme-dropdown-item';
      item.textContent = themes[key].name;
      item.dataset.value = key;

      item.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing immediately
        applyStyle(key);
        dropdown.classList.remove('show');
      });

      dropdown.appendChild(item);
    });

    // Append dropdown to button
    btn.appendChild(dropdown);

    // Load saved style
    const savedStyle = localStorage.getItem('preferred-style') || 'default';
    applyStyle(savedStyle);

    function applyStyle(styleKey) {
      if (themes[styleKey]) {
        themeLink.href = themes[styleKey].url;
        localStorage.setItem('preferred-style', styleKey);

        // Update active state in menu
        Array.from(dropdown.children).forEach(child => {
          if (child.dataset.value === styleKey) {
            child.classList.add('active');
          } else {
            child.classList.remove('active');
          }
        });

        // Force re-application of translations to fix UI glitches
        if (window.language && window.language.applyTranslations) {
          window.language.applyTranslations();
        }
      }
    }

    // Toggle Dropdown
    btn.addEventListener('click', (e) => {
      // If clicking the button itself (not the dropdown items)
      if (e.target === btn) {
        dropdown.classList.toggle('show');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  return {
    initThemeToggle,
  };
})();
