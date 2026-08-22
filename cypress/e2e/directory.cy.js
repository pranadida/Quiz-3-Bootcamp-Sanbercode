import loginPage from '../support/pages/LoginPage';
import directoryPage from '../support/pages/DirectoryPage';
import directoryIntercept from '../support/intercepts/DirectoryIntercept';

describe('Feature: OrangeHRM Directory Test Suite', () => {
  let loginData;
  let directoryData;

  before(() => {
    cy.fixture('loginData').then((data) => {
      loginData = data;
    });
    cy.fixture('directoryData').then((data) => {
      directoryData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.submitLogin(loginData.validUser.username, loginData.validUser.password);
    loginPage.assertDashboardLoaded();
  });

  // ==========================================
  // 1. POSITIVE DIRECTORY SCENARIOS
  // ==========================================

  it('TC-DIR-01 [Positive / Intercept]: Should navigate to Directory page, intercept employees API, and display employee cards', () => {
    directoryIntercept.interceptGetEmployees('getEmployeesRequest');

    directoryPage.visit();

    cy.wait('@getEmployeesRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('data');
    });

    directoryPage.assertDirectoryPageLoaded();
    directoryPage.assertRecordsFoundVisible();
    directoryPage.assertAtLeastOneCardVisible();
  });

  it('TC-DIR-02 [Positive / Filter by Job Title]: Should filter directory by selecting Job Title and display results', () => {
    directoryIntercept.interceptGetEmployees('filteredByJobTitleRequest');

    directoryPage.visit();
    directoryPage.selectJobTitle(directoryData.filterCriteria.jobTitle);
    directoryPage.clickSearch();

    cy.wait('@filteredByJobTitleRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    directoryPage.assertRecordsFoundVisible();
  });

  it('TC-DIR-03 [Positive / Filter by Location]: Should filter directory by selecting Location and display results', () => {
    directoryIntercept.interceptGetEmployees('filteredByLocationRequest');

    directoryPage.visit();
    directoryPage.selectLocation(directoryData.filterCriteria.location);
    directoryPage.clickSearch();

    cy.wait('@filteredByLocationRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    directoryPage.assertRecordsFoundVisible();
  });

  it('TC-DIR-04 [Positive / Card Detail View]: Should click on an employee card and display detailed profile sheet', () => {
    directoryPage.visit();
    directoryPage.assertAtLeastOneCardVisible();
    directoryPage.clickEmployeeCard(0);
    directoryPage.assertEmployeeDetailVisible();
  });

  // ==========================================
  // 2. FORM RESET & STATE SCENARIOS
  // ==========================================

  it('TC-DIR-05 [Action & State / Reset]: Should clear filter inputs and restore default state when clicking Reset button', () => {
    directoryPage.visit();
    directoryPage.selectJobTitle(directoryData.filterCriteria.jobTitle);
    directoryPage.selectLocation(directoryData.filterCriteria.location);
    directoryPage.clickReset();
    directoryPage.assertResetFormState();
  });

  // ==========================================
  // 3. INTERCEPT MOCKING & API SCENARIOS
  // ==========================================

  it('TC-DIR-06 [Intercept Mocking / Custom Data]: Should stub directory employees API with fixture mock data and render mock cards', () => {
    directoryIntercept.stubEmployeesList(directoryData.mockDirectoryList, 'mockEmployeesList');

    directoryPage.visit();

    cy.wait('@mockEmployeesList').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data).to.have.length(2);
      expect(interception.response.body.data[1].firstName).to.equal('Wiryawan');
    });

    directoryPage.assertDirectoryCardsCount(2);
    directoryPage.assertCardContainsName('Wiryawan', 1);
  });

  it('TC-DIR-07 [Intercept Mocking / Empty State]: Should stub empty employee response and assert No Records Found UI', () => {
    directoryIntercept.stubEmptyEmployees('mockEmptyEmployees');

    directoryPage.visit();

    cy.wait('@mockEmptyEmployees').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data).to.have.length(0);
    });

    directoryPage.assertNoRecordsFound();
  });

  it('TC-DIR-08 [Intercept / Network Latency]: Should handle delayed network response gracefully with simulated latency', () => {
    directoryIntercept.interceptDelayedEmployees(1000, 'delayedEmployees');

    directoryPage.visit();

    cy.wait('@delayedEmployees').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    directoryPage.assertDirectoryPageLoaded();
    directoryPage.assertRecordsFoundVisible();
  });
});
