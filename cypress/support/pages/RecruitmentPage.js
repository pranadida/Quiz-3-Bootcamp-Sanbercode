class RecruitmentPage {
  // ==========================================
  // LOCATORS / SELECTORS
  // ==========================================
  get pageTitle() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  get candidatesTab() {
    return cy.get('.oxd-topbar-body-nav-tab').contains('Candidates');
  }

  get vacanciesTab() {
    return cy.get('.oxd-topbar-body-nav-tab').contains('Vacancies');
  }

  get addCandidateButton() {
    return cy.contains('button', 'Add');
  }

  get recordsFoundLabel() {
    return cy.get('.orangehrm-horizontal-padding .oxd-text, .oxd-text--span');
  }

  get tableRows() {
    return cy.get('.oxd-table-card');
  }

  get tableBody() {
    return cy.get('.oxd-table-body');
  }

  get searchButton() {
    return cy.get('button[type="submit"]');
  }

  get resetButton() {
    return cy.get('button[type="reset"], .oxd-button--ghost');
  }

  // Filter Dropdowns
  get jobTitleFilterDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(0).find('.oxd-select-text');
  }

  get vacancyFilterDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(1).find('.oxd-select-text');
  }

  get hiringManagerFilterDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(2).find('.oxd-select-text');
  }

  get statusFilterDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(3).find('.oxd-select-text');
  }

  get candidateNameFilterInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  get selectDropdownOptions() {
    return cy.get('.oxd-select-dropdown');
  }

  // Add Candidate Form Locators
  get addCandidateTitle() {
    return cy.get('.orangehrm-card-container h6, .oxd-text--h6');
  }

  get firstNameInput() {
    return cy.get('input[name="firstName"]');
  }

  get middleNameInput() {
    return cy.get('input[name="middleName"]');
  }

  get lastNameInput() {
    return cy.get('input[name="lastName"]');
  }

  get vacancyFormDropdown() {
    return cy.get('.oxd-select-text');
  }

  get emailInput() {
    return cy.get('.oxd-form-row').eq(2).find('input').eq(0);
  }

  get contactNumberInput() {
    return cy.get('.oxd-form-row').eq(2).find('input').eq(1);
  }

  get resumeFileInput() {
    return cy.get('input[type="file"]');
  }

  get keywordsInput() {
    return cy.get('input[placeholder="Enter comma seperated words..."]');
  }

  get notesTextarea() {
    return cy.get('textarea, .oxd-textarea');
  }

  get consentCheckbox() {
    return cy.get('.oxd-checkbox-input');
  }

  get saveCandidateButton() {
    return cy.get('button[type="submit"]');
  }

  get cancelCandidateButton() {
    return cy.contains('button', 'Cancel');
  }

  get fieldErrors() {
    return cy.get('.oxd-input-field-error-message');
  }

  get toastSuccess() {
    return cy.get('.oxd-toast--success');
  }

  // ==========================================
  // ACTION METHODS
  // ==========================================
  visitCandidates() {
    cy.visit('/web/index.php/recruitment/viewCandidates');
    this.pageTitle.should('be.visible');
    return this;
  }

  visitVacancies() {
    cy.visit('/web/index.php/recruitment/viewJobVacancy');
    this.pageTitle.should('be.visible');
    return this;
  }

  visitAddCandidate() {
    cy.visit('/web/index.php/recruitment/addCandidate');
    this.firstNameInput.should('be.visible');
    return this;
  }

  clickAddCandidateButton() {
    this.addCandidateButton.click();
    this.firstNameInput.should('be.visible');
    return this;
  }

  clickCandidatesTab() {
    this.candidatesTab.click();
    return this;
  }

  clickVacanciesTab() {
    this.vacanciesTab.click();
    return this;
  }

  selectStatusFilter(statusText) {
    this.statusFilterDropdown.click();
    this.selectDropdownOptions.contains('.oxd-select-option', statusText).click();
    return this;
  }

  selectJobTitleFilter(jobTitle) {
    this.jobTitleFilterDropdown.click();
    this.selectDropdownOptions.contains('.oxd-select-option', jobTitle).click();
    return this;
  }

  clickSearch() {
    this.searchButton.click();
    return this;
  }

  clickReset() {
    this.resetButton.click();
    return this;
  }

  fillCandidateForm({
    firstName,
    middleName,
    lastName,
    vacancy,
    email,
    contactNumber,
    keywords,
    notes,
    consent,
  }) {
    if (firstName) this.firstNameInput.clear().type(firstName);
    if (middleName) this.middleNameInput.clear().type(middleName);
    if (lastName) this.lastNameInput.clear().type(lastName);

    if (vacancy) {
      this.vacancyFormDropdown.click();
      this.selectDropdownOptions.contains('.oxd-select-option', vacancy).click();
    }

    if (email) this.emailInput.clear().type(email);
    if (contactNumber) this.contactNumberInput.clear().type(contactNumber);
    if (keywords) this.keywordsInput.clear().type(keywords);
    if (notes) this.notesTextarea.clear().type(notes);

    if (consent) {
      this.consentCheckbox.click();
    }

    return this;
  }

  clickSaveCandidate() {
    this.saveCandidateButton.click();
    return this;
  }

  clickCancelCandidate() {
    this.cancelCandidateButton.click();
    return this;
  }

  // ==========================================
  // ASSERTION METHODS
  // ==========================================
  assertCandidatesPageLoaded() {
    cy.url().should('include', '/recruitment/viewCandidates');
    this.pageTitle.should('contain.text', 'Recruitment');
    this.addCandidateButton.should('be.visible');
  }

  assertVacanciesPageLoaded() {
    cy.url().should('include', '/recruitment/viewJobVacancy');
    this.pageTitle.should('contain.text', 'Recruitment');
  }

  assertAddCandidatePageLoaded() {
    cy.url().should('include', '/recruitment/addCandidate');
    this.firstNameInput.should('be.visible');
    this.lastNameInput.should('be.visible');
    this.emailInput.should('be.visible');
  }

  assertCandidateTableHasRows() {
    this.tableRows.should('have.length.at.least', 1);
  }

  assertTableRowsCount(expectedCount) {
    this.tableRows.should('have.length', expectedCount);
  }

  assertCandidateInTable(candidateName) {
    this.tableBody.should('contain.text', candidateName);
  }

  assertRequiredFieldsValidation() {
    this.fieldErrors.should('have.length.at.least', 3);
    this.fieldErrors.each(($el) => {
      expect($el.text().trim()).to.equal('Required');
    });
  }

  assertInvalidEmailFormatError() {
    this.fieldErrors.should('contain.text', 'Expected format: admin@example.com');
  }

  assertCandidateCreatedSuccessfully() {
    cy.url().should('match', /\/recruitment\/(addCandidate\/\d+|viewCandidates)/);
    cy.get('.oxd-layout-context').should('be.visible');
  }

  assertResetFilterState() {
    this.jobTitleFilterDropdown.should('contain.text', '-- Select --');
    this.statusFilterDropdown.should('contain.text', '-- Select --');
  }
}

export default new RecruitmentPage();
