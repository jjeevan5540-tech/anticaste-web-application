var AdminDashboard = {
  currentTab: 'overview',
  render: function(container) {
    if (!AppState.isAdmin()) { container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDD12</div><h3 class="empty-state-title">Access Denied</h3><p class="empty-state-text">Admin privileges required.</p><a href="#/" class="btn btn-primary">Go Home</a></div>'; return; }
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '<p>Anti-Caste Platform &mdash; Fighting for equality and justice.</p><p style="margin-top:var(--space-1);">Article 17: Abolition of Untouchability &bull; Constitution of India</p>';
    container.innerHTML = '<div class="hero-banner" style="background:linear-gradient(135deg,#1a237e 0%,#283593 50%,#3949ab 100%);padding:var(--space-6);"><h1 style="margin-bottom:var(--space-1);">Admin Dashboard</h1>' +
      '<p style="opacity:0.85;font-size:var(--text-sm);">Manage users, content, and reports.</p></div>' +
      '<div class="admin-tabs" id="admin-tabs">' +
      '<button class="admin-tab active" data-tab="overview">Overview</button>' +
      '<button class="admin-tab" data-tab="pending">Pending Approvals</button>' +
      '<button class="admin-tab" data-tab="users">Users</button>' +
      '<button class="admin-tab" data-tab="posts">Posts</button>' +
      '<button class="admin-tab" data-tab="reports">Reports</button>' +
      '<button class="admin-tab" data-tab="audit">Audit Log</button></div>' +
      '<div id="admin-content"></div>';
    this.setupTabs();
    this.renderTab();
  },
  setupTabs: function() {
    document.querySelectorAll('#admin-tabs .admin-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('#admin-tabs .admin-tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        AdminDashboard.currentTab = tab.dataset.tab;
        AdminDashboard.renderTab();
      });
    });
  },
  renderTab: function() {
    var el = document.getElementById('admin-content');
    if (!el) return;
    switch(this.currentTab) {
      case 'overview': this.renderOverview(el); break;
      case 'pending': this.renderPending(el); break;
      case 'users': this.renderUsers(el); break;
      case 'posts': this.renderPosts(el); break;
      case 'reports': this.renderReports(el); break;
      case 'audit': this.renderAudit(el); break;
    }
  },
  renderOverview: function(el) {
    var users = AppState.getUsers();
    var stats = MockData.statistics;
    var pendingUsers = users.filter(function(u) { return u.status === 'pending'; }).length;
    var activeUsers = users.filter(function(u) { return u.status === 'active'; }).length;
    el.innerHTML = '<div class="grid-2" style="margin-bottom:var(--space-8);">' +
      '<div class="stat-card stat-card-blue"><div class="stat-value">' + users.length + '</div><div class="stat-label">Total Users</div></div>' +
      '<div class="stat-card stat-card-green"><div class="stat-value">' + activeUsers + '</div><div class="stat-label">Active Users</div></div>' +
      '<div class="stat-card stat-card-gold"><div class="stat-value">' + pendingUsers + '</div><div class="stat-label">Pending Approvals</div></div>' +
      '<div class="stat-card stat-card-red"><div class="stat-value">' + stats.openReports + '</div><div class="stat-label">Open Reports</div></div></div>' +
      (pendingUsers > 0 ? '<div class="card" style="margin-bottom:var(--space-6);border-left:3px solid var(--color-accent);">' +
      '<div class="card-body" style="display:flex;align-items:center;justify-content:space-between;">' +
      '<p style="font-size:var(--text-sm);"><strong>' + pendingUsers + '</strong> user(s) waiting for approval</p>' +
      '<button class="btn btn-primary btn-sm" onclick="AdminDashboard.currentTab=\'pending\';AdminDashboard.renderTab();">Review</button></div></div>' : '') +
      '<h2 style="font-size:var(--text-lg);margin-bottom:var(--space-4);">Recent Users</h2><div id="recent-users"></div>';
    this.renderRecentUsers(el.querySelector('#recent-users'));
  },
  renderRecentUsers: function(el) {
    var users = AppState.getUsers().slice(-5).reverse();
    if (users.length === 0) { el.innerHTML = '<p style="font-size:var(--text-sm);">No registered users yet.</p>'; return; }
    el.innerHTML = users.map(function(u) {
      var statusClass = u.status === 'active' ? 'badge-success' : u.status === 'pending' ? 'badge-warning' : 'badge-error';
      return '<div class="card" style="margin-bottom:var(--space-3);padding:var(--space-3) var(--space-4);"><div style="display:flex;align-items:center;gap:var(--space-3);">' +
        Auth.renderAvatar(u, 32) +
        '<div style="flex:1;min-width:0;"><div style="font-size:var(--text-sm);font-weight:var(--font-semibold);">' + App.escapeHtml(u.name) + '</div>' +
        '<div style="font-size:var(--text-xs);">' + App.escapeHtml(u.email) + ' \u00B7 ' + u.type + '</div></div>' +
        '<span class="badge ' + statusClass + '">' + u.status + '</span></div></div>';
    }).join('');
  },
  renderPending: function(el) {
    var pending = AppState.getUsers().filter(function(u) { return u.status === 'pending'; });
    if (pending.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2705</div><h3 class="empty-state-title">All Caught Up</h3><p class="empty-state-text">No pending approvals.</p></div>'; return; }
    el.innerHTML = '<p style="font-size:var(--text-sm);margin-bottom:var(--space-4);">' + pending.length + ' registration(s) awaiting approval</p>' +
      pending.map(function(u) {
        var hasStudent = u.institution || u.studentId || u.course;
        return '<div class="card" style="margin-bottom:var(--space-4);">' +
          '<div class="card-header"><div style="display:flex;align-items:center;gap:var(--space-3);">' +
          Auth.renderAvatar(u, 40) +
          '<div><div style="font-size:var(--text-sm);font-weight:var(--font-semibold);">' + App.escapeHtml(u.name) + '</div>' +
          '<div style="font-size:var(--text-xs);">' + App.escapeHtml(u.email) + '</div></div></div>' +
          '<span class="badge badge-warning">Pending</span></div>' +
          '<div class="card-body">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);font-size:var(--text-sm);">' +
          '<div><strong>Phone:</strong> ' + Auth.formatMobile(u.mobile) + '</div>' +
          '<div><strong>Type:</strong> ' + u.type + '</div>' +
          '<div><strong>Registered:</strong> ' + u.created + '</div>' +
          '</div>' +
          (hasStudent ? '<div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--color-border-light);font-size:var(--text-sm);">' +
          '<strong style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Student Details</strong>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);margin-top:var(--space-2);">' +
          (u.institution ? '<div><strong>Institution:</strong> ' + App.escapeHtml(u.institution) + '</div>' : '') +
          (u.studentId ? '<div><strong>Student ID:</strong> ' + App.escapeHtml(u.studentId) + '</div>' : '') +
          (u.course ? '<div><strong>Course:</strong> ' + App.escapeHtml(u.course) + '</div>' : '') +
          (u.year ? '<div><strong>Year:</strong> ' + u.year + '</div>' : '') +
          '</div></div>' : '') +
          '</div>' +
          '<div class="card-footer">' +
          '<button class="btn btn-outline btn-sm" onclick="AdminDashboard.approveUser(' + u.id + ')">Approve</button>' +
          '<button class="btn btn-danger btn-sm" onclick="AdminDashboard.rejectUser(' + u.id + ')">Reject</button>' +
          '</div></div>';
      }).join('');
  },
  approveUser: function(id) {
    if (!confirm('Approve this user?')) return;
    AppState.approveUser(id);
    Toast.show('User approved', 'success');
    this.renderTab();
  },
  rejectUser: function(id) {
    if (!confirm('Reject this user?')) return;
    AppState.rejectUser(id);
    Toast.show('User rejected', 'success');
    this.renderTab();
  },
  renderUsers: function(el) {
    el.innerHTML = '<div class="search-bar" style="margin-bottom:var(--space-4);"><span class="search-bar-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
      '<input class="input" type="search" id="admin-user-search" placeholder="Search users..."></div><div id="admin-users-list"></div>';
    this.renderUsersList(AppState.getUsers());
    document.getElementById('admin-user-search').addEventListener('input', function(e) {
      var q = e.target.value.toLowerCase();
      AdminDashboard.renderUsersList(AppState.getUsers().filter(function(u) { return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q); }));
    });
  },
  renderUsersList: function(users) {
    var el = document.getElementById('admin-users-list');
    if (!el) return;
    if (users.length === 0) { el.innerHTML = '<p style="font-size:var(--text-sm);">No users found.</p>'; return; }
    el.innerHTML = '<p style="font-size:var(--text-xs);margin-bottom:var(--space-4);">' + users.length + ' user' + (users.length !== 1 ? 's' : '') + '</p>' +
      users.map(function(u) {
        var statusClass = u.status === 'active' ? 'badge-success' : u.status === 'pending' ? 'badge-warning' : 'badge-error';
        return '<div class="card" style="margin-bottom:var(--space-3);padding:var(--space-3) var(--space-4);"><div style="display:flex;align-items:center;gap:var(--space-3);">' +
          Auth.renderAvatar(u, 40) +
          '<div style="flex:1;min-width:0;"><div style="font-size:var(--text-sm);font-weight:var(--font-semibold);">' + App.escapeHtml(u.name) + '</div>' +
          '<div style="font-size:var(--text-xs);">' + App.escapeHtml(u.email) + ' \u00B7 ' + Auth.formatMobile(u.mobile) + ' \u00B7 ' + u.type + '</div>' +
          '<div style="font-size:var(--text-xs);margin-top:2px;">Joined ' + u.created + '</div></div>' +
          '<div style="display:flex;flex-direction:column;gap:var(--space-1);align-items:flex-end;">' +
          '<span class="badge ' + statusClass + '">' + u.status + '</span>' +
          '<div style="display:flex;gap:var(--space-1);">' +
          '<button class="btn btn-ghost btn-sm" onclick="AdminDashboard.viewUser(' + u.id + ')">View</button>' +
          (u.status === 'pending' ? '<button class="btn btn-ghost btn-sm" onclick="AdminDashboard.approveUser(' + u.id + ')">Approve</button>' : '') +
          '<button class="btn btn-ghost btn-sm" onclick="AdminDashboard.toggleUserStatus(' + u.id + ')">' + (u.status === 'active' ? 'Suspend' : 'Activate') + '</button>' +
          '</div></div></div></div>';
      }).join('');
  },
  viewUser: function(id) {
    var users = AppState.getUsers();
    var user = users.find(function(u) { return u.id === id; });
    if (!user) return;
    var hasStudent = user.institution || user.studentId || user.course || user.year;
    var html = '<div class="modal-header"><h2 class="modal-title">User Profile</h2><button class="modal-close">\u2715</button></div>' +
      '<div class="modal-body"><div style="text-align:center;margin-bottom:var(--space-4);">' +
      Auth.renderAvatar(user, 64) +
      '<h3 style="color:#252525;">' + App.escapeHtml(user.name) + '</h3><p style="font-size:var(--text-sm);color:#5C5248;">' + App.escapeHtml(user.email) + '</p></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);font-size:var(--text-sm);">' +
      '<div style="color:#252525;"><strong>Mobile:</strong> ' + Auth.formatMobile(user.mobile) + '</div>' +
      '<div style="color:#252525;"><strong>Type:</strong> ' + user.type + '</div>' +
      '<div style="color:#252525;"><strong>Status:</strong> <span class="badge ' + (user.status === 'active' ? 'badge-success' : user.status === 'pending' ? 'badge-warning' : 'badge-error') + '">' + user.status + '</span></div>' +
      '<div style="color:#252525;"><strong>Joined:</strong> ' + user.created + '</div></div>';
    if (hasStudent) {
      html += '<div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-light);">' +
        '<strong style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.05em;color:#252525;">Student Details</strong>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);margin-top:var(--space-2);font-size:var(--text-sm);">' +
        (user.institution ? '<div style="color:#252525;"><strong>Institution:</strong> ' + App.escapeHtml(user.institution) + '</div>' : '') +
        (user.studentId ? '<div style="color:#252525;"><strong>Student ID:</strong> ' + App.escapeHtml(user.studentId) + '</div>' : '') +
        (user.course ? '<div style="color:#252525;"><strong>Course:</strong> ' + App.escapeHtml(user.course) + '</div>' : '') +
        (user.year ? '<div style="color:#252525;"><strong>Year:</strong> ' + user.year + '</div>' : '') +
        '</div></div>';
    }
    html += '</div>' +
      '<div class="modal-footer"><button class="btn btn-outline" onclick="Modal.close()">Close</button>' +
      (user.status === 'pending' ? '<button class="btn btn-primary btn-sm" onclick="Modal.close();AdminDashboard.approveUser(' + user.id + ')">Approve</button>' : '') +
      '<button class="btn btn-danger btn-sm" onclick="Modal.close();AdminDashboard.deleteUser(' + user.id + ')">Delete</button></div>';
    Modal.open(html);
  },
  toggleUserStatus: function(id) {
    var users = AppState.getUsers();
    var user = users.find(function(u) { return u.id === id; });
    if (!user) return;
    var newStatus = user.status === 'active' ? 'suspended' : 'active';
    AppState.updateUserStatus(id, newStatus);
    Toast.show('User ' + (newStatus === 'active' ? 'activated' : 'suspended'), 'success');
    this.renderTab();
  },
  deleteUser: function(id) {
    if (!confirm('Delete this user?')) return;
    AppState.deleteUser(id);
    Toast.show('User deleted', 'success');
    this.renderTab();
  },
  renderPosts: function(el) {
    el.innerHTML = '<div class="filter-chips" style="margin-bottom:var(--space-4);" id="admin-post-filters">' +
      '<button class="filter-chip active" data-filter="all">All</button>' +
      '<button class="filter-chip" data-filter="published">Published</button>' +
      '<button class="filter-chip" data-filter="pending">Pending</button>' +
      '<button class="filter-chip" data-filter="rejected">Rejected</button></div><div id="admin-posts-list"></div>';
    this.renderPostsList('all');
    document.querySelectorAll('#admin-post-filters .filter-chip').forEach(function(c) {
      c.addEventListener('click', function() {
        document.querySelectorAll('#admin-post-filters .filter-chip').forEach(function(x) { x.classList.remove('active'); });
        c.classList.add('active');
        AdminDashboard.renderPostsList(c.dataset.filter);
      });
    });
  },
  renderPostsList: function(status) {
    var el = document.getElementById('admin-posts-list');
    if (!el) return;
    var posts = status === 'all' ? MockData.posts : MockData.posts.filter(function(p) { return p.status === status; });
    if (posts.length === 0) { el.innerHTML = '<p style="font-size:var(--text-sm);">No posts found.</p>'; return; }
    el.innerHTML = posts.map(function(p) {
      var author = MockData.getUser(p.userId);
      var badge = p.status === 'published' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-error';
      return '<div class="card" style="margin-bottom:var(--space-3);"><div class="card-header"><div><span class="badge ' + badge + '">' + p.status + '</span> <span class="tag" style="margin-left:var(--space-2);">' + p.type + '</span></div>' +
        '<span style="font-size:var(--text-xs);">' + App.timeAgo(p.created) + '</span></div>' +
        '<div class="card-body"><h3 style="font-size:var(--text-base);margin-bottom:var(--space-1);">' + App.escapeHtml(p.title) + '</h3>' +
        '<p style="font-size:var(--text-sm);">' + (author ? author.name : 'Unknown') + (p.anonymous ? ' (Anonymous)' : '') + '</p></div>' +
        '<div class="card-footer">' +
        (p.status === 'pending' ? '<button class="btn btn-outline btn-sm" onclick="AdminDashboard.moderatePost(' + p.id + ',\'published\')">Approve</button><button class="btn btn-danger btn-sm" onclick="AdminDashboard.moderatePost(' + p.id + ',\'rejected\')">Reject</button>' : '') +
        '<button class="btn btn-ghost btn-sm" onclick="AdminDashboard.deletePost(' + p.id + ')">Delete</button></div></div>';
    }).join('');
  },
  moderatePost: function(id, status) {
    var post = MockData.posts.find(function(p) { return p.id === id; });
    if (post) { post.status = status; Toast.show('Post ' + (status === 'published' ? 'approved' : 'rejected'), 'success'); this.renderTab(); }
  },
  deletePost: function(id) {
    if (!confirm('Delete this post?')) return;
    MockData.posts = MockData.posts.filter(function(p) { return p.id !== id; });
    Toast.show('Post deleted', 'success');
    this.renderTab();
  },
  renderReports: function(el) {
    var open = MockData.getOpenReports();
    if (open.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2705</div><h3 class="empty-state-title">All Clear</h3><p class="empty-state-text">No open reports.</p></div>'; return; }
    el.innerHTML = open.map(function(r) {
      var post = MockData.posts.find(function(p) { return p.id === r.postId; });
      return '<div class="card" style="margin-bottom:var(--space-3);"><div class="card-header"><span class="badge badge-error">Report</span>' +
        '<span style="font-size:var(--text-xs);">' + App.timeAgo(r.created) + '</span></div>' +
        '<div class="card-body"><p style="font-size:var(--text-sm);"><strong>Reason:</strong> ' + App.escapeHtml(r.reason) + '</p>' +
        '<p style="font-size:var(--text-sm);">' + App.escapeHtml(r.details) + '</p>' +
        (post ? '<p style="font-size:var(--text-xs);margin-top:var(--space-2);">Post: "' + App.escapeHtml(post.title) + '"</p>' : '') + '</div>' +
        '<div class="card-footer"><button class="btn btn-outline btn-sm" onclick="AdminDashboard.resolveReport(' + r.id + ',\'resolved\')">Resolve</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="AdminDashboard.resolveReport(' + r.id + ',\'dismissed\')">Dismiss</button></div></div>';
    }).join('');
  },
  resolveReport: function(id, status) {
    var report = MockData.reports.find(function(r) { return r.id === id; });
    if (report) { report.status = status; Toast.show('Report ' + status, 'success'); this.renderTab(); }
  },
  renderAudit: function(el) {
    var logs = AppState.getAuditLog();
    if (logs.length === 0) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCDD</div><h3 class="empty-state-title">No Activity Yet</h3><p class="empty-state-text">Admin actions will appear here.</p></div>'; return; }
    el.innerHTML = '<p style="font-size:var(--text-xs);margin-bottom:var(--space-4);">Showing last ' + logs.length + ' actions</p>' +
      logs.map(function(log) {
        var icon = log.action === 'user_approved' ? '\u2705' : log.action === 'user_rejected' ? '\u274C' : log.action === 'user_deleted' ? '\uD83D\uDDD1' : log.action === 'registration' ? '\uD83D\uDC64' : '\uD83D\uDD27';
        var actionLabel = log.action.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        return '<div class="card" style="margin-bottom:var(--space-2);padding:var(--space-3) var(--space-4);">' +
          '<div style="display:flex;align-items:center;gap:var(--space-3);">' +
          '<span style="font-size:var(--text-lg);">' + icon + '</span>' +
          '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:var(--text-sm);font-weight:var(--font-semibold);">' + actionLabel + '</div>' +
          '<div style="font-size:var(--text-xs);">' + App.escapeHtml(log.details) + '</div></div>' +
          '<div style="text-align:right;flex-shrink:0;">' +
          '<div style="font-size:var(--text-xs);">' + App.escapeHtml(log.admin) + '</div>' +
          '<div style="font-size:var(--text-xs);">' + new Date(log.timestamp).toLocaleString() + '</div></div>' +
          '</div></div>';
      }).join('');
  }
};
