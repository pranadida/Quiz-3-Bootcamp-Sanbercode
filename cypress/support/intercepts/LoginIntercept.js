class LoginIntercept {
  interceptAuthValidate(alias = 'loginAuthRequest') {
    cy.intercept('POST', '**/web/index.php/auth/validate').as(alias);
  }

  interceptActionSummary(alias = 'actionSummaryRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/action-summary').as(alias);
  }

  stubShortcuts(mockData, alias = 'mockShortcutsRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/shortcuts', {
      statusCode: 200,
      body: mockData,
    }).as(alias);
  }

  interceptSubunitsDelay(delayMs = 1000, alias = 'delayedSubunitRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/subunit', (req) => {
      req.on('response', (res) => {
        res.setDelay(delayMs);
      });
    }).as(alias);
  }

  stubServerError(mockError, alias = 'mock500ErrorRequest') {
    cy.intercept('POST', '**/web/index.php/auth/validate', {
      statusCode: 500,
      body: mockError,
      headers: {
        'x-mock-error': 'server-down-simulation',
      },
    }).as(alias);
  }

  stubI18nMessages(mockMessages, alias = 'i18nMessagesRequest') {
    cy.intercept('GET', '**/web/index.php/core/i18n/messages', {
      statusCode: 200,
      body: mockMessages,
      headers: {
        'content-type': 'application/json',
      },
    }).as(alias);
  }

  interceptTimeAtWork(alias = 'timeAtWorkRequest') {
    cy.intercept({
      method: 'GET',
      pathname: '**/web/index.php/api/v2/dashboard/employees/time-at-work**',
    }).as(alias);
  }

  interceptLocations(alias = 'getLocationsRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/locations').as(alias);
  }

  interceptLeaves(alias = 'getLeavesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/dashboard/employees/leaves**').as(alias);
  }
}

export default new LoginIntercept();
