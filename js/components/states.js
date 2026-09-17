const States = {
  empty(title, text, action) {
    return '<div class="empty-state"><div class="empty-state-icon">\u{1F4DD}</div><h3 class="empty-state-title">' + title + '</h3><p class="empty-state-text">' + text + '</p>' + (action ? '<button class="btn btn-primary btn-sm" onclick="' + action.onclick + '">' + action.label + '</button>' : '') + '</div>';
  },
  error(title, text) {
    return '<div class="empty-state"><div class="empty-state-icon">\u26A0\uFE0F</div><h3 class="empty-state-title">' + title + '</h3><p class="empty-state-text">' + text + '</p></div>';
  }
};
