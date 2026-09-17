// state.js — session, register, login, logout, admin actions, audit log (Firebase Firestore)

var AppState = {
  currentUser: null,

  async getUsers() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAuditLog() {
    const snapshot = await db.collection('audit').orderBy('timestamp', 'desc').limit(100).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addAuditLog(action, target, details) {
    await db.collection('audit').add({
      action: action,
      target: target,
      details: details,
      admin: this.currentUser ? this.currentUser.name : 'System',
      timestamp: new Date().toISOString()
    });
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
    const users = await this.getUsers();
    const email = data.email.trim().toLowerCase();

    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const { hash, salt } = await Auth.hashPassword(data.password);

    const user = {
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

    await db.collection('users').add(user);
    await this.addAuditLog('registration', user.name, 'New user registered: ' + user.email);
    return { success: true, user };
  },

  async loginUser(email, password) {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) return { success: false, error: 'No account found with this email' };

    if (user.status === 'pending') return { success: false, error: 'Your account is pending admin approval' };
    if (user.status === 'suspended') return { success: false, error: 'Account suspended' };

    const ok = await Auth.verifyPassword(password, user.password);
    if (!ok) return { success: false, error: 'Incorrect password' };

    this.setSession(user);
    return { success: true, user };
  },

  async loginAdmin(userid, password) {
    const adminDoc = await db.collection('admin').doc('admin').get();
    const admin = adminDoc.data();
    if (!admin || admin.userid !== userid) {
      return { success: false, error: 'Invalid admin credentials' };
    }
    const ok = await Auth.verifyPassword(password, admin.password);
    if (!ok) return { success: false, error: 'Invalid admin credentials' };

    this.setSession({ id: 0, name: 'Admin User', email: admin.email || '', role: 'admin', status: 'active' });
    return { success: true };
  },

  async approveUser(userId) {
    await db.collection('users').doc(userId).update({ status: 'active' });
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    await this.addAuditLog('user_approved', user.name, 'Approved user: ' + user.email);
    return true;
  },

  async rejectUser(userId) {
    await db.collection('users').doc(userId).update({ status: 'rejected' });
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    await this.addAuditLog('user_rejected', user.name, 'Rejected user: ' + user.email);
    return true;
  },

  async deleteUser(userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    await db.collection('users').doc(userId).delete();
    await this.addAuditLog('user_deleted', user.name, 'Deleted user: ' + user.email);
    return true;
  },

  async updateUserStatus(userId, status) {
    await db.collection('users').doc(userId).update({ status: status });
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();
    await this.addAuditLog('user_status_changed', user.name, 'Changed status to: ' + status);
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
    await db.collection('admin').doc('admin').set({ userid, password: { hash, salt }, email });
  },

  async seedDefaults() {
    const existingUsers = await this.getUsers();
    if (existingUsers.length > 0) return;

    const seedPassword = 'password123';
    for (const u of [
      { name: 'Justice Seeker', email: 'justice@example.com', mobile: '9876543210', type: 'individual', institution: 'University of Delhi', studentId: 'DU-2024-001', course: 'BA Political Science', year: '3' },
      { name: 'Equality Voice', email: 'equality@example.com', mobile: '9876543211', type: 'employee', institution: 'Tata Institute of Social Sciences', studentId: 'TISS-2023-045', course: 'MA Social Work', year: 'pg' },
      { name: 'Dalit Scholar', email: 'dalit@example.com', mobile: '9876543212', type: 'individual', institution: 'Jawaharlal Nehru University', studentId: 'JNU-2024-112', course: 'PhD Sociology', year: 'phd' }
    ]) {
      const { hash, salt } = await Auth.hashPassword(seedPassword);
      await db.collection('users').add({ ...u, photo: null, password: { hash, salt }, status: 'active', created: '2024-02-20' });
    }
  }
};
