import loginPage from '../support/pages/LoginPage';

describe('Feature: OrangeHRM Authentication & Login Test Suite', () => {
  let testData;

  before(() => {
    cy.fixture('loginData').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
  });

  // ==========================================
  // POSITIVE TEST SCENARIOS
  // ==========================================

  it('TC-01 [Positive]: Should successfully login with valid credentials and redirect to dashboard', () => {
    loginPage.enterUsername(testData.validUser.username);
    loginPage.enterPassword(testData.validUser.password);
    loginPage.clickLogin();

    // Assertions
    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('be.visible').and('have.text', 'Dashboard');
    cy.get('.oxd-userdropdown-tab').should('be.visible');
  });

  it('TC-12 [Positive]: Should successfully login by pressing Enter key on password input field', () => {
    loginPage.enterUsername(testData.validUser.username);
    loginPage.passwordInput.clear().type(`${testData.validUser.password}{enter}`);

    // Assertions
    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('be.visible').and('have.text', 'Dashboard');
    cy.get('.oxd-userdropdown-tab').should('be.visible');
  });

  // ==========================================
  // NEGATIVE TEST SCENARIOS
  // ==========================================

  it('TC-02 [Negative]: Should display error alert when logging in with invalid username and password', () => {
    loginPage.enterUsername(testData.invalidUser.username);
    loginPage.enterPassword(testData.invalidUser.password);
    loginPage.clickLogin();

    // Assertions
    loginPage.alertError.should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  it('TC-03 [Negative]: Should display error alert when logging in with valid username and incorrect password', () => {
    loginPage.enterUsername(testData.wrongPassword.username);
    loginPage.enterPassword(testData.wrongPassword.password);
    loginPage.clickLogin();

    // Assertions
    loginPage.alertError.should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  it('TC-04 [Negative]: Should display error alert when logging in with invalid username and valid password', () => {
    loginPage.enterUsername(testData.wrongUsername.username);
    loginPage.enterPassword(testData.wrongUsername.password);
    loginPage.clickLogin();

    // Assertions
    loginPage.alertError.should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  // ==========================================
  // FIELD VALIDATION SCENARIOS
  // ==========================================

  it('TC-05 [Validation]: Should display Required error on both fields when submitting empty form', () => {
    loginPage.clickLogin();

    // Assertions
    loginPage.inputFieldErrors.should('have.length', 2);
    loginPage.getUsernameError().should('be.visible').and('have.text', 'Required');
    loginPage.getPasswordError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  });

  it('TC-06 [Validation]: Should display Required error only on username field when password is provided', () => {
    loginPage.enterPassword(testData.validUser.password);
    loginPage.clickLogin();

    // Assertions
    loginPage.getUsernameError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  });

  it('TC-07 [Validation]: Should display Required error only on password field when username is provided', () => {
    loginPage.enterUsername(testData.validUser.username);
    loginPage.clickLogin();

    // Assertions
    loginPage.getPasswordError().should('be.visible').and('have.text', 'Required');
    cy.url().should('include', '/auth/login');
  });

  // ==========================================
  // SECURITY & UI INTEGRITY SCENARIOS
  // ==========================================

  it('TC-08 [Security]: Should verify password input field has type password for character masking', () => {
    loginPage.passwordInput.should('have.attr', 'type', 'password');
    loginPage.passwordInput.should('have.attr', 'placeholder', 'Password');
  });

  it('TC-09 [Navigation]: Should navigate to Reset Password page when clicking Forgot your password link', () => {
    loginPage.clickForgotPassword();

    // Assertions
    cy.url().should('include', '/auth/requestPasswordResetCode');
    cy.get('.orangehrm-forgot-password-title').should('be.visible').and('have.text', 'Reset Password');
    cy.get('.orangehrm-forgot-password-button--cancel').should('be.visible').click();
    cy.url().should('include', '/auth/login');
  });

  it('TC-10 [Security]: Should safely handle SQL Injection attack strings without system failure', () => {
    loginPage.enterUsername(testData.sqlInjection.username);
    loginPage.enterPassword(testData.sqlInjection.password);
    loginPage.clickLogin();

    // Assertions
    loginPage.alertError.should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  it('TC-11 [UI]: Should verify presence and visibility of all key login page UI elements', () => {
    loginPage.companyLogo.should('be.visible');
    loginPage.loginTitle.should('be.visible').and('have.text', 'Login');
    loginPage.usernameInput.should('be.visible');
    loginPage.passwordInput.should('be.visible');
    loginPage.loginButton.should('be.visible').and('be.enabled');
    loginPage.demoCredentialsBox.should('be.visible').and('contain.text', 'Username : Admin');
  });
});
