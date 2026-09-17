var PostedPage = {
  currentFilter: 'all',
  searchQuery: '',
  render: function(container) {
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    container.innerHTML = '<div class="hero-banner" style="padding:var(--space-6);"><h1 style="margin-bottom:var(--space-1);">Posted</h1>' +
      '<p style="opacity:0.85;font-size:var(--text-sm);">Browse all published content from the community.</p></div>' +
      '<div class="search-bar" style="margin-bottom:var(--space-4);"><span class="search-bar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
      '<input class="input" type="search" id="posted-search" placeholder="Search posts..."></div>' +
      '<div class="filter-chips" style="margin-bottom:var(--space-6);" id="posted-filters">' +
      '<button class="filter-chip active" data-filter="all">All</button>' +
      '<button class="filter-chip" data-filter="post">Posts</button>' +
      '<button class="filter-chip" data-filter="video">Videos</button>' +
      '<button class="filter-chip" data-filter="file">Files</button></div>' +
      '<div id="posted-feed"></div>';
    this.setupSearch();
    this.setupFilters();
    this.renderFeed();
  },
  setupSearch: function() {
    var s = document.getElementById('posted-search');
    var t;
    s.addEventListener('input', function() { clearTimeout(t); t = setTimeout(function() { PostedPage.searchQuery = s.value; PostedPage.renderFeed(); }, 250); });
  },
  setupFilters: function() {
    document.querySelectorAll('#posted-filters .filter-chip').forEach(function(c) {
      c.addEventListener('click', function() {
        document.querySelectorAll('#posted-filters .filter-chip').forEach(function(x) { x.classList.remove('active'); });
        c.classList.add('active');
        PostedPage.currentFilter = c.dataset.filter;
        PostedPage.renderFeed();
      });
    });
  },
  renderFeed: function() {
    var feed = document.getElementById('posted-feed');
    if (!feed) return;
    var posts = MockData.getPublishedPosts();
    if (this.currentFilter !== 'all') posts = posts.filter(function(p) { return p.type === PostedPage.currentFilter; });
    if (this.searchQuery) {
      var q = this.searchQuery.toLowerCase();
      posts = posts.filter(function(p) { return p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) || (p.tags && p.tags.some(function(t) { return t.toLowerCase().includes(q); })); });
    }
    if (posts.length === 0) { feed.innerHTML = States.empty('No posts found', 'Try a different search term.'); return; }
    feed.innerHTML = '<p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-4);">' + posts.length + ' post' + (posts.length !== 1 ? 's' : '') + ' found</p>' +
      posts.map(function(post) {
        if (post.type === 'video') return VideoCard.render(post);
        if (post.type === 'file') return FileCard.render(post);
        return PostCard.render(post);
      }).join('');
  }
};
