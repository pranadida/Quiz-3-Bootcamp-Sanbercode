class DirectoryIntercept {
  interceptGetEmployees(alias = 'getEmployeesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees**').as(alias);
  }

  stubEmployeesList(mockData, alias = 'mockEmployeesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees**', {
      statusCode: 200,
      body: mockData,
      headers: {
        'content-type': 'application/json',
      },
    }).as(alias);
  }

  stubEmptyEmployees(alias = 'mockEmptyEmployeesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees**', {
      statusCode: 200,
      body: {
        data: [],
        meta: {
          total: 0,
        },
      },
    }).as(alias);
  }

  interceptDelayedEmployees(delayMs = 1000, alias = 'delayedEmployeesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees**', (req) => {
      req.on('response', (res) => {
        res.setDelay(delayMs);
      });
    }).as(alias);
  }

  stubEmployeesServerError(alias = 'mock500DirectoryRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/directory/employees**', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
        message: 'Unable to fetch directory employees list',
      },
    }).as(alias);
  }
}

export default new DirectoryIntercept();
