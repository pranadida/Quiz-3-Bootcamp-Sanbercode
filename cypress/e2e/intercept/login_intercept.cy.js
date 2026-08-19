import loginPage from '../../support/pages/LoginPage';

describe('Feature: OrangeHRM Login & Authentication with Cy.Intercept Suite', () => {
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

  // =========================================================================
  // TEST CASE 01: Intercept POST /auth/validate (Status 302 & Redirection)
  // =========================================================================
  it('TC-01-INT [Authentication]: Should successfully intercept login POST request and validate redirect to dashboard', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('loginAuthRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@loginAuthRequest').then((interception) => {
      expect(interception.request.method).to.equal('POST');
      expect(interception.request.headers['content-type']).to.include('application/x-www-form-urlencoded');
      expect(interception.response.statusCode).to.equal(302);
    });

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('be.visible').and('have.text', 'Dashboard');
  });

  // =========================================================================
  // TEST CASE 02: Intercept GET /action-summary (Response Status & Body Validation)
  // =========================================================================
  it('TC-02-INT [API Spy]: Should intercept dashboard action-summary API and validate response body schema', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/action-summary').as('getActionSummary');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@getActionSummary').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.headers['content-type']).to.include('application/json');
      expect(interception.response.body).to.have.property('data');
    });

    cy.url().should('include', '/dashboard/index');
  });

  // =========================================================================
  // TEST CASE 03: Intercept GET /shortcuts (Response Stubbing & Mock Data Injection)
  // =========================================================================
  it('TC-03-INT [Mocking]: Should stub dashboard shortcuts API with mock data fixture', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/shortcuts', {
      statusCode: 200,
      body: interceptData.mockShortcuts,
    }).as('mockShortcutsRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@mockShortcutsRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data).to.have.length(2);
      expect(interception.response.body.data[0].name).to.equal('Sanbercode Custom Leave List');
    });

    cy.url().should('include', '/dashboard/index');
  });

  // =========================================================================
  // TEST CASE 04: Intercept GET /subunit (Simulated Network Latency Delay)
  // =========================================================================
  it('TC-04-INT [Network Throttling]: Should intercept subunit distribution API with simulated network delay', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/subunit', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000);
      });
    }).as('delayedSubunitRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@delayedSubunitRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.url().should('include', '/dashboard/index');
  });

  // =========================================================================
  // TEST CASE 05: Intercept POST /auth/validate (Negative Login - Invalid Credentials)
  // =========================================================================
  it('TC-05-INT [Negative Auth]: Should intercept failed login request and verify 302 redirect back to login page', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('failedLoginRequest');

    loginPage.enterUsername(loginData.invalidUser.username);
    loginPage.enterPassword(loginData.invalidUser.password);
    loginPage.clickLogin();

    cy.wait('@failedLoginRequest').then((interception) => {
      expect(interception.request.method).to.equal('POST');
      expect(interception.response.statusCode).to.equal(302);
      expect(interception.response.headers.location).to.include('/auth/login');
    });

    loginPage.alertError.should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  // =========================================================================
  // TEST CASE 06: Intercept POST /auth/validate (Fault Injection - Mock 500 Server Error)
  // =========================================================================
  it('TC-06-INT [Fault Injection]: Should intercept login request and stub 500 Internal Server Error response', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate', {
      statusCode: 500,
      body: interceptData.mockServerError,
      headers: {
        'x-mock-error': 'server-down-simulation',
      },
    }).as('mock500ErrorRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@mock500ErrorRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(500);
      expect(interception.response.headers['x-mock-error']).to.equal('server-down-simulation');
      expect(interception.response.body.error).to.equal('Internal Server Error');
    });

    cy.url().should('not.include', '/dashboard/index');
  });

  // =========================================================================
  // TEST CASE 07: Intercept GET /core/i18n/messages (Localization Dictionary Stubbing)
  // =========================================================================
  it('TC-07-INT [Localization Stub]: Should stub i18n messages API with custom translation dictionary', () => {
    cy.intercept('GET', '**/web/index.php/core/i18n/messages', {
      statusCode: 200,
      body: {
        'oxd.messages.login': 'Sanbercode Custom Login Text',
        'oxd.messages.username': 'Sanbercode Custom Username Label',
      },
      headers: {
        'content-type': 'application/json',
      },
    }).as('i18nMessagesRequest');

    cy.visit('/web/index.php/auth/login');

    cy.wait('@i18nMessagesRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.headers['content-type']).to.include('application/json');
      expect(interception.response.body['oxd.messages.login']).to.equal('Sanbercode Custom Login Text');
    });

    loginPage.usernameInput.should('be.visible');
  });

  // =========================================================================
  // TEST CASE 08: Intercept GET /time-at-work (Query Param Matching & Response Headers)
  // =========================================================================
  it('TC-08-INT [Query Params]: Should intercept time-at-work API with query parameter inspection', () => {
    cy.intercept({
      method: 'GET',
      pathname: '**/web/index.php/api/v2/dashboard/employees/time-at-work**',
    }).as('timeAtWorkRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@timeAtWorkRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.headers).to.have.property('content-type');
    });

    cy.url().should('include', '/dashboard/index');
  });

  // =========================================================================
  // TEST CASE 09: Intercept GET /locations (Response Status & Location Data Verification)
  // =========================================================================
  it('TC-09-INT [Data Distribution API]: Should intercept employee locations distribution API and assert response data', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/locations').as('getLocationsRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@getLocationsRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('data');
    });

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('be.visible');
  });

  // =========================================================================
  // TEST CASE 10: Intercept GET /leaves (Employee Leaves Distribution on Date)
  // =========================================================================
  it('TC-10-INT [Leaves API Validation]: Should intercept employee leaves on date API and validate payload structure', () => {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/leaves**').as('getLeavesRequest');

    loginPage.enterUsername(loginData.validUser.username);
    loginPage.enterPassword(loginData.validUser.password);
    loginPage.clickLogin();

    cy.wait('@getLeavesRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('data');
      expect(interception.response.headers['content-type']).to.include('application/json');
    });

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('be.visible');
  });
});
