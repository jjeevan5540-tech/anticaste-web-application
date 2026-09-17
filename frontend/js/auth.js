// auth.js — improved client-side auth utilities
// NOTE: This is still client-side only. Anyone with devtools access can read
// localStorage and bypass these checks. For real security, move hashing and
// auth decisions to a server. This version fixes the broken checksum hash
// and removes the hardcoded admin password from source.

const Auth = {
  validateEmail(email) {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return null;
  },

  validateMobile(m) {
    if (!m) return 'Mobile number is required';
    if (!/^\d{10,15}$/.test(m.replace(/\D/g, ''))) return 'Enter a valid mobile number';
    return null;
  },

  validatePassword(p) {
    if (!p) return 'Password is required';
    if (p.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  validateName(n) {
    if (!n) return 'Name is required';
    if (n.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  },

  validateConfirmPassword(p, c) {
    if (!c) return 'Please confirm your password';
    if (p !== c) return 'Passwords do not match';
    return null;
  },

  formatMobile(m) {
    const c = m.replace(/\D/g, '');
    return c.length === 10 ? `(${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6)}` : m;
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) { reject('Please select an image file'); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject('Failed to read file');
      reader.readAsDataURL(file);
    });
  },

  getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  // ---- Real hashing via Web Crypto (SHA-256 + per-user random salt) ----
  // Still not server-grade security (hash happens in the browser and the
  // result is stored in localStorage), but it replaces the reversible
  // checksum with an actual one-way hash and per-user salting so identical
  // passwords don't produce identical stored values.

  _bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  _randomSaltHex(byteLength = 16) {
    const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
    return this._bufferToHex(bytes.buffer);
  },

  async _sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this._bufferToHex(digest);
  },

  // Returns { hash, salt } — store both alongside the user record.
  async hashPassword(password, salt = null) {
    const useSalt = salt || this._randomSaltHex();
    const hash = await this._sha256Hex(useSalt + password);
    return { hash, salt: useSalt };
  },

  // Compares a plaintext password against a stored { hash, salt } pair.
  async verifyPassword(password, stored) {
    if (!stored || !stored.hash || !stored.salt) return false;
    const { hash } = await this.hashPassword(password, stored.salt);
    return hash === stored.hash;
  },

  // Shared UI utilities
  clearFormErrors: function() {
    document.querySelectorAll('.input-error-text').forEach(function(el) { el.textContent = ''; });
    document.querySelectorAll('.input-error').forEach(function(el) { el.classList.remove('input-error'); });
  },

  showFieldError: function(fieldId, msg) {
    var errEl = document.getElementById('err-' + fieldId);
    var inputEl = document.getElementById('reg-' + fieldId) || document.getElementById(fieldId);
    if (errEl) errEl.textContent = msg;
    if (inputEl) inputEl.classList.add('input-error');
  },

  setupTypeSelector: function(containerSelector, onSelect) {
    document.querySelectorAll(containerSelector + ' .type-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll(containerSelector + ' .type-btn').forEach(function(b) {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.add('active');
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        if (onSelect) onSelect(btn.dataset.type);
      });
    });
  },

  renderAvatar: function(user, size) {
    var px = size || 36;
    var fs = Math.round(px * 0.33);
    return '<div class="post-card-avatar" style="width:' + px + 'px;height:' + px + 'px;font-size:' + fs + 'px;">' +
      (user.photo ? '<img src="' + user.photo + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">' : Auth.getInitials(user.name)) + '</div>';
  }
};
