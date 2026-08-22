class RecruitmentIntercept {
  interceptGetCandidates(alias = 'getCandidatesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/candidates**').as(alias);
  }

  stubCandidatesList(mockData, alias = 'mockCandidatesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/candidates**', {
      statusCode: 200,
      body: mockData,
      headers: {
        'content-type': 'application/json',
      },
    }).as(alias);
  }

  interceptAddCandidate(alias = 'addCandidateRequest') {
    cy.intercept('POST', '**/web/index.php/api/v2/recruitment/candidates').as(alias);
  }

  stubAddCandidateSuccess(mockCandidate, alias = 'mockAddCandidateSuccess') {
    cy.intercept('POST', '**/web/index.php/api/v2/recruitment/candidates', {
      statusCode: 200,
      body: {
        data: mockCandidate,
      },
      headers: {
        'content-type': 'application/json',
      },
    }).as(alias);
  }

  interceptGetVacancies(alias = 'getVacanciesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/vacancies**').as(alias);
  }

  stubVacanciesList(mockData, alias = 'mockVacanciesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/vacancies**', {
      statusCode: 200,
      body: mockData,
      headers: {
        'content-type': 'application/json',
      },
    }).as(alias);
  }

  interceptDelayedCandidates(delayMs = 1000, alias = 'delayedCandidatesRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/candidates**', (req) => {
      req.on('response', (res) => {
        res.setDelay(delayMs);
      });
    }).as(alias);
  }

  stubCandidatesServerError(alias = 'mock500RecruitmentRequest') {
    cy.intercept('GET', '**/web/index.php/api/v2/recruitment/candidates**', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
        message: 'Unable to fetch recruitment candidates',
      },
    }).as(alias);
  }
}

export default new RecruitmentIntercept();
