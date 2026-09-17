// state.js — session, register, login, logout, admin actions, audit log

const AppState = {
  currentUser: null,

  getUsers() {
    return JSON.parse(localStorage.getItem('ac_users') || '[]');
  },

  getAuditLog() {
    return JSON.parse(localStorage.getItem('ac_audit') || '[]');
  },

  addAuditLog(action, target, details) {
    var log = this.getAuditLog();
    log.unshift({
      id: log.length + 1,
      action: action,
      target: target,
      details: details,
      admin: this.currentUser ? this.currentUser.name : 'System',
      timestamp: new Date().toISOString()
    });
    if (log.length > 100) log = log.slice(0, 100);
    localStorage.setItem('ac_audit', JSON.stringify(log));
  },

  setSession(user) {
    const s = { ...user };
    delete s.password;
    this.currentUser = s;
    localStorage.setItem('ac_session', JSON.stringify(s));
    this.notify();
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('ac_session');
    this.notify();
  },

  notify() {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('auth-changed'));
    }
  },

  async registerUser(data) {
    const users = this.getUsers();
    const email = data.email.trim().toLowerCase();

    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const { hash, salt } = await Auth.hashPassword(data.password);

    const user = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: data.name.trim(),
      email,
      mobile: data.mobile.trim(),
      type: data.type,
      photo: data.photo || null,
      password: { hash, salt },
      institution: data.institution || '',
      studentId: data.studentId || '',
      course: data.course || '',
      year: data.year || '',
      status: 'pending',
      created: new Date().toISOString().split('T')[0]
    };

    users.push(user);
    localStorage.setItem('ac_users', JSON.stringify(users));
    this.addAuditLog('registration', user.name, 'New user registered: ' + user.email);
    return { success: true, user };
  },

  async loginUser(email, password) {
    const user = this.getUsers().find(u => u.email === email.trim().toLowerCase());
    if (!user) return { success: false, error: 'No account found with this email' };

    if (user.status === 'pending') return { success: false, error: 'Your account is pending admin approval' };
    if (user.status === 'suspended') return { success: false, error: 'Account suspended' };

    const ok = await Auth.verifyPassword(password, user.password);
    if (!ok) return { success: false, error: 'Incorrect password' };

    this.setSession(user);
    return { success: true, user };
  },

  async loginAdmin(userid, password) {
    const admin = JSON.parse(localStorage.getItem('ac_admin') || 'null');
    if (!admin || admin.userid !== userid) {
      return { success: false, error: 'Invalid admin credentials' };
    }
    const ok = await Auth.verifyPassword(password, admin.password);
    if (!ok) return { success: false, error: 'Invalid admin credentials' };

    this.setSession({ id: 0, name: 'Admin User', email: admin.email || '', role: 'admin', status: 'active' });
    return { success: true };
  },

  approveUser(userId) {
    var users = this.getUsers();
    var user = users.find(function(u) { return u.id === userId; });
    if (!user) return false;
    user.status = 'active';
    localStorage.setItem('ac_users', JSON.stringify(users));
    this.addAuditLog('user_approved', user.name, 'Approved user: ' + user.email);
    return true;
  },

  rejectUser(userId) {
    var users = this.getUsers();
    var user = users.find(function(u) { return u.id === userId; });
    if (!user) return false;
    user.status = 'rejected';
    localStorage.setItem('ac_users', JSON.stringify(users));
    this.addAuditLog('user_rejected', user.name, 'Rejected user: ' + user.email);
    return true;
  },

  deleteUser(userId) {
    var users = this.getUsers();
    var user = users.find(function(u) { return u.id === userId; });
    if (!user) return false;
    var name = user.name;
    var email = user.email;
    users = users.filter(function(u) { return u.id !== userId; });
    localStorage.setItem('ac_users', JSON.stringify(users));
    this.addAuditLog('user_deleted', name, 'Deleted user: ' + email);
    return true;
  },

  updateUserStatus(userId, status) {
    var users = this.getUsers();
    var user = users.find(function(u) { return u.id === userId; });
    if (!user) return false;
    user.status = status;
    localStorage.setItem('ac_users', JSON.stringify(users));
    this.addAuditLog('user_status_changed', user.name, 'Changed status to: ' + status);
    return true;
  },

  isLoggedIn() {
    return this.currentUser !== null && this.currentUser.role !== 'admin';
  },

  isAdmin() {
    return this.currentUser !== null && this.currentUser.role === 'admin';
  },

  async seedAdmin(userid, password, email) {
    const { hash, salt } = await Auth.hashPassword(password);
    localStorage.setItem('ac_admin', JSON.stringify({ userid, password: { hash, salt }, email }));
  },

  async seedDefaults() {
    const users = [];
    const seedPassword = 'password123';
    for (const u of [
      { id: 1, name: 'Justice Seeker', email: 'justice@example.com', mobile: '9876543210', type: 'individual', institution: 'University of Delhi', studentId: 'DU-2024-001', course: 'BA Political Science', year: '3' },
      { id: 2, name: 'Equality Voice', email: 'equality@example.com', mobile: '9876543211', type: 'employee', institution: 'Tata Institute of Social Sciences', studentId: 'TISS-2023-045', course: 'MA Social Work', year: 'pg' },
      { id: 3, name: 'Dalit Scholar', email: 'dalit@example.com', mobile: '9876543212', type: 'individual', institution: 'Jawaharlal Nehru University', studentId: 'JNU-2024-112', course: 'PhD Sociology', year: 'phd' }
    ]) {
      const { hash, salt } = await Auth.hashPassword(seedPassword);
      users.push({ ...u, photo: null, password: { hash, salt }, status: 'active', created: '2024-02-20' });
    }
    localStorage.setItem('ac_users', JSON.stringify(users));
  }
};
