var LibraryCard = {
  render: function(r) {
    return '<article class="card">' +
      '<div class="card-header"><span class="badge badge-accent">' + App.escapeHtml(r.category) + '</span>' +
      '<span style="font-size:var(--text-xs);color:var(--color-text-muted);">' + App.escapeHtml(r.readTime) + '</span></div>' +
      '<div class="card-body"><h3 style="font-size:var(--text-base);font-weight:var(--font-semibold);margin-bottom:var(--space-2);">' + App.escapeHtml(r.title) + '</h3>' +
      '<p style="font-size:var(--text-sm);color:var(--color-text-secondary);">' + App.escapeHtml(r.description) + '</p></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:var(--space-1);margin-bottom:var(--space-3);">' +
      r.tags.map(function(t) { return '<span class="tag">' + App.escapeHtml(t) + '</span>'; }).join('') + '</div>' +
      '<div class="card-footer" style="border-top:none;padding-top:0;"><button class="btn btn-ghost btn-sm">Read \u2192</button></div></article>';
  }
};
