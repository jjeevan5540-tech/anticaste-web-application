var FileCard = {
  render: function(post) {
    return '<article class="post-card">' +
      PostCard.renderHeader(post) +
      '<div class="post-card-body"><h3 class="post-card-title">' + App.escapeHtml(post.title) + '</h3>' +
      '<div class="file-info-box">' +
      '<span class="file-info-icon">\uD83D\uDCC4</span>' +
      '<div class="file-info-details"><div class="file-info-name">' + App.escapeHtml(post.fileName || 'document') + '</div>' +
      '<div class="file-info-size">' + App.escapeHtml(post.fileSize || '') + '</div></div>' +
      (post.fileUrl ? '<a class="btn btn-outline btn-sm" href="' + App.escapeHtml(post.fileUrl) + '" target="_blank" rel="noopener" style="margin-left:auto;">Download</a>' : '<button class="btn btn-outline btn-sm" style="margin-left:auto;" disabled>No file</button>') +
      '</div>' +
      '<p>' + App.escapeHtml(post.body) + '</p></div>' +
      PostCard.renderTags(post) +
      PostCard.renderActions(post) +
      PostCard.renderCommentsSection(post) +
      '</article>';
  }
};
