import loginPage from '../support/pages/LoginPage';
import recruitmentPage from '../support/pages/RecruitmentPage';
import recruitmentIntercept from '../support/intercepts/RecruitmentIntercept';

describe('Feature: OrangeHRM Recruitment Test Suite', () => {
  let loginData;
  let recruitmentData;

  before(() => {
    cy.fixture('loginData').then((data) => {
      loginData = data;
    });
    cy.fixture('recruitmentData').then((data) => {
      recruitmentData = data;
    });
  });

  beforeEach(() => {
    loginPage.visit();
    loginPage.submitLogin(loginData.validUser.username, loginData.validUser.password);
    loginPage.assertDashboardLoaded();
  });

  // ==========================================
  // 1. POSITIVE CANDIDATE SCENARIOS
  // ==========================================

  it('TC-REC-01 [Positive / Intercept]: Should navigate to Recruitment Candidates page, intercept candidates API, and assert table records', () => {
    recruitmentIntercept.interceptGetCandidates('getCandidatesRequest');

    recruitmentPage.visitCandidates();

    cy.wait('@getCandidatesRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('data');
    });

    recruitmentPage.assertCandidatesPageLoaded();
    recruitmentPage.assertCandidateTableHasRows();
  });

  it('TC-REC-02 [Positive / Filter]: Should filter candidates by Status and assert filtered table records', () => {
    recruitmentIntercept.interceptGetCandidates('filteredStatusRequest');

    recruitmentPage.visitCandidates();
    recruitmentPage.selectStatusFilter(recruitmentData.filterCriteria.status);
    recruitmentPage.clickSearch();

    cy.wait('@filteredStatusRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    recruitmentPage.assertCandidatesPageLoaded();
  });

  // ==========================================
  // 2. UI & FORM VALIDATION SCENARIOS
  // ==========================================

  it('TC-REC-03 [Navigation & UI]: Should navigate to Add Candidate page and verify form elements', () => {
    recruitmentPage.visitCandidates();
    recruitmentPage.clickAddCandidateButton();
    recruitmentPage.assertAddCandidatePageLoaded();
  });

  it('TC-REC-04 [Validation / Required Fields]: Should display Required validation errors on empty form submission', () => {
    recruitmentPage.visitAddCandidate();
    recruitmentPage.clickSaveCandidate();
    recruitmentPage.assertRequiredFieldsValidation();
  });

  it('TC-REC-05 [Validation / Invalid Email Format]: Should display format error message when entering invalid email', () => {
    recruitmentPage.visitAddCandidate();
    recruitmentPage.fillCandidateForm({
      firstName: recruitmentData.invalidCandidate.firstName,
      lastName: recruitmentData.invalidCandidate.lastName,
      email: recruitmentData.invalidCandidate.email,
    });
    recruitmentPage.clickSaveCandidate();
    recruitmentPage.assertInvalidEmailFormatError();
  });

  // ==========================================
  // 3. CANDIDATE CREATION & INTERCEPT SCENARIOS
  // ==========================================

  it('TC-REC-06 [Positive / Candidate Creation]: Should fill and submit Add Candidate form, intercept POST API, and save candidate', () => {
    const timestamp = Date.now();
    const dynamicCandidate = {
      firstName: 'Sanber',
      middleName: 'QA',
      lastName: `Auto${timestamp.toString().slice(-4)}`,
      email: `sanber${timestamp}@example.com`,
      contactNumber: '081234567890',
      keywords: 'cypress, automation, testing',
      notes: 'Automated test candidate for Sanbercode assignment',
      consent: true,
    };

    recruitmentIntercept.interceptAddCandidate('createCandidateRequest');

    recruitmentPage.visitAddCandidate();
    recruitmentPage.fillCandidateForm(dynamicCandidate);
    recruitmentPage.clickSaveCandidate();

    cy.wait('@createCandidateRequest').then((interception) => {
      expect(interception.request.method).to.equal('POST');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data.firstName).to.equal('Sanber');
    });

    recruitmentPage.assertCandidateCreatedSuccessfully();
  });

  it('TC-REC-07 [Intercept Mocking / Custom Data]: Should stub Candidates API with mock fixture data and assert table render', () => {
    recruitmentIntercept.stubCandidatesList(recruitmentData.mockCandidatesList, 'mockCandidatesList');

    recruitmentPage.visitCandidates();

    cy.wait('@mockCandidatesList').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.data).to.have.length(2);
      expect(interception.response.body.data[0].firstName).to.equal('Wiryawan');
    });

    recruitmentPage.assertTableRowsCount(2);
    recruitmentPage.assertCandidateInTable('Wiryawan');
    recruitmentPage.assertCandidateInTable('Sanbercode');
  });

  it('TC-REC-08 [Action & Navigation / Vacancies Tab]: Should navigate between Candidates and Vacancies tabs and intercept vacancies API', () => {
    recruitmentIntercept.interceptGetVacancies('getVacanciesRequest');

    recruitmentPage.visitCandidates();
    recruitmentPage.clickVacanciesTab();

    cy.wait('@getVacanciesRequest').then((interception) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('data');
    });

    recruitmentPage.assertVacanciesPageLoaded();
  });
});
