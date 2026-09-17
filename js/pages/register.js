var RegisterPage = {
  currentStep: 1,
  totalSteps: 4,
  photoData: null,
  selectedType: 'individual',
  formData: {},

  render: function(container) {
    if (AppState.isLoggedIn() || AppState.isAdmin()) { window.location.hash = '#/'; return; }
    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = '';
    this.currentStep = 1;
    this.photoData = null;
    this.selectedType = 'individual';
    this.formData = {};
    this.renderStep(container);
  },

  renderStep: function(container) {
    var self = this;
    var step = this.currentStep;
    var progress = (step / this.totalSteps) * 100;
    var stepLabels = ['Photo', 'Personal Info', 'Student Details', 'Account'];

    var stepDots = stepLabels.map(function(label, i) {
      var cls = i + 1 < step ? 'step-dot completed' : (i + 1 === step ? 'step-dot active' : 'step-dot');
      return '<div class="' + cls + '">' +
        (i + 1 < step ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' :
        (i + 1).toString()) + '</div>';
    }).join('<div class="step-connector' + (step > 1 ? ' filled' : '') + '"></div>');

    container.innerHTML = '<div class="auth-container"><div class="auth-card">' +
      '<div style="text-align:center;margin-bottom:var(--space-5);">' +
      '<div class="brand-icon" style="width:48px;height:48px;font-size:var(--text-lg);margin:0 auto var(--space-3);">AC</div>' +
      '<h1 style="font-size:var(--text-2xl);margin-bottom:var(--space-1);">Create Account</h1>' +
      '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);">Step ' + step + ' of ' + this.totalSteps + ': ' + stepLabels[step - 1] + '</p></div>' +

      '<div class="step-progress">' +
      '<div class="step-progress-bar"><div class="step-progress-fill" style="width:' + progress + '%"></div></div>' +
      '<div class="step-dots">' + stepDots + '</div></div>' +

      '<div id="step-content"></div>' +

      '<p style="text-align:center;font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:var(--space-5);">Already have an account? <a href="#/login">Login</a></p>' +
      '</div></div>';

    var stepEl = container.querySelector('#step-content');

    if (step === 1) this.renderStep1(stepEl);
    else if (step === 2) this.renderStep2(stepEl);
    else if (step === 3) this.renderStep3(stepEl);
    else if (step === 4) this.renderStep4(stepEl);
  },

  renderStep1: function(el) {
    el.innerHTML =
      '<div style="text-align:center;margin-bottom:var(--space-5);">' +
      '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-4);">Add a profile photo so others can recognize you.</p>' +
      '<label for="reg-photo" class="photo-upload" id="photo-preview">' +
      '<input type="file" id="reg-photo" accept="image/*" hidden>' +
      '<div class="photo-upload-placeholder" id="photo-placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><span style="display:block;margin-top:var(--space-2);font-size:var(--text-sm);">Click to upload photo</span><span style="display:block;font-size:var(--text-xs);color:var(--color-text-muted);margin-top:2px;">JPG, PNG up to 2MB</span></div>' +
      '<div class="photo-upload-preview" id="photo-img-preview" style="display:none;"></div></label></div>' +
      '<div style="display:flex;gap:var(--space-3);">' +
      '<button type="button" class="btn btn-outline btn-lg" style="flex:1;" onclick="RegisterPage.skipPhoto()">Skip</button>' +
      '<button type="button" class="btn btn-primary btn-lg" style="flex:2;" onclick="RegisterPage.nextStep()">Continue</button></div>';

    this.setupPhoto();
  },

  setupPhoto: function() {
    var input = document.getElementById('reg-photo');
    document.getElementById('photo-preview').addEventListener('click', function(e) {
      if (e.target.closest('.photo-upload-preview img')) return;
      input.click();
    });
    input.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { Toast.show('Photo must be under 2MB', 'error'); return; }
      Auth.fileToBase64(file).then(function(b64) {
        RegisterPage.photoData = b64;
        document.getElementById('photo-placeholder').style.display = 'none';
        var preview = document.getElementById('photo-img-preview');
        preview.style.display = 'flex';
        preview.innerHTML = '<img src="' + b64 + '" alt="Preview">';
      }).catch(function(err) { Toast.show(err, 'error'); });
    });
  },

  skipPhoto: function() {
    this.photoData = null;
    this.nextStep();
  },

  renderStep2: function(el) {
    var d = this.formData;
    el.innerHTML =
      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-name">Full Name *</label>' +
      '<input class="input" type="text" id="reg-name" placeholder="Enter your full name" value="' + App.escapeHtml(d.name || '') + '" required autocomplete="name">' +
      '<span class="input-error-text" id="err-name"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-mobile">Phone Number *</label>' +
      '<input class="input" type="tel" id="reg-mobile" placeholder="10-digit mobile number" value="' + App.escapeHtml(d.mobile || '') + '" required autocomplete="tel">' +
      '<span class="input-error-text" id="err-mobile"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-email">Email *</label>' +
      '<input class="input" type="email" id="reg-email" placeholder="you@example.com" value="' + App.escapeHtml(d.email || '') + '" required autocomplete="email">' +
      '<span class="input-error-text" id="err-email"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-5);"><label class="input-label">I am a: *</label>' +
      '<div style="display:flex;gap:var(--space-2);" id="type-selector">' +
      '<button type="button" class="btn btn-sm type-btn ' + (this.selectedType === 'individual' ? 'active btn-primary' : 'btn-outline') + '" data-type="individual">Individual</button>' +
      '<button type="button" class="btn btn-sm type-btn ' + (this.selectedType === 'employee' ? 'active btn-primary' : 'btn-outline') + '" data-type="employee">Employee</button>' +
      '</div></div>' +

      '<div style="display:flex;gap:var(--space-3);">' +
      '<button type="button" class="btn btn-outline btn-lg" style="flex:1;" onclick="RegisterPage.prevStep()">Back</button>' +
      '<button type="button" class="btn btn-primary btn-lg" style="flex:2;" onclick="RegisterPage.validateStep2()">Continue</button></div>';

    this.setupTypeSelector();
  },

  setupTypeSelector: function() {
    Auth.setupTypeSelector('#type-selector', function(type) {
      RegisterPage.selectedType = type;
    });
  },

  validateStep2: function() {
    this.clearErrors();
    var name = document.getElementById('reg-name').value;
    var mobile = document.getElementById('reg-mobile').value;
    var email = document.getElementById('reg-email').value;
    var err = false;
    var e1 = Auth.validateName(name); if (e1) { this.showError('name', e1); err = true; }
    var e2 = Auth.validateMobile(mobile); if (e2) { this.showError('mobile', e2); err = true; }
    var e3 = Auth.validateEmail(email); if (e3) { this.showError('email', e3); err = true; }
    if (err) return;
    this.formData.name = name.trim();
    this.formData.mobile = mobile.trim();
    this.formData.email = email.trim().toLowerCase();
    this.formData.type = this.selectedType;
    this.nextStep();
  },

  renderStep3: function(el) {
    var d = this.formData;
    el.innerHTML =
      '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-4);">Student details are optional but help us personalize your experience.</p>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-institution">Institution / University</label>' +
      '<input class="input" type="text" id="reg-institution" placeholder="e.g. University of Mumbai" value="' + App.escapeHtml(d.institution || '') + '">' +
      '<span class="input-error-text" id="err-institution"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-student-id">Student ID / Roll Number</label>' +
      '<input class="input" type="text" id="reg-student-id" placeholder="e.g. CS-2024-001" value="' + App.escapeHtml(d.studentId || '') + '">' +
      '<span class="input-error-text" id="err-student-id"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-course">Course / Program</label>' +
      '<input class="input" type="text" id="reg-course" placeholder="e.g. B.Tech Computer Science" value="' + App.escapeHtml(d.course || '') + '">' +
      '<span class="input-error-text" id="err-course"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-5);"><label class="input-label" for="reg-year">Year / Semester</label>' +
      '<select class="input" id="reg-year">' +
      '<option value="">Select year</option>' +
      '<option value="1"' + (d.year === '1' ? ' selected' : '') + '>1st Year</option>' +
      '<option value="2"' + (d.year === '2' ? ' selected' : '') + '>2nd Year</option>' +
      '<option value="3"' + (d.year === '3' ? ' selected' : '') + '>3rd Year</option>' +
      '<option value="4"' + (d.year === '4' ? ' selected' : '') + '>4th Year</option>' +
      '<option value="pg"' + (d.year === 'pg' ? ' selected' : '') + '>Postgraduate</option>' +
      '<option value="phd"' + (d.year === 'phd' ? ' selected' : '') + '>PhD</option>' +
      '<option value="alumni"' + (d.year === 'alumni' ? ' selected' : '') + '>Alumni</option>' +
      '</select></div>' +

      '<div style="display:flex;gap:var(--space-3);">' +
      '<button type="button" class="btn btn-outline btn-lg" style="flex:1;" onclick="RegisterPage.prevStep()">Back</button>' +
      '<button type="button" class="btn btn-primary btn-lg" style="flex:2;" onclick="RegisterPage.validateStep3()">Continue</button></div>';
  },

  validateStep3: function() {
    this.formData.institution = (document.getElementById('reg-institution').value || '').trim();
    this.formData.studentId = (document.getElementById('reg-student-id').value || '').trim();
    this.formData.course = (document.getElementById('reg-course').value || '').trim();
    this.formData.year = document.getElementById('reg-year').value;
    this.nextStep();
  },

  renderStep4: function(el) {
    el.innerHTML =
      '<p style="color:var(--color-text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-5);">Set a password to secure your account.</p>' +

      '<div class="input-group" style="margin-bottom:var(--space-4);"><label class="input-label" for="reg-password">Password *</label>' +
      '<input class="input" type="password" id="reg-password" placeholder="Min 6 characters" required autocomplete="new-password">' +
      '<span class="input-error-text" id="err-password"></span></div>' +

      '<div class="input-group" style="margin-bottom:var(--space-6);"><label class="input-label" for="reg-confirm">Confirm Password *</label>' +
      '<input class="input" type="password" id="reg-confirm" placeholder="Repeat password" required autocomplete="new-password">' +
      '<span class="input-error-text" id="err-confirm"></span></div>' +

      '<div style="display:flex;gap:var(--space-3);">' +
      '<button type="button" class="btn btn-outline btn-lg" style="flex:1;" onclick="RegisterPage.prevStep()">Back</button>' +
      '<button type="button" class="btn btn-primary btn-lg" style="flex:2;" onclick="RegisterPage.validateStep4()">Create Account</button></div>';
  },

  validateStep4: function() {
    this.clearErrors();
    var password = document.getElementById('reg-password').value;
    var confirm = document.getElementById('reg-confirm').value;
    var err = false;
    var e1 = Auth.validatePassword(password); if (e1) { this.showError('password', e1); err = true; }
    var e2 = Auth.validateConfirmPassword(password, confirm); if (e2) { this.showError('confirm', e2); err = true; }
    if (err) return;
    this.formData.password = password;
    this.submitRegistration();
  },

  async submitRegistration() {
    var result = await AppState.registerUser({
      name: this.formData.name,
      email: this.formData.email,
      mobile: this.formData.mobile,
      type: this.formData.type,
      photo: this.photoData,
      password: this.formData.password,
      institution: this.formData.institution || '',
      studentId: this.formData.studentId || '',
      course: this.formData.course || '',
      year: this.formData.year || ''
    });
    if (!result.success) { Toast.show(result.error, 'error'); return; }
    Toast.show('Account created! Redirecting to login...', 'success');
    setTimeout(function() { window.location.hash = '#/login'; }, 1200);
  },

  nextStep: function() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      var container = document.getElementById('main-content');
      this.renderStep(container);
    }
  },

  prevStep: function() {
    if (this.currentStep > 1) {
      this.currentStep--;
      var container = document.getElementById('main-content');
      this.renderStep(container);
    }
  },

  showError: function(field, msg) {
    Auth.showFieldError(field, msg);
  },

  clearErrors: function() {
    Auth.clearFormErrors();
  }
};
