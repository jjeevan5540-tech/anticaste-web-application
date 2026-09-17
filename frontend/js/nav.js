var Nav = {
  render: function() { this.renderSidebar(); this.renderHeader(); this.renderBottomNav(); },
  getNavItems: function() {
    var loggedIn = AppState.isLoggedIn();
    var isAdmin = AppState.isAdmin();
    var items = [];
    if (loggedIn || isAdmin) {
      items.push({ id: 'home', label: 'Home', icon: this.icons.home, href: '#/' });
      items.push({ id: 'posted', label: 'Posted', icon: this.icons.posted, href: '#/posted' });
      items.push({ id: 'library', label: 'Library', icon: this.icons.library, href: '#/library' });
      items.push({ id: 'community', label: 'Community', icon: this.icons.community, href: '#/community' });
      if (!isAdmin) {
        items.push({ id: 'chat', label: 'Chat', icon: this.icons.chat, href: '#/chat' });
        items.push({ id: 'profile', label: 'Profile', icon: this.icons.profile, href: '#/profile' });
      }
    }
    if (isAdmin) items.push({ id: 'admin', label: 'Dashboard', icon: this.icons.dashboard, href: '#/admin' });
    return items;
  },
  renderSidebar: function() {
    var sidebar = document.getElementById('app-sidebar');
    var items = this.getNavItems();
    var hash = window.location.hash || '#/';
    var loggedIn = AppState.isLoggedIn() || AppState.isAdmin();
    sidebar.innerHTML = '<div class="sidebar-inner">' +
      '<a href="#/" class="sidebar-brand"><span class="brand-icon">AC</span><span class="brand-text">Anti-Caste</span></a>' +
      '<hr class="sidebar-divider">' +
      '<nav class="sidebar-nav desktop-only" aria-label="Main navigation">' +
      items.map(function(i) {
        return '<a href="' + i.href + '" class="sidebar-nav-link' + (hash === i.href || (i.href !== '#/' && hash.startsWith(i.href)) ? ' active' : '') + '">' +
          '<span class="sidebar-nav-icon">' + i.icon + '</span><span class="sidebar-nav-label">' + i.label + '</span></a>';
      }).join('') + '</nav>' +
      '<div class="sidebar-footer desktop-only">' +
      (loggedIn ? '<button class="btn btn-ghost btn-sm" id="logout-btn-sidebar" style="width:100%;">Logout</button>' : '') +
      '</div></div>';
    var logoutBtn = document.getElementById('logout-btn-sidebar');
    if (logoutBtn) logoutBtn.addEventListener('click', function() { AppState.logout(); window.location.hash = '#/'; });
  },
  renderHeader: function() {
    var header = document.getElementById('app-header');
    var loggedIn = AppState.isLoggedIn() || AppState.isAdmin();
    header.innerHTML = '<div class="header-inner">' +
      '<div class="header-actions">' +
      (loggedIn ? '' :
      '<a href="#/register" class="btn btn-accent btn-sm">Register</a>' +
      '<a href="#/login" class="btn btn-ghost btn-sm">Login</a>') +
      '</div></div>';
  },
  renderBottomNav: function() {
    var bottomNav = document.getElementById('bottom-nav');
    var items = this.getNavItems();
    var hash = window.location.hash || '#/';
    bottomNav.innerHTML = '<div class="bottom-nav-inner">' +
      items.map(function(i) {
        return '<a href="' + i.href + '" class="bottom-nav-item' + (hash === i.href || (i.href !== '#/' && hash.startsWith(i.href)) ? ' active' : '') + '">' +
          '<span class="bottom-nav-icon">' + i.icon + '</span><span>' + i.label + '</span></a>';
      }).join('') + '</div>';
  },
  updateActive: function() {
    var hash = window.location.hash || '#/';
    document.querySelectorAll('.header-nav-link, .bottom-nav-item').forEach(function(el) {
      var href = el.getAttribute('href');
      el.classList.toggle('active', href === hash || (href !== '#/' && hash.startsWith(href)));
    });
  },
  icons: {
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    posted: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    library: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    community: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    chat: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    profile: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    dashboard: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  }
};
