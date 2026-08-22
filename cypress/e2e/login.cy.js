import loginPage from '../support/pages/LoginPage';
import loginIntercept from '../support/intercepts/LoginIntercept';

describe('Feature: OrangeHRM Authentication & Login Test Suite', () => {
  let loginData;
  let interceptData;

  before(() => {
    cy.fixture('loginData').then((data) => {
      loginData = data;
    });
    cy.fixture('interceptData').then((data) => {
      interceptData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
  });

  // ==========================================
  // 1. POSITIVE TEST SCENARIOS
  // ==========================================

  it('TC-LOG-01 [Positive / Intercept]: Should successfully login with valid credentials and redirect to dashboard', () => {
    loginIntercept.interceptAuthValidate('loginAuthRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@loginAuthRequest').then((interception) => {
      expect(interception.request.method).to.equal('POST');
      expect(interception.response.statusCode).to.equal(302);
    });

    loginPage.assertDashboardLoaded();
  });

  it('TC-LOG-02 [Positive / Keyboard Action]: Should successfully login by pressing Enter key on password input', () => {
    loginPage.submitLoginWithEnterKey(loginData.validUser.username, loginData.validUser.password);
    loginPage.assertDashboardLoaded();
  });

  // ==========================================
  // 2. NEGATIVE TEST SCENARIOS
  // ==========================================

  it('TC-LOG-03 [Negative / Intercept]: Should display error alert when logging in with invalid username and password', () => {
    loginIntercept.interceptAuthValidate('failedLoginRequest');

    loginPage.enterUsername(loginData.invalidUser.username);
    loginPage.enterPassword(loginData.invalidUser.password);
    loginPage.clickLogin();

    cy.wait('@failedLoginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(302);
      expect(interception.response.headers.location).to.include('/auth/login');
    });

    loginPage.assertAlertError('Invalid credentials');
  });

  it('TC-LOG-04 [Negative / Action & Assertion]: Should display error alert when logging in with valid username and wrong password', () => {
    loginPage.submitLogin(loginData.wrongPassword.username, loginData.wrongPassword.password);
    loginPage.assertAlertError('Invalid credentials');
  });

  // ==========================================
  // 3. FIELD VALIDATION SCENARIOS
  // ==========================================

  it('TC-LOG-05 [Validation / Action & Assertion]: Should display Required error on both fields when submitting empty form', () => {
    loginPage.clickLogin();
    loginPage.assertBothFieldsRequired();
  });

  it('TC-LOG-06 [Validation / Action & Assertion]: Should display Required error on password field when username is provided', () => {
    loginPage.enterUsername(loginData.validUser.username);
    loginPage.clickLogin();
    loginPage.assertPasswordFieldRequired();
  });

  // ==========================================
  // 4. SECURITY, UI & NAVIGATION SCENARIOS
  // ==========================================

  it('TC-LOG-07 [Security & Navigation]: Should verify password input masking and navigate to Reset Password page', () => {
    loginPage.assertPasswordInputMasked();
    loginPage.clickForgotPassword();
    loginPage.assertResetPasswordPage();
    loginPage.cancelResetPassword();
    cy.url().should('include', '/auth/login');
  });

  // ==========================================
  // 5. INTERCEPT MOCKING / FAULT INJECTION
  // ==========================================

  it('TC-LOG-08 [Intercept Mocking / Fault Injection]: Should stub 500 Internal Server Error on login endpoint', () => {
    loginIntercept.stubServerError(interceptData.mockServerError, 'mock500Request');

    loginPage.submitLogin(loginData.validUser.username, loginData.validUser.password);

    cy.wait('@mock500Request').then((interception) => {
      expect(interception.response.statusCode).to.equal(500);
      expect(interception.response.body.error).to.equal('Internal Server Error');
      expect(interception.response.headers['x-mock-error']).to.equal('server-down-simulation');
    });

    cy.url().should('not.include', '/dashboard/index');
  });
});
