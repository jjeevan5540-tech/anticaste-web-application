// state.js — session, register, login, logout, admin actions, audit log (Firebase Firestore)

var AppState = {
  currentUser: null,

  async getUsers() {
    var snapshot = await db.collection('users').get();
    return snapshot.docs.map(function(doc) { return { id: doc.id, ...doc.data() }; });
  },

  async getAuditLog() {
    var snapshot = await db.collection('audit').orderBy('timestamp', 'desc').limit(100).get();
    return snapshot.docs.map(function(doc) { return { id: doc.id, ...doc.data() }; });
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
    var s = Object.assign({}, user);
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
    var users = await this.getUsers();
    var email = data.email.trim().toLowerCase();

    if (users.find(function(u) { return u.email === email; })) {
      return { success: false, error: 'Email already registered' };
    }

    var pw = await Auth.hashPassword(data.password);

    var user = {
      name: data.name.trim(),
      email: email,
      mobile: data.mobile.trim(),
      type: data.type,
      photo: data.photo || null,
      password: { hash: pw.hash, salt: pw.salt },
      institution: data.institution || '',
      studentId: data.studentId || '',
      course: data.course || '',
      year: data.year || '',
      status: 'pending',
      created: new Date().toISOString().split('T')[0]
    };

    var docRef = await db.collection('users').add(user);
    user.id = docRef.id;
    await this.addAuditLog('registration', user.name, 'New user registered: ' + user.email);
    return { success: true, user: user };
  },

  async loginUser(email, password) {
    var users = await this.getUsers();
    var user = users.find(function(u) { return u.email === email.trim().toLowerCase(); });
    if (!user) return { success: false, error: 'No account found with this email' };

    if (user.status === 'pending') return { success: false, error: 'Your account is pending admin approval' };
    if (user.status === 'suspended') return { success: false, error: 'Account suspended' };

    var ok = await Auth.verifyPassword(password, user.password);
    if (!ok) return { success: false, error: 'Incorrect password' };

    this.setSession(user);
    return { success: true, user: user };
  },

  async loginAdmin(userid, password) {
    var adminDoc = await db.collection('admin').doc('admin').get();
    if (!adminDoc.exists) {
      return { success: false, error: 'Admin not configured. Run seedAdmin first.' };
    }
    var admin = adminDoc.data();
    if (!admin || admin.userid !== userid) {
      return { success: false, error: 'Invalid admin credentials' };
    }
    var ok = await Auth.verifyPassword(password, admin.password);
    if (!ok) return { success: false, error: 'Invalid admin credentials' };

    this.setSession({ id: 'admin', name: 'Admin User', email: admin.email || '', role: 'admin', status: 'active' });
    return { success: true };
  },

  async approveUser(userId) {
    await db.collection('users').doc(userId).update({ status: 'active' });
    var userDoc = await db.collection('users').doc(userId).get();
    var user = userDoc.data();
    await this.addAuditLog('user_approved', user.name, 'Approved user: ' + user.email);
    return true;
  },

  async rejectUser(userId) {
    await db.collection('users').doc(userId).update({ status: 'rejected' });
    var userDoc = await db.collection('users').doc(userId).get();
    var user = userDoc.data();
    await this.addAuditLog('user_rejected', user.name, 'Rejected user: ' + user.email);
    return true;
  },

  async deleteUser(userId) {
    var userDoc = await db.collection('users').doc(userId).get();
    var user = userDoc.data();
    await db.collection('users').doc(userId).delete();
    await this.addAuditLog('user_deleted', user.name, 'Deleted user: ' + user.email);
    return true;
  },

  async updateUserStatus(userId, status) {
    await db.collection('users').doc(userId).update({ status: status });
    var userDoc = await db.collection('users').doc(userId).get();
    var user = userDoc.data();
    await this.addAuditLog('user_status_changed', user.name, 'Changed status to: ' + status);
    return true;
  },

  isLoggedIn: function() {
    return this.currentUser !== null && this.currentUser.role !== 'admin';
  },

  isAdmin: function() {
    return this.currentUser !== null && this.currentUser.role === 'admin';
  },

  async seedAdmin(userid, password, email) {
    var pw = await Auth.hashPassword(password);
    await db.collection('admin').doc('admin').set({ userid: userid, password: { hash: pw.hash, salt: pw.salt }, email: email });
  },

  async seedDefaults() {
    var existingUsers = await this.getUsers();
    if (existingUsers.length > 0) return;

    var seedPassword = 'password123';
    var seedUsers = [
      { name: 'Justice Seeker', email: 'justice@example.com', mobile: '9876543210', type: 'individual', institution: 'University of Delhi', studentId: 'DU-2024-001', course: 'BA Political Science', year: '3' },
      { name: 'Equality Voice', email: 'equality@example.com', mobile: '9876543211', type: 'employee', institution: 'Tata Institute of Social Sciences', studentId: 'TISS-2023-045', course: 'MA Social Work', year: 'pg' },
      { name: 'Dalit Scholar', email: 'dalit@example.com', mobile: '9876543212', type: 'individual', institution: 'Jawaharlal Nehru University', studentId: 'JNU-2024-112', course: 'PhD Sociology', year: 'phd' }
    ];
    for (var i = 0; i < seedUsers.length; i++) {
      var u = seedUsers[i];
      var pw = await Auth.hashPassword(seedPassword);
      await db.collection('users').add(Object.assign({}, u, { photo: null, password: { hash: pw.hash, salt: pw.salt }, status: 'active', created: '2024-02-20' }));
    }
  },

  async updateUser(userId, data) {
    await db.collection('users').doc(userId).update(data);
    var userDoc = await db.collection('users').doc(userId).get();
    var updated = userDoc.data();
    updated.id = userId;
    this.setSession(updated);
    return true;
  },

  getChatList: function() {
    if (!this.currentUser) return [];
    var all = JSON.parse(localStorage.getItem('ac_chats') || '{}');
    var key = 'user_' + this.currentUser.id;
    return all[key] || [];
  },

  getMessages: function(myId, otherId) {
    var all = JSON.parse(localStorage.getItem('ac_chats') || '{}');
    var chatKey = [myId, otherId].sort().join('_');
    return all['chat_' + chatKey] || [];
  },

  sendMessage: function(toUserId, body) {
    if (!this.currentUser) return;
    var all = JSON.parse(localStorage.getItem('ac_chats') || '{}');
    var myId = this.currentUser.id;
    var chatKey = [myId, toUserId].sort().join('_');
    var messagesKey = 'chat_' + chatKey;

    if (!all[messagesKey]) all[messagesKey] = [];

    all[messagesKey].push({
      from: myId,
      to: toUserId,
      body: body,
      created: new Date().toISOString()
    });

    var userKey = 'user_' + myId;
    if (!all[userKey]) all[userKey] = [];
    var existing = all[userKey].find(function(c) { return c.otherId === toUserId; });
    if (!existing) {
      all[userKey].push({ otherId: toUserId, lastMsg: { body: body, created: new Date().toISOString() }, unread: 0 });
    } else {
      existing.lastMsg = { body: body, created: new Date().toISOString() };
    }

    var otherKey = 'user_' + toUserId;
    if (!all[otherKey]) all[otherKey] = [];
    var otherExisting = all[otherKey].find(function(c) { return c.otherId === myId; });
    if (!otherExisting) {
      all[otherKey].push({ otherId: myId, lastMsg: { body: body, created: new Date().toISOString() }, unread: 1 });
    } else {
      otherExisting.lastMsg = { body: body, created: new Date().toISOString() };
      otherExisting.unread = (otherExisting.unread || 0) + 1;
    }

    localStorage.setItem('ac_chats', JSON.stringify(all));
  },

  markChatRead: function(otherId) {
    if (!this.currentUser) return;
    var all = JSON.parse(localStorage.getItem('ac_chats') || '{}');
    var key = 'user_' + this.currentUser.id;
    if (!all[key]) return;
    var chat = all[key].find(function(c) { return c.otherId === otherId; });
    if (chat) chat.unread = 0;
    localStorage.setItem('ac_chats', JSON.stringify(all));
  }
};
