class LoginPage {
  // ==========================================
  // LOCATORS / SELECTORS
  // ==========================================
  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get loginButton() {
    return cy.get('button[type="submit"]');
  }

  get forgotPasswordLink() {
    return cy.get('.orangehrm-login-forgot');
  }

  get companyLogo() {
    return cy.get('.orangehrm-login-branding img');
  }

  get loginTitle() {
    return cy.get('.orangehrm-login-title');
  }

  get demoCredentialsBox() {
    return cy.get('.orangehrm-demo-credentials');
  }

  get alertError() {
    return cy.get('.oxd-alert-content-text');
  }

  get inputFieldErrors() {
    return cy.get('.oxd-input-field-error-message');
  }

  getUsernameError() {
    return cy.get('.oxd-form-row').eq(0).find('.oxd-input-field-error-message');
  }

  getPasswordError() {
    return cy.get('.oxd-form-row').eq(1).find('.oxd-input-field-error-message');
  }

  get dashboardBreadcrumb() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  get userDropdown() {
    return cy.get('.oxd-userdropdown-tab');
  }

  get resetPasswordTitle() {
    return cy.get('.orangehrm-forgot-password-title');
  }

  get resetPasswordCancelBtn() {
    return cy.get('.orangehrm-forgot-password-button--cancel');
  }

  // ==========================================
  // ACTION METHODS
  // ==========================================
  visit() {
    cy.visit('/web/index.php/auth/login');
    this.usernameInput.should('be.visible');
    return this;
  }

  enterUsername(username) {
    if (username !== undefined && username !== null && username !== '') {
      this.usernameInput.clear().type(username);
    }
    return this;
  }

  enterPassword(password) {
    if (password !== undefined && password !== null && password !== '') {
      this.passwordInput.clear().type(password);
    }
    return this;
  }

  clickLogin() {
    this.loginButton.click();
    return this;
  }

  submitLogin(username, password) {
    if (username) this.enterUsername(username);
    if (password) this.enterPassword(password);
    this.clickLogin();
    return this;
  }

  submitLoginWithEnterKey(username, password) {
    this.enterUsername(username);
    this.passwordInput.clear().type(`${password}{enter}`);
    return this;
  }

  clickForgotPassword() {
    this.forgotPasswordLink.click();
    return this;
  }

  cancelResetPassword() {
    this.resetPasswordCancelBtn.should('be.visible').click();
    return this;
  }

  // ==========================================
  // ASSERTION METHODS
  // ==========================================
  assertDashboardLoaded() {
    cy.url().should('include', '/dashboard/index');
    this.dashboardBreadcrumb.should('be.visible').and('have.text', 'Dashboard');
    this.userDropdown.should('be.visible');
  }

  assertAlertError(expectedMessage = 'Invalid credentials') {
    this.alertError.should('be.visible').and('contain.text', expectedMessage);
    cy.url().should('include', '/auth/login');
  }

  assertBothFieldsRequired() {
    this.inputFieldErrors.should('have.length', 2);
    this.getUsernameError().should('be.visible').and('have.text', 'Required');
    this.getPasswordError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  }

  assertUsernameFieldRequired() {
    this.getUsernameError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  }

  assertPasswordFieldRequired() {
    this.getPasswordError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  }

  assertPasswordInputMasked() {
    this.passwordInput.should('have.attr', 'type', 'password');
    this.passwordInput.should('have.attr', 'placeholder', 'Password');
  }

  assertResetPasswordPage() {
    cy.url().should('include', '/auth/requestPasswordResetCode');
    this.resetPasswordTitle.should('be.visible').and('have.text', 'Reset Password');
  }

  assertLoginPageElementsVisible() {
    this.companyLogo.should('be.visible');
    this.loginTitle.should('be.visible').and('have.text', 'Login');
    this.usernameInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.loginButton.should('be.visible').and('be.enabled');
    this.demoCredentialsBox.should('be.visible').and('contain.text', 'Username : Admin');
  }
}

export default new LoginPage();
