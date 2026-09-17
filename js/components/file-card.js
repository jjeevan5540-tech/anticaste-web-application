const FileCard = {
  render: function(post) {
    return '<article class="post-card">' +
      PostCard.renderHeader(post) +
      '<div class="post-card-body"><h3 class="post-card-title">' + App.escapeHtml(post.title) + '</h3>' +
      '<div style="display:flex;align-items:center;gap:var(--space-3);background:var(--color-border-light);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4);margin-bottom:var(--space-3);">' +
      '<span style="font-size:24px;">\uD83D\uDCC4</span>' +
      '<div><div style="font-size:var(--text-sm);font-weight:var(--font-medium);">' + App.escapeHtml(post.fileName || 'document') + '</div>' +
      '<div style="font-size:var(--text-xs);color:var(--color-text-muted);">' + App.escapeHtml(post.fileSize || '') + '</div></div>' +
      '<button class="btn btn-outline btn-sm" style="margin-left:auto;">Download</button></div>' +
      '<p>' + App.escapeHtml(post.body) + '</p></div>' +
      PostCard.renderTags(post) +
      PostCard.renderActions(post) +
      PostCard.renderCommentsSection(post) +
      '</article>';
  }
};
