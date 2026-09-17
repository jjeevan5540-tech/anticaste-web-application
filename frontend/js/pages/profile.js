var ProfilePage = {
  render: function(container) {
    if (!AppState.isLoggedIn()) { window.location.hash = '#/login'; return; }
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '<p>Anti-Caste Platform &mdash; Fighting for equality and justice.</p><p style="margin-top:var(--space-1);">Article 17: Abolition of Untouchability &bull; Constitution of India</p>';
    var user = AppState.currentUser;
    var photoHtml = user.photo ? '<img src="' + user.photo + '" alt="' + App.escapeHtml(user.name) + '">' : '<span style="font-size:var(--text-2xl);font-weight:bold;">' + Auth.getInitials(user.name) + '</span>';
    var userPosts = MockData.posts.filter(function(p) { return p.userId === user.id && p.status === 'published'; });
    var postsHtml = userPosts.length > 0 ? userPosts.map(function(post) {
      if (post.type === 'video') return VideoCard.render(post);
      if (post.type === 'file') return FileCard.render(post);
      return PostCard.render(post);
    }).join('') : '<div class="empty-state"><div class="empty-state-icon">📝</div><h3 class="empty-state-title">No posts yet</h3><p class="empty-state-text">Start sharing your thoughts with the community.</p></div>';
    container.innerHTML = '<div class="profile-page" style="background:var(--color-surface);border-radius:var(--radius-lg);overflow:hidden;">' +
      '<div class="profile-banner" style="height:200px;background:linear-gradient(135deg, #1565c0 0%, #7b1fa2 50%, #c62828 100%);position:relative;">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%),radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 40%);"></div>' +
      '<div style="position:absolute;bottom:20px;left:24px;color:white;font-size:var(--text-xs);opacity:0.8;">Member since ' + App.escapeHtml(user.created) + '</div>' +
      '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:120px;opacity:0.1;color:white;">✊</div></div>' +
      '<div style="padding:0 var(--space-6) var(--space-6);margin-top:-50px;position:relative;">' +
      '<div class="profile-avatar" style="width:100px;height:100px;border:4px solid var(--color-surface);box-shadow:var(--shadow-lg);">' + photoHtml + '</div>' +
      '<div style="margin-top:var(--space-3);">' +
      '<h2>' + App.escapeHtml(user.name) + '</h2>' +
      '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);">' + App.escapeHtml(user.email) + '</p>' +
      '<div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);">' +
      '<span class="badge badge-accent">' + (user.type === 'employee' ? 'Employee' : 'Individual') + '</span>' +
      '<span class="badge badge-success">Active</span></div>' +
      '<div style="margin-top:var(--space-2);font-size:var(--text-sm);color:var(--color-text-muted);">' +
      App.escapeHtml(Auth.formatMobile(user.mobile)) + '</div></div>' +
      '<div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);">' +
      '<button class="btn btn-outline btn-sm" onclick="ProfilePage.openEditModal()">Edit Profile</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="AppState.logout();window.location.hash=\'#/\'">Logout</button></div></div></div>';
  },
  openEditModal: function() {
    var user = AppState.currentUser;
    var editType = user.type;
    var html = '<div class="modal-header"><h2 class="modal-title">Edit Profile</h2><button class="modal-close">\u2715</button></div>' +
      '<div class="modal-body"><form id="edit-profile-form" novalidate>' +
      '<div class="form-group" style="text-align:center;margin-bottom:var(--space-4);">' +
      '<label for="edit-photo" class="photo-upload photo-upload-sm" id="edit-photo-preview"><input type="file" id="edit-photo" accept="image/*" hidden>' +
      (user.photo ? '<img src="' + user.photo + '">' : '<span style="font-size:var(--text-xl);font-weight:bold;">' + Auth.getInitials(user.name) + '</span>') +
      '</label></div>' +
      '<div class="form-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="edit-name">Name</label>' +
      '<input class="input" type="text" id="edit-name" value="' + App.escapeHtml(user.name) + '"></div>' +
      '<div class="form-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="edit-mobile">Mobile</label>' +
      '<input class="input" type="tel" id="edit-mobile" value="' + App.escapeHtml(user.mobile) + '"></div>' +
      '<div class="form-group" style="margin-bottom:var(--space-4);"><label class="input-label">Type</label>' +
      '<div style="display:flex;gap:var(--space-2);" id="edit-type-selector">' +
      '<button type="button" class="btn btn-sm type-btn ' + (user.type === 'individual' ? 'active' : 'btn-outline') + '" data-type="individual">Individual</button>' +
      '<button type="button" class="btn btn-sm type-btn ' + (user.type === 'employee' ? 'active' : 'btn-outline') + '" data-type="employee">Employee</button>' +
      '</div></div>' +
      '</form></div>' +
      '<div class="modal-footer"><button class="btn btn-outline" onclick="Modal.close()">Cancel</button>' +
      '<button class="btn btn-primary" id="edit-profile-save">Save Changes</button></div>';
    Modal.open(html);
    var newPhoto = user.photo;
    document.getElementById('edit-photo').addEventListener('change', function(e) {
      var file = e.target.files[0]; if (!file) return;
      Auth.fileToBase64(file).then(function(b64) { newPhoto = b64; document.getElementById('edit-photo-preview').innerHTML = '<img src="' + b64 + '">'; }).catch(function(err) { Toast.show(err, 'error'); });
    });
    document.querySelectorAll('#edit-type-selector .type-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#edit-type-selector .type-btn').forEach(function(b) {
          b.classList.remove('active'); b.classList.remove('btn-primary'); b.classList.add('btn-outline');
        });
        btn.classList.add('active'); btn.classList.remove('btn-outline'); btn.classList.add('btn-primary');
        editType = btn.dataset.type;
      });
    });
    document.getElementById('edit-profile-save').addEventListener('click', function() {
      var name = document.getElementById('edit-name').value;
      var mobile = document.getElementById('edit-mobile').value;
      if (Auth.validateName(name)) { Toast.show(Auth.validateName(name), 'error'); return; }
      if (Auth.validateMobile(mobile)) { Toast.show(Auth.validateMobile(mobile), 'error'); return; }
      AppState.updateUser(user.id, { name: name, mobile: mobile, type: editType, photo: newPhoto });
      Modal.close();
      Toast.show('Profile updated', 'success');
      ProfilePage.render(document.getElementById('main-content'));
    });
  }
};
