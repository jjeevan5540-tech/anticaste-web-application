var HomePage = {
  currentFilter: 'all',
  render: function(container) {
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    var loggedIn = AppState.isLoggedIn();
    container.innerHTML = '<div class="hero-banner">' +
      '<div class="hero-dots"></div>' +
      '<div class="hero-shimmer"></div>' +
      '<div class="hero-orb hero-orb-1"></div>' +
      '<div class="hero-orb hero-orb-2"></div>' +
      '<div class="hero-orb hero-orb-3"></div>' +
      '<div class="hero-content">' +
      '<div class="hero-divider"></div>' +
      '<h1 class="hero-title" style="margin-bottom:var(--space-3);font-size:2rem;">Learn \u2022 Share \u2022 Stand Together</h1>' +
      '<p class="hero-subtitle">Explore posts, videos, and resources from the community fighting for equality and justice.</p>' +
      (loggedIn ? '<button class="btn btn-accent" onclick="CreateContentModal.open()" style="margin-top:var(--space-5);box-shadow:0 4px 16px rgba(245,158,11,0.35);">\u270F\uFE0F Create Content</button>' : '') +
      '</div></div>' +
      '<div class="quote-stripe quote-stripe-blue">\u201CCaste is not just a social practice; it is a system of graded inequality.\u201D \u2014 Dr. B.R. Ambedkar</div>' +
      '<div class="filter-chips" style="margin-bottom:var(--space-6);" id="home-filters">' +
      '<button class="filter-chip active" data-filter="all">All</button>' +
      '<button class="filter-chip" data-filter="post">Posts</button>' +
      '<button class="filter-chip" data-filter="video">Videos</button>' +
      '<button class="filter-chip" data-filter="file">Files</button></div>' +
      '<div id="home-feed"></div>';
    this.setupFilters();
    this.renderFeed();
  },
  setupFilters: function() {
    document.querySelectorAll('#home-filters .filter-chip').forEach(function(c) {
      c.addEventListener('click', function() {
        document.querySelectorAll('#home-filters .filter-chip').forEach(function(x) { x.classList.remove('active'); });
        c.classList.add('active');
        HomePage.currentFilter = c.dataset.filter;
        HomePage.renderFeed();
      });
    });
  },
  renderFeed: function() {
    var feed = document.getElementById('home-feed');
    if (!feed) return;
    var posts = MockData.getPublishedPosts();
    if (this.currentFilter !== 'all') posts = posts.filter(function(p) { return p.type === HomePage.currentFilter; });
    if (posts.length === 0) { feed.innerHTML = States.empty('No content yet', 'Be the first to contribute.'); return; }
    feed.innerHTML = posts.map(function(post) {
      if (post.type === 'video') return VideoCard.render(post);
      if (post.type === 'file') return FileCard.render(post);
      return PostCard.render(post);
    }).join('');
  }
};

