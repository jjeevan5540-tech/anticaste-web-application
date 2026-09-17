const Toast = {
  show(message, type) {
    type = type || 'info';
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.setAttribute('role', 'alert');
    t.textContent = message;
    c.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; t.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; setTimeout(function() { t.remove(); }, 300); }, 3000);
  }
};
