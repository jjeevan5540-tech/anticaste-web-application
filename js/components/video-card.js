var VideoCard = {
  getYouTubeId(url) {
    if (!url) return null;
    var match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  },
  renderPlayer(videoUrl) {
    if (!videoUrl) {
      return '<div style="background:var(--color-border-light);border-radius:var(--radius-md);padding:var(--space-10);text-align:center;margin-bottom:var(--space-3);color:var(--color-text-muted);font-size:var(--text-sm);">🎬 No video URL provided</div>';
    }
    var ytId = this.getYouTubeId(videoUrl);
    if (ytId) {
      return '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius-md);margin-bottom:var(--space-3);background:#000;">' +
        '<iframe src="https://www.youtube.com/embed/' + ytId + '?rel=0" ' +
        'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ' +
        'allowfullscreen ' +
        'referrerpolicy="no-referrer-when-downgrade" ' +
        'title="Video player"></iframe></div>';
    }
    if (/\.(mp4|webm|ogg)$/i.test(videoUrl)) {
      return '<video controls preload="metadata" style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-3);background:#000;">' +
        '<source src="' + App.escapeHtml(videoUrl) + '">Your browser does not support video.</video>';
    }
    return '<div style="background:var(--color-border-light);border-radius:var(--radius-md);padding:var(--space-10);text-align:center;margin-bottom:var(--space-3);color:var(--color-text-muted);font-size:var(--text-sm);">' +
      '🎬 <a href="' + App.escapeHtml(videoUrl) + '" target="_blank" rel="noopener" style="color:var(--color-accent);">Watch Video</a></div>';
  },
  render: function(post) {
    return '<article class="post-card">' +
      PostCard.renderHeader(post) +
      '<div class="post-card-body"><h3 class="post-card-title">' + App.escapeHtml(post.title) + '</h3>' +
      this.renderPlayer(post.videoUrl) +
      '<p>' + App.escapeHtml(post.body) + '</p></div>' +
      PostCard.renderTags(post) +
      PostCard.renderActions(post) +
      PostCard.renderCommentsSection(post) +
      '</article>';
  }
};
