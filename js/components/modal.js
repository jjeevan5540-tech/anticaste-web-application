var Modal = {
  open(content) {
    var bd = document.getElementById('modal-backdrop');
    var mc = document.getElementById('modal-content');
    mc.innerHTML = content;
    bd.classList.add('open');
    document.body.style.overflow = 'hidden';
    var cb = mc.querySelector('.modal-close');
    if (cb) cb.addEventListener('click', function() { Modal.close(); });
    bd.addEventListener('click', function(e) { if (e.target === bd) Modal.close(); });
    document.addEventListener('keydown', Modal._esc);
  },
  close() {
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', Modal._esc);
  },
  _esc(e) { if (e.key === 'Escape') Modal.close(); }
};

var CreateContentModal = {
  open() {
    var html = '<div class="modal-header"><h2 class="modal-title">Create Content</h2><button class="modal-close" aria-label="Close">\u2715</button></div>' +
      '<div class="modal-body">' +
      '<div class="filter-chips" style="margin-bottom:var(--space-4);" id="create-type-chips">' +
      '<button class="filter-chip active" data-type="post">Post</button>' +
      '<button class="filter-chip" data-type="video">Video</button>' +
      '<button class="filter-chip" data-type="file">File</button></div>' +
      '<form id="create-form" novalidate>' +
      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="create-title">Title</label>' +
      '<input class="input" type="text" id="create-title" placeholder="Give your content a title" required></div>' +
      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="create-body">Content</label>' +
      '<textarea class="input" id="create-body" placeholder="Write your content here..." rows="4" required></textarea></div>' +
      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="create-tags">Tags (comma separated)</label>' +
      '<input class="input" type="text" id="create-tags" placeholder="Education, Awareness"></div>' +
      '<div class="input-group" style="margin-bottom:var(--space-4);display:none;" id="create-video-url-group"><label class="input-label" for="create-video-url">Video URL</label>' +
      '<input class="input" type="url" id="create-video-url" placeholder="YouTube or direct video link (e.g. https://youtube.com/watch?v=...)">' +
      '<span style="font-size:var(--text-xs);color:var(--color-text-muted);">Supports YouTube links and direct video file URLs (.mp4, .webm)</span></div>' +
      '<div class="toggle-row" style="margin-bottom:var(--space-4);"><span class="toggle-label">Post anonymously</span>' +
      '<label class="toggle"><input type="checkbox" id="create-anonymous"><span class="toggle-track"></span></label></div>' +
      '<p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:var(--space-4);">Your submission will be reviewed before appearing publicly.</p>' +
      '</form></div>' +
      '<div class="modal-footer"><button class="btn btn-outline" onclick="Modal.close()">Cancel</button>' +
      '<button class="btn btn-primary" id="create-submit">Submit</button></div>';
    Modal.open(html);
    var selectedType = 'post';
    document.querySelectorAll('#create-type-chips .filter-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('#create-type-chips .filter-chip').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        selectedType = chip.dataset.type;
        var videoGroup = document.getElementById('create-video-url-group');
        if (videoGroup) videoGroup.style.display = selectedType === 'video' ? 'flex' : 'none';
      });
    });
    document.getElementById('create-submit').addEventListener('click', function() {
      var title = document.getElementById('create-title').value;
      var body = document.getElementById('create-body').value;
      if (!title || !body) { Toast.show('Please fill in title and content', 'error'); return; }
      var tags = document.getElementById('create-tags').value ? document.getElementById('create-tags').value.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];
      var postData = { id: MockData.getNextId('posts'), userId: AppState.currentUser ? AppState.currentUser.id : 1, anonymous: document.getElementById('create-anonymous').checked, type: selectedType, title: title, body: body, tags: tags, status: 'pending', created: new Date().toISOString(), comments: 0, saved: false };
      if (selectedType === 'video') {
        var videoUrl = document.getElementById('create-video-url').value.trim();
        if (!videoUrl) { Toast.show('Please provide a video URL', 'error'); return; }
        postData.videoUrl = videoUrl;
      }
      MockData.posts.unshift(postData);
      Modal.close();
      Toast.show('Content submitted for review', 'success');
      if (typeof HomePage !== 'undefined') HomePage.render(document.getElementById('main-content'));
    });
  }
};

var ReportModal = {
  postId: null,
  open(postId) {
    this.postId = postId;
    var html = '<div class="modal-header"><h2 class="modal-title">Report Content</h2><button class="modal-close" aria-label="Close">\u2715</button></div>' +
      '<div class="modal-body"><p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4);">Why are you reporting this?</p>' +
      '<form id="report-form" novalidate>' +
      '<div style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-4);">' +
      '<label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);cursor:pointer;"><input type="radio" name="report-reason" value="harassment" style="accent-color:var(--color-accent);"> Harassment</label>' +
      '<label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);cursor:pointer;"><input type="radio" name="report-reason" value="hate" style="accent-color:var(--color-accent);"> Hate/discrimination</label>' +
      '<label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);cursor:pointer;"><input type="radio" name="report-reason" value="spam" style="accent-color:var(--color-accent);"> Spam</label>' +
      '<label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);cursor:pointer;"><input type="radio" name="report-reason" value="misinformation" style="accent-color:var(--color-accent);"> Misinformation</label>' +
      '</div>' +
      '<div class="input-group"><label class="input-label" for="report-details">Additional details (optional)</label>' +
      '<textarea class="input" id="report-details" placeholder="Provide more context..." rows="3"></textarea></div></form></div>' +
      '<div class="modal-footer"><button class="btn btn-outline" onclick="Modal.close()">Cancel</button>' +
      '<button class="btn btn-primary" id="report-submit">Submit Report</button></div>';
    Modal.open(html);
    document.getElementById('report-submit').addEventListener('click', function() {
      var reason = document.querySelector('input[name="report-reason"]:checked');
      if (!reason) { Toast.show('Please select a reason', 'error'); return; }
      MockData.reports.push({ id: MockData.getNextId('reports'), postId: ReportModal.postId, reason: reason.value, details: document.getElementById('report-details').value, reporter: AppState.currentUser ? AppState.currentUser.id : 1, status: 'open', created: new Date().toISOString() });
      Modal.close();
      Toast.show('Report submitted. Thank you.', 'success');
    });
  }
};
