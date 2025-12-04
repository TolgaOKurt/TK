window.navigation = (() => {
  const pages = [
    { name: "anasayfa", textKey: "nav_anasayfa", file: "html/anasayfa.html", icon: "images/tk_16x16.png" },
    {
      name: "matematik-ve-kod",
      textKey: "Matematik_ve_Kodlama",
      icon: "images/matevekod_16x16.png",
      children: [
        { name: "RMBiVD", textKey: "nav_RMBiVD", file: "html/RMBiVD.html", icon: "images/mavitop_16x16.png" },
        { name: "PSPp", text: "WIP PSP+", file: "html/Pspp.html", icon: "images/pulumsu_16x16.png" },
        { name: "Agac", text: "Ağaç", file: "html/Agac.html", icon: "images/agacimsi_16x16.png" },
        { name: "USD", text: "USKD", file: "html/UcgenSayDong.html", icon: "images/cizgiler_16x16.png" },
        { name: "SSMT", text: "WIP SSMT", file: "html/SSMT.html", icon: "images/tank_16x16.png" },
        { name: "MH", text: "WIP MontyHall", file: "html/MontyHall.html", icon: "images/kapı_16x16.png" },
        { name: "FT", text: "WIP FormulTahmin", file: "html/FormTahm.html", icon: "images/253_16x16.png" },
        {
          name: "algoritmalar",
          textKey: "nav_algoritmalar",
          icon: "images/algoritmalar_16x16.png",
          children: [
            { name: "PSPp", text: "WIP PSP+", file: "html/Pspp.html", icon: "images/pulumsu_16x16.png" }
          ]
        }
      ]
    },
    {
      name: "gundelik-hayat",
      textKey: "nav_gundelik_hayat",
      icon: "images/gundelik_16x16.png",
      children: [
        { name: "meyve_suyu", textKey: "nav_meyve_suyu", file: "html/Gündelik Hayat/meyve_suyu.html", icon: "images/meyvesuyu_16x16.png" }
      ]
    },
    { name: "iletisim", textKey: "nav_iletisim", file: "html/iletisim.html", icon: "images/hi_16x16.png" }
  ];

  const links = [];

  function buildNav(pages, container) {
    pages.forEach(p => {
      if (p.children) {
        const folder = document.createElement('div');
        folder.className = 'nav-folder';

        const toggle = document.createElement('button');
        toggle.className = 'nav-folder-toggle link';
        toggle.setAttribute('aria-expanded', 'false');

        const toggleText = document.createElement('span');
        toggle.appendChild(toggleText);

        if (p.icon) {
          const img = document.createElement('img');
          img.src = p.icon;
          img.alt = "";
          img.loading = 'lazy';
          img.decoding = 'async';
          img.className = 'nav-icon';
          toggle.appendChild(img);
        }

        const content = document.createElement('div');
        content.className = 'nav-folder-content';
        content.hidden = true;

        toggle.addEventListener('click', () => {
          const isExpanded = content.hidden = !content.hidden;
          toggle.setAttribute('aria-expanded', !isExpanded);
        });

        folder.appendChild(toggle);
        folder.appendChild(content);
        container.appendChild(folder);
        links.push({ el: toggle, page: p, isFolder: true, contentEl: content });
        buildNav(p.children, content);
      } else {
        const a = document.createElement("a");
        a.href = `#${p.name}`;
        a.className = "link";
        if (p.icon) {
          const img = document.createElement('img');
          img.src = p.icon;
          img.alt = "";
          img.loading = 'lazy';
          img.decoding = 'async';
          img.className = 'nav-icon';
          a.appendChild(img);
        }
        a.addEventListener('click', e => { e.preventDefault(); location.hash = a.getAttribute('href'); });
        container.appendChild(a);
        links.push({ el: a, page: p });
      }
    });
  }

  function setActive(name) {
    links.forEach(({ el, page, isFolder, contentEl }) => {
      if (isFolder) {
        const isChildActive = page.children.some(child => child.name === name);
        if (isChildActive) {
          contentEl.hidden = false;
          el.setAttribute('aria-expanded', 'true');
        }
        el.classList.remove('active');
      } else {
        const isActive = page.name === name;
        el.classList.toggle('active', isActive);
        if (isActive) {
          el.setAttribute('aria-current', 'page');
        } else {
          el.removeAttribute('aria-current');
        }
      }
    });
  }

  function getPageInfo(pageName) {
    function find(p, name) {
      for (const item of p) {
        if (item.name === name) return item;
        if (item.children) {
          const found = find(item.children, name);
          if (found) return found;
        }
      }
      return null;
    }
    return find(pages, pageName);
  }

  return {
    pages,
    links,
    buildNav,
    setActive,
    getPageInfo
  };
})();