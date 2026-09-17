var PostCard = {
  renderHeader: function(post) {
    var author = MockData.getUser(post.userId);
    var name = post.anonymous ? 'Anonymous' : (author ? author.name : 'Unknown');
    var initials = post.anonymous ? '?' : Auth.getInitials(name);
    var avatarClass = 'post-card-avatar ' + (post.anonymous ? 'anonymous' : 'avatar-gradient-' + ((post.userId % 8) + 1));
    var typeLabel = post.type === 'video' ? '\uD83D\uDCF9 video' : post.type === 'file' ? '\uD83D\uDCCE file' : post.type;
    return '<div class="post-card-header">' +
      '<div class="' + avatarClass + '">' + App.escapeHtml(initials) + '</div>' +
      '<div class="post-card-meta"><div class="post-card-author">' + App.escapeHtml(name) + '</div>' +
      '<div class="post-card-time">' + App.timeAgo(post.created) + '</div></div>' +
      '<span class="post-card-type">' + typeLabel + '</span></div>';
  },
  renderTags: function(post) {
    return (post.tags && post.tags.length ? '<div class="post-card-tags">' + post.tags.map(function(t) { return '<span class="tag">' + App.escapeHtml(t) + '</span>'; }).join('') + '</div>' : '');
  },
  renderActions: function(post) {
    return '<div class="post-card-actions">' +
      '<button class="btn btn-ghost btn-sm" onclick="App.toggleComments(' + post.id + ')">\uD83D\uDCAC ' + post.comments + '</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="App.toggleSave(' + post.id + ')">' + (post.saved ? '\u2605 Saved' : '\u2606 Save') + '</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="ReportModal.open(' + post.id + ')">\u2691 Report</button>' +
      '</div>';
  },
  renderCommentsSection: function(post) {
    return '<div class="post-comments-section" id="comments-' + post.id + '" style="display:none;margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--color-border-light);"></div>';
  },
  render: function(post) {
    return '<article class="post-card" data-post-id="' + post.id + '">' +
      this.renderHeader(post) +
      '<div class="post-card-body"><h3 class="post-card-title">' + App.escapeHtml(post.title) + '</h3>' +
      '<p>' + App.escapeHtml(post.body) + '</p></div>' +
      this.renderTags(post) +
      this.renderActions(post) +
      this.renderCommentsSection(post) +
      '</article>';
  }
};
