// Independent sidebar interaction; existing PREP features are not modified.
(() => {
  const layout = document.querySelector('.layout');
  const toggle = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  const mobile = window.matchMedia('(max-width: 750px)');
  let desktopClosed = false;
  try { desktopClosed = localStorage.getItem('prep-sidebar-closed') === 'true'; } catch (_) {}
  function update(closed) {
    layout.classList.toggle('sidebar-collapsed', closed);
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? 'Open sidebar' : 'Close sidebar');
    toggle.querySelector('.toggle-label').textContent = closed ? 'Open menu' : 'Close menu';
    toggle.querySelector('.toggle-icon').textContent = closed ? '☰' : '✕';
  }
  function sync() { update(mobile.matches ? true : desktopClosed); }
  toggle.addEventListener('click', () => {
    const closed = !layout.classList.contains('sidebar-collapsed');
    update(closed);
    if (!mobile.matches) {
      desktopClosed = closed;
      try { localStorage.setItem('prep-sidebar-closed', String(closed)); } catch (_) {}
    }
  });
  backdrop.addEventListener('click', () => update(true));
  document.querySelectorAll('#nav button').forEach(b => b.addEventListener('click', () => {
    if (mobile.matches) update(true);
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.matches && !layout.classList.contains('sidebar-collapsed')) {
      update(true); toggle.focus();
    }
  });
  mobile.addEventListener('change', sync);
  sync();
})();
