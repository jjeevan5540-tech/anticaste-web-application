var ChatPage = {
  activeChat: null,
  pollTimer: null,
  render: function(container) {
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    if (!AppState.isLoggedIn()) { window.location.hash = '#/login'; return; }
    container.innerHTML = '<div class="chat-layout">' +
      '<div class="chat-sidebar" id="chat-sidebar">' +
      '<div class="chat-sidebar-header"><h2 style="font-size:var(--text-lg);">Messages</h2></div>' +
      '<div class="chat-search"><input class="input" type="search" id="chat-user-search" placeholder="Search users..." style="font-size:var(--text-sm);min-height:36px;"></div>' +
      '<div class="chat-user-list" id="chat-user-list"></div></div>' +
      '<div class="chat-main" id="chat-main">' +
      '<div class="chat-empty"><div class="empty-state-icon">\uD83D\uDCAC</div>' +
      '<h3 class="empty-state-title">Select a conversation</h3>' +
      '<p class="empty-state-text">Choose a user to start chatting.</p></div></div></div>';
    this.renderUserList();
    this.setupSearch();
  },
  getAllChatUsers: async function() {
    var myId = String(AppState.currentUser.id);
    var registered = [];
    try {
      var users = await AppState.getUsers();
      registered = users.filter(function(u) { return String(u.id) !== myId && u.status === 'active'; });
    } catch(e) { console.warn('Failed to load users:', e); }
    var mock = MockData.users.filter(function(u) { return u.role !== 'admin'; }).map(function(u) { return { id: u.id, name: u.name, photo: null, status: 'active' }; });
    var ids = {};
    registered.forEach(function(u) { ids[String(u.id)] = true; });
    return registered.concat(mock.filter(function(u) { return !ids[String(u.id)]; }));
  },
  renderUserList: async function(filter) {
    var list = document.getElementById('chat-user-list');
    if (!list) return;
    var users = await this.getAllChatUsers();
    if (filter) { var q = filter.toLowerCase(); users = users.filter(function(u) { return u.name.toLowerCase().includes(q); }); }
    var chatList = AppState.getChatList();
    var chatMap = {};
    chatList.forEach(function(c) { chatMap[c.otherId] = c; });
    if (users.length === 0) { list.innerHTML = '<div style="padding:var(--space-6);text-align:center;color:var(--color-text-muted);font-size:var(--text-sm);">No users found</div>'; return; }
    list.innerHTML = users.map(function(u) {
      var chat = chatMap[u.id];
      var lastMsg = chat && chat.lastMsg ? chat.lastMsg.body : 'No messages yet';
      var lastTime = chat && chat.lastMsg ? App.timeAgo(chat.lastMsg.created) : '';
      var unread = chat ? chat.unread : 0;
      var isActive = ChatPage.activeChat === u.id;
      return '<div class="chat-user-item' + (isActive ? ' active' : '') + '" onclick="ChatPage.openChat(\'' + u.id + '\')">' +
        '<div class="chat-user-avatar">' + (u.photo ? '<img src="' + u.photo + '">' : '<span>' + Auth.getInitials(u.name) + '</span>') + '</div>' +
        '<div class="chat-user-info"><div class="chat-user-name">' + App.escapeHtml(u.name) + '</div>' +
        '<div class="chat-user-last">' + App.escapeHtml(lastMsg.substring(0, 40)) + (lastMsg.length > 40 ? '...' : '') + '</div></div>' +
        '<div class="chat-user-meta"><span class="chat-user-time">' + lastTime + '</span>' +
        (unread > 0 ? '<span class="chat-unread-badge">' + unread + '</span>' : '') + '</div></div>';
    }).join('');
  },
  setupSearch: function() {
    var input = document.getElementById('chat-user-search');
    if (!input) return;
    var t;
    input.addEventListener('input', function() { clearTimeout(t); t = setTimeout(function() { ChatPage.renderUserList(input.value); }, 200); });
  },
  openChat: async function(userId) {
    userId = String(userId);
    this.activeChat = userId;
    AppState.markChatRead(userId);
    this.renderUserList(document.getElementById('chat-user-search') ? document.getElementById('chat-user-search').value : '');
    var users = await this.getAllChatUsers();
    var user = users.find(function(u) { return String(u.id) === userId; });
    if (!user) return;
    var main = document.getElementById('chat-main');
    if (!main) return;
    main.innerHTML = '<div class="chat-header">' +
      '<button class="btn btn-ghost btn-sm chat-back-btn" onclick="ChatPage.closeChat()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<div class="chat-header-user"><div class="chat-user-avatar chat-user-avatar-sm">' +
      (user.photo ? '<img src="' + user.photo + '">' : '<span>' + Auth.getInitials(user.name) + '</span>') +
      '</div><div><div class="chat-header-name">' + App.escapeHtml(user.name) + '</div>' +
      '<div class="chat-header-status">Online</div></div></div></div>' +
      '<div class="chat-messages" id="chat-messages"></div>' +
      '<div class="chat-input-area"><input class="input" type="text" id="chat-input" placeholder="Type a message..." autocomplete="off">' +
      '<button class="btn btn-accent" id="chat-send-btn" onclick="ChatPage.sendMessage()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>';
    this.renderMessages(userId);
    this.startPolling(userId);
    document.getElementById('chat-input').addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ChatPage.sendMessage(); } });
    document.getElementById('chat-input').focus();
  },
  closeChat: function() {
    this.activeChat = null;
    this.stopPolling();
    var main = document.getElementById('chat-main');
    if (main) main.innerHTML = '<div class="chat-empty"><div class="empty-state-icon">\uD83D\uDCAC</div><h3 class="empty-state-title">Select a conversation</h3><p class="empty-state-text">Choose a user to start chatting.</p></div>';
    this.renderUserList(document.getElementById('chat-user-search') ? document.getElementById('chat-user-search').value : '');
  },
  renderMessages: function(userId) {
    var container = document.getElementById('chat-messages');
    if (!container) return;
    var myId = AppState.currentUser.id;
    var messages = AppState.getMessages(myId, userId);
    if (messages.length === 0) { container.innerHTML = '<div style="text-align:center;padding:var(--space-8);color:var(--color-text-muted);font-size:var(--text-sm);">No messages yet. Say hello!</div>'; container.scrollTop = container.scrollHeight; return; }
    var lastDate = '';
    container.innerHTML = messages.map(function(m) {
      var isMine = m.from === myId;
      var msgDate = new Date(m.created).toLocaleDateString();
      var dateSep = '';
      if (msgDate !== lastDate) { lastDate = msgDate; dateSep = '<div class="chat-date-sep"><span>' + msgDate + '</span></div>'; }
      var time = new Date(m.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return dateSep + '<div class="chat-bubble ' + (isMine ? 'mine' : 'theirs') + '">' +
        '<div class="chat-bubble-body">' + App.escapeHtml(m.body) + '</div>' +
        '<div class="chat-bubble-time">' + time + '</div></div>';
    }).join('');
    container.scrollTop = container.scrollHeight;
  },
  sendMessage: function() {
    var input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || !this.activeChat) return;
    AppState.sendMessage(this.activeChat, input.value.trim());
    input.value = '';
    this.renderMessages(this.activeChat);
    this.renderUserList(document.getElementById('chat-user-search') ? document.getElementById('chat-user-search').value : '');
  },
  startPolling: function(userId) {
    this.stopPolling();
    this.pollTimer = setInterval(function() { if (ChatPage.activeChat === userId) ChatPage.renderMessages(userId); }, 2000);
  },
  stopPolling: function() { if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; } }
};
