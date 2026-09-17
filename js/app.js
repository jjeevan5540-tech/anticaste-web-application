var App = {
  init: async function() {
    try {
      await AppState.seedDefaults();
    } catch(e) { console.warn('Seed defaults failed:', e); }
    try {
      if (!localStorage.getItem('ac_admin')) {
        await AppState.seedAdmin('admin', 'admin123', 'admin@anticaste.org');
      }
    } catch(e) { console.warn('Seed admin failed:', e); }
    this.renderShell();
    Nav.render();
    this.route();
    window.addEventListener('hashchange', function() { App.route(); });
    document.addEventListener('auth-changed', function() { Nav.render(); App.route(); });
  },
  renderShell: function() {
    var app = document.getElementById('app');
    app.className = 'app-shell';
    app.innerHTML = '<aside class="app-sidebar" id="app-sidebar"></aside>' +
      '<div class="app-content">' +
      '<header class="app-header" id="app-header"></header>' +
      '<main class="app-main" id="main-content" role="main"></main>' +
      '<footer class="site-footer" id="site-footer"></footer>' +
      '</div>' +
      '<nav class="bottom-nav" id="bottom-nav" aria-label="Mobile navigation"></nav>' +
      '<div class="toast-container" id="toast-container"></div>' +
      '<div class="modal-backdrop" id="modal-backdrop"><div class="modal" id="modal-content" role="dialog" aria-modal="true"></div></div>';
  },
  route: function() {
    var hash = window.location.hash || '#/';
    var main = document.getElementById('main-content');
    var footer = document.getElementById('site-footer');
    if (footer && hash !== '#/profile' && hash !== '#/admin') footer.innerHTML = '';
    Nav.updateActive();
    if (hash === '#/library') LibraryPage.render(main);
    else if (hash === '#/posted') { if (!AppState.isLoggedIn() && !AppState.isAdmin()) { window.location.hash = '#/login'; return; } PostedPage.render(main); }
    else if (hash === '#/community') this.renderCommunity(main);
    else if (hash === '#/chat') ChatPage.render(main);
    else if (hash === '#/profile') ProfilePage.render(main);
    else if (hash === '#/login') LoginPage.render(main);
    else if (hash === '#/register') RegisterPage.render(main);
    else if (hash === '#/admin' || hash.startsWith('#/admin')) AdminDashboard.render(main);
    else if (hash === '#/' || hash === '#') {
      if (!AppState.isLoggedIn() && !AppState.isAdmin()) { window.location.hash = '#/register'; return; }
      HomePage.render(main);
    }
    else HomePage.render(main);
    window.scrollTo(0, 0);
  },
  renderCommunity: function(container) {
    container.innerHTML = '<div class="constitution-banner"><h1 style="font-size:var(--text-xl);margin-bottom:var(--space-1);">Community</h1>' +
      '<p style="opacity:0.85;font-size:var(--text-sm);">Discussions and events from the movement.</p></div>' +
      '<div class="tabs" role="tablist"><button class="tab-btn active" role="tab" data-tab="discussions">Discussions</button>' +
      '<button class="tab-btn" role="tab" data-tab="events">Events</button></div>' +
      '<div id="community-content"></div>';
    var tabs = container.querySelectorAll('.tab-btn');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        App.renderCommunityTab(tab.dataset.tab, container.querySelector('#community-content'));
      });
    });
    this.renderCommunityTab('discussions', container.querySelector('#community-content'));
  },
  renderCommunityTab: function(tab, el) {
    if (tab === 'discussions') {
      el.innerHTML = MockData.discussions.map(function(d) {
        var author = MockData.getUser(d.author);
        return '<article class="card" style="margin-bottom:var(--space-4);"><div class="card-header"><div>' +
          '<h3 style="font-size:var(--text-base);margin-bottom:var(--space-1);">' + App.escapeHtml(d.title) + '</h3>' +
          '<p style="font-size:var(--text-sm);">' + App.escapeHtml(d.description) + '</p></div></div>' +
          '<div class="card-footer" style="border-top:none;padding-top:0;">' +
          '<span style="font-size:var(--text-xs);">' + (author ? author.name : 'Unknown') + '</span>' +
          '<span style="font-size:var(--text-xs);">\u00B7</span>' +
          '<span style="font-size:var(--text-xs);">' + d.comments + ' comments</span></div></article>';
      }).join('');
    } else {
      el.innerHTML = MockData.events.map(function(e) {
        return '<article class="card" style="margin-bottom:var(--space-4);"><div class="card-header"><h3 style="font-size:var(--text-base);">' + App.escapeHtml(e.title) + '</h3></div>' +
          '<div class="card-body"><p style="font-size:var(--text-sm);margin-bottom:var(--space-2);">' + App.escapeHtml(e.description) + '</p>' +
          '<div style="display:flex;gap:var(--space-4);font-size:var(--text-xs);">' +
          '<span>' + App.escapeHtml(e.date) + '</span><span>' + App.escapeHtml(e.time) + '</span><span>' + App.escapeHtml(e.location) + '</span></div></div></article>';
      }).join('');
    }
  },
  escapeHtml: function(str) { var d = document.createElement('div'); d.textContent = str; return d.innerHTML; },
  timeAgo: function(dateStr) {
    var diff = new Date() - new Date(dateStr);
    var mins = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return new Date(dateStr).toLocaleDateString();
  }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