App.toggleComments = function(postId) {
  var s = document.getElementById('comments-' + postId);
  if (!s) return;
  if (s.style.display === 'none') {
    var comments = MockData.getPostComments(postId);
    s.style.display = 'block';
    s.innerHTML = '<div style="margin-bottom:var(--space-3);">' +
      (comments.length === 0 ? '<p style="font-size:var(--text-sm);color:var(--color-text-muted);">No comments yet.</p>' : '') +
      comments.map(function(c) {
        var a = MockData.getUser(c.userId);
        var n = c.anonymous ? 'Anonymous' : (a ? a.name : 'Unknown');
        var ini = c.anonymous ? '?' : Auth.getInitials(n);
        var gradClass = c.anonymous ? '' : ' avatar-gradient-' + ((c.userId % 8) + 1);
        var bgColor = c.anonymous ? 'var(--color-text-muted)' : '';
        var bgStyle = c.anonymous ? 'background:' + bgColor : '';
        return '<div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-3);">' +
          '<div class="' + gradClass.trim() + '" style="width:28px;height:28px;border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;flex-shrink:0;' + (bgStyle ? bgStyle : '') + '">' + App.escapeHtml(ini) + '</div>' +
          '<div style="flex:1;"><div style="font-size:var(--text-sm);"><strong>' + App.escapeHtml(n) + '</strong> <span style="color:var(--color-text-muted);font-size:var(--text-xs);">\u00B7 ' + App.timeAgo(c.created) + '</span></div>' +
          '<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:2px;">' + App.escapeHtml(c.body) + '</p></div></div>';
      }).join('') + '</div>' +
      (AppState.isLoggedIn() ? '<div style="display:flex;gap:var(--space-2);">' +
      '<input class="input" type="text" placeholder="Write a comment..." id="comment-input-' + postId + '" style="flex:1;min-height:36px;font-size:var(--text-sm);">' +
      '<button class="btn btn-primary btn-sm" onclick="App.addComment(' + postId + ')">Post</button></div>' : '');
  } else { s.style.display = 'none'; s.innerHTML = ''; }
};

App.refreshComments = function(postId) {
  var s = document.getElementById('comments-' + postId);
  if (!s || s.style.display === 'none') return;
  var comments = MockData.getPostComments(postId);
  s.innerHTML = '<div style="margin-bottom:var(--space-3);">' +
    (comments.length === 0 ? '<p style="font-size:var(--text-sm);color:var(--color-text-muted);">No comments yet.</p>' : '') +
    comments.map(function(c) {
      var a = MockData.getUser(c.userId);
      var n = c.anonymous ? 'Anonymous' : (a ? a.name : 'Unknown');
      var ini = c.anonymous ? '?' : Auth.getInitials(n);
      var gradClass = c.anonymous ? '' : ' avatar-gradient-' + ((c.userId % 8) + 1);
      var bgColor = c.anonymous ? 'var(--color-text-muted)' : '';
      var bgStyle = c.anonymous ? 'background:' + bgColor : '';
      return '<div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-3);">' +
        '<div class="' + gradClass.trim() + '" style="width:28px;height:28px;border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;flex-shrink:0;' + (bgStyle ? bgStyle : '') + '">' + App.escapeHtml(ini) + '</div>' +
        '<div style="flex:1;"><div style="font-size:var(--text-sm);"><strong>' + App.escapeHtml(n) + '</strong> <span style="color:var(--color-text-muted);font-size:var(--text-xs);">\u00B7 ' + App.timeAgo(c.created) + '</span></div>' +
        '<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:2px;">' + App.escapeHtml(c.body) + '</p></div></div>';
    }).join('') + '</div>' +
    (AppState.isLoggedIn() ? '<div style="display:flex;gap:var(--space-2);">' +
    '<input class="input" type="text" placeholder="Write a comment..." id="comment-input-' + postId + '" style="flex:1;min-height:36px;font-size:var(--text-sm);">' +
    '<button class="btn btn-primary btn-sm" onclick="App.addComment(' + postId + ')">Post</button></div>' : '');
};

App.addComment = function(postId) {
  var input = document.getElementById('comment-input-' + postId);
  if (!input || !input.value.trim()) return;
  MockData.comments.push({ id: MockData.getNextId('comments'), postId: postId, userId: AppState.currentUser ? AppState.currentUser.id : 1, anonymous: false, body: input.value.trim(), created: new Date().toISOString() });
  var post = MockData.posts.find(function(p) { return p.id === postId; });
  if (post) post.comments++;
  Toast.show('Comment posted', 'success');
  App.refreshComments(postId);
};

App.toggleSave = function(postId) {
  var post = MockData.posts.find(function(p) { return p.id === postId; });
  if (!post) return;
  post.saved = !post.saved;
  Toast.show(post.saved ? 'Saved' : 'Unsaved', 'info');
  HomePage.renderFeed();
};
