var LoginPage = {
  activeTab: 'user',

  render: function (container) {
    if (AppState.isLoggedIn() || AppState.isAdmin()) {
      window.location.hash = '#/';
      return;
    }
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    this.activeTab = 'user';

    container.innerHTML =
      '<div class="auth-container">' +
        '<div class="auth-card">' +

          '<div style="text-align:center;margin-bottom:var(--space-6);">' +
            '<div class="brand-icon" style="width:48px;height:48px;font-size:var(--text-lg);margin:0 auto var(--space-3);">AC</div>' +
            '<h1 style="font-size:var(--text-2xl);margin-bottom:var(--space-1);">Welcome Back</h1>' +
            '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);">Sign in to your account</p>' +
          '</div>' +

          '<div class="tabs" id="login-tabs" role="tablist" style="margin-bottom:var(--space-5);">' +
            '<button type="button" class="tab-btn active" role="tab" aria-selected="true" data-tab="user">User Login</button>' +
            '<button type="button" class="tab-btn" role="tab" aria-selected="false" data-tab="admin">Admin Login</button>' +
          '</div>' +

          '<form id="user-login-form" novalidate>' +
            '<div class="input-group" style="margin-bottom:var(--space-4);">' +
              '<label class="input-label" for="user-email">Email</label>' +
              '<input class="input" type="email" id="user-email" placeholder="you@example.com" autocomplete="email" required>' +
              '<span class="input-error-text" id="err-user-email"></span>' +
            '</div>' +
            '<div class="input-group" style="margin-bottom:var(--space-6);">' +
              '<label class="input-label" for="user-password">Password</label>' +
              '<input class="input" type="password" id="user-password" placeholder="Enter password" autocomplete="current-password" required>' +
              '<span class="input-error-text" id="err-user-password"></span>' +
            '</div>' +
            '<button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-bottom:var(--space-4);">Login</button>' +
            '<p style="text-align:center;font-size:var(--text-sm);color:var(--color-text-secondary);">Don\'t have an account? <a href="#/register">Create one</a></p>' +
          '</form>' +

          '<form id="admin-login-form" novalidate style="display:none;">' +
            '<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4);">Admin access only</p>' +
            '<div class="input-group" style="margin-bottom:var(--space-4);">' +
              '<label class="input-label" for="admin-userid">User ID</label>' +
              '<input class="input" type="text" id="admin-userid" placeholder="Enter admin user ID" autocomplete="username" required>' +
              '<span class="input-error-text" id="err-admin-userid"></span>' +
            '</div>' +
            '<div class="input-group" style="margin-bottom:var(--space-6);">' +
              '<label class="input-label" for="admin-password">Password</label>' +
              '<input class="input" type="password" id="admin-password" placeholder="Enter admin password" autocomplete="current-password" required>' +
              '<span class="input-error-text" id="err-admin-password"></span>' +
            '</div>' +
            '<button type="submit" class="btn btn-accent btn-lg" style="width:100%;">Admin Login</button>' +
          '</form>' +

          '<div style="margin-top:var(--space-6);padding:var(--space-4);background:var(--color-border-light);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--color-text-muted);">' +
            '<p style="font-weight:var(--font-semibold);margin-bottom:var(--space-2);">Demo Credentials:</p>' +
            '<p>User: justice@example.com / password123</p>' +
            '<p>Admin: admin / admin123</p>' +
            '<p style="margin-top:var(--space-2);font-style:italic;">New users require admin approval after registration.</p>' +
          '</div>' +

        '</div>' +
      '</div>';

    this.setupTabs();
    this.setupForms();
  },

  setupTabs: function () {
    var tabs = document.querySelectorAll('#login-tabs .tab-btn');
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var tab = btn.dataset.tab;
        LoginPage.activeTab = tab;
        var userForm = document.getElementById('user-login-form');
        var adminForm = document.getElementById('admin-login-form');

        if (tab === 'admin') {
          userForm.style.display = 'none';
          adminForm.style.display = 'block';
          document.getElementById('admin-userid').focus();
        } else {
          adminForm.style.display = 'none';
          userForm.style.display = 'block';
          document.getElementById('user-email').focus();
        }
        LoginPage.clearErrors();
      });
    });
  },

  setupForms: function () {
    document.getElementById('user-login-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      LoginPage.clearErrors();

      var email = document.getElementById('user-email').value;
      var password = document.getElementById('user-password').value;
      var hasError = false;

      var emailErr = Auth.validateEmail(email);
      if (emailErr) { LoginPage.showError('user-email', emailErr); hasError = true; }
      if (!password) { LoginPage.showError('user-password', 'Password required'); hasError = true; }
      if (hasError) return;

      var result = await AppState.loginUser(email, password);
      if (!result.success) { Toast.show(result.error, 'error'); return; }

      Toast.show('Welcome back, ' + result.user.name + '!', 'success');
      window.location.hash = '#/';
    });

    document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      LoginPage.clearErrors();

      var userid = document.getElementById('admin-userid').value;
      var password = document.getElementById('admin-password').value;
      var hasError = false;

      if (!userid) { LoginPage.showError('admin-userid', 'Required'); hasError = true; }
      if (!password) { LoginPage.showError('admin-password', 'Required'); hasError = true; }
      if (hasError) return;

      var result = await AppState.loginAdmin(userid, password);
      if (!result.success) { Toast.show(result.error, 'error'); return; }

      Toast.show('Welcome, Admin!', 'success');
      window.location.hash = '#/admin';
    });
  },

  showError: function (fieldId, msg) {
    Auth.showFieldError(fieldId, msg);
  },

  clearErrors: function () {
    Auth.clearFormErrors();
  }
};
