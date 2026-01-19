// Simple navigation JS: swaps visible sections, updates active state and aria-current, sets footer year
(function () {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page");
  const logo = document.getElementById("logo");
  const yearEl = document.getElementById("year");

  function showSection(id) {
    sections.forEach((s) => {
      if (s.id === id) {
        s.hidden = false;
        s.classList.add("active");
        s.focus();
      } else {
        s.hidden = true;
        s.classList.remove("active");
      }
    });
    links.forEach((a) => {
      if (a.dataset.target === id) {
        a.setAttribute("aria-current", "page");
        a.classList.add("active");
      } else {
        a.removeAttribute("aria-current");
        a.classList.remove("active");
      }
    });
    document.title = `Appliance Energy — ${id[0].toUpperCase() + id.slice(1)}`;
    if (history && history.pushState)
      history.pushState({ page: id }, "", "#" + id);
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const t = a.dataset.target;
      showSection(t);
    });
    // mock keyboard support, not yet supported with the current barebones site
    // a.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); a.click(); } });
  });

  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      showSection("home");
    });
  }

  // handle back/forward
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.page) showSection(e.state.page);
    else {
      const hash = location.hash.replace("#", "") || "home";
      showSection(hash);
    }
  });

  // set year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // on load, show section based on hash or default
  const start = location.hash.replace("#", "") || "home";
  showSection(start);
})();
