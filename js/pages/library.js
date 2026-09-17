var LibraryPage = {
  currentCategory: 'All',
  searchQuery: '',
  render: function(container) {
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    var categories = ['All', 'History', 'Law & Rights', 'Key Figures', 'Glossary', 'Resources'];
    container.innerHTML = '<div class="constitution-banner"><h1 style="font-size:var(--text-xl);margin-bottom:var(--space-1);">Library</h1>' +
      '<p style="opacity:0.85;font-size:var(--text-sm);">A searchable knowledge archive on caste, equality, and rights.</p></div>' +
      '<div class="search-bar" style="margin-bottom:var(--space-6);"><span class="search-bar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
      '<input class="input" type="search" id="library-search" placeholder="Search resources..."></div>' +
      '<div class="filter-chips" style="margin-bottom:var(--space-6);" id="library-filters">' +
      categories.map(function(c) { return '<button class="filter-chip' + (c === 'All' ? ' active' : '') + '" data-category="' + c + '">' + c + '</button>'; }).join('') + '</div>' +
      '<div id="library-results"></div>';
    this.setupSearch();
    this.setupFilters();
    this.renderResults();
  },
  setupSearch: function() {
    var s = document.getElementById('library-search');
    var t;
    s.addEventListener('input', function() { clearTimeout(t); t = setTimeout(function() { LibraryPage.searchQuery = s.value; LibraryPage.renderResults(); }, 250); });
  },
  setupFilters: function() {
    document.querySelectorAll('#library-filters .filter-chip').forEach(function(c) {
      c.addEventListener('click', function() {
        document.querySelectorAll('#library-filters .filter-chip').forEach(function(x) { x.classList.remove('active'); });
        c.classList.add('active');
        LibraryPage.currentCategory = c.dataset.category;
        LibraryPage.renderResults();
      });
    });
  },
  renderResults: function() {
    var el = document.getElementById('library-results');
    if (!el) return;
    var results = this.searchQuery ? MockData.searchLibrary(this.searchQuery) : MockData.getLibraryByCategory(this.currentCategory);
    if (this.currentCategory !== 'All' && this.searchQuery) results = results.filter(function(r) { return r.category === LibraryPage.currentCategory; });
    if (results.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCDA</div><h3 class="empty-state-title">No resources found</h3><p class="empty-state-text">Try adjusting your search or filter.</p></div>'; return; }
    el.innerHTML = '<p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-4);">' + results.length + ' resource' + (results.length !== 1 ? 's' : '') + ' found</p>' +
      '<div style="display:flex;flex-direction:column;gap:var(--space-4);">' + results.map(function(r) { return LibraryCard.render(r); }).join('') + '</div>';
  }
};
