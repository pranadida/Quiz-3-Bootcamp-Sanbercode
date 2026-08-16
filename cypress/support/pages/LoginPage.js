class LoginPage {
  // Navigation
  visit() {
    cy.visit('/web/index.php/auth/login');
    cy.get('input[name="username"]').should('be.visible');
  }

  // Locators
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

  // Action Methods
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

  clickForgotPassword() {
    this.forgotPasswordLink.click();
    return this;
  }

  submitLogin(username, password) {
    if (username) this.enterUsername(username);
    if (password) this.enterPassword(password);
    this.clickLogin();
  }
}

export default new LoginPage();
