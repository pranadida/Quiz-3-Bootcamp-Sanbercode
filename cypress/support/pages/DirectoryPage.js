class DirectoryPage {
  // ==========================================
  // LOCATORS / SELECTORS
  // ==========================================
  get pageTitle() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  get directoryHeader() {
    return cy.get('.oxd-table-filter-header-title');
  }

  get employeeNameInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  get autocompleteDropdown() {
    return cy.get('.oxd-autocomplete-dropdown');
  }

  get autocompleteOptions() {
    return cy.get('.oxd-autocomplete-option');
  }

  get jobTitleDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(1).find('.oxd-select-text');
  }

  get locationDropdown() {
    return cy.get('.oxd-form .oxd-grid-item').eq(2).find('.oxd-select-text');
  }

  get selectDropdown() {
    return cy.get('.oxd-select-dropdown');
  }

  get searchButton() {
    return cy.get('button[type="submit"]');
  }

  get resetButton() {
    return cy.get('button[type="reset"], .oxd-button--ghost');
  }

  get recordsFoundLabel() {
    return cy.get('.orangehrm-horizontal-padding .oxd-text, .oxd-text--span');
  }

  get directoryCards() {
    return cy.get('.orangehrm-directory-card');
  }

  get cardHeaders() {
    return cy.get('.orangehrm-directory-card-header');
  }

  get cardSubtitles() {
    return cy.get('.orangehrm-directory-card-subtitle');
  }

  get cardDescriptions() {
    return cy.get('.orangehrm-directory-card-description');
  }

  get profilePictures() {
    return cy.get('.orangehrm-profile-picture-img');
  }

  get detailSheet() {
    return cy.get('.oxd-sheet');
  }

  get toastMessage() {
    return cy.get('.oxd-toast');
  }

  // ==========================================
  // ACTION METHODS
  // ==========================================
  visit() {
    cy.visit('/web/index.php/directory/viewDirectory');
    this.directoryHeader.should('be.visible');
    return this;
  }

  typeEmployeeName(name) {
    if (name) {
      this.employeeNameInput.clear().type(name);
      cy.wait(1000); // Wait for autocomplete debounce
    }
    return this;
  }

  selectEmployeeFromAutocomplete(name) {
    this.typeEmployeeName(name);
    this.autocompleteDropdown.should('be.visible');
    this.autocompleteOptions.contains(name).click();
    return this;
  }

  selectJobTitle(jobTitle) {
    this.jobTitleDropdown.click();
    this.selectDropdown.should('be.visible');
    this.selectDropdown.contains('.oxd-select-option', jobTitle).click();
    return this;
  }

  selectLocation(location) {
    this.locationDropdown.click();
    this.selectDropdown.should('be.visible');
    this.selectDropdown.contains('.oxd-select-option', location).click();
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

  clickEmployeeCard(index = 0) {
    this.directoryCards.eq(index).should('be.visible').click();
    return this;
  }

  filterDirectory({ employeeName, jobTitle, location } = {}) {
    if (employeeName) this.selectEmployeeFromAutocomplete(employeeName);
    if (jobTitle) this.selectJobTitle(jobTitle);
    if (location) this.selectLocation(location);
    this.clickSearch();
    return this;
  }

  // ==========================================
  // ASSERTION METHODS
  // ==========================================
  assertDirectoryPageLoaded() {
    cy.url().should('include', '/directory/viewDirectory');
    this.pageTitle.should('be.visible').and('contain.text', 'Directory');
    this.directoryHeader.should('be.visible').and('contain.text', 'Directory');
  }

  assertRecordsFoundVisible() {
    this.recordsFoundLabel.should('be.visible').and('contain.text', 'Record');
  }

  assertDirectoryCardsCount(expectedCount) {
    this.directoryCards.should('have.length', expectedCount);
  }

  assertAtLeastOneCardVisible() {
    this.directoryCards.should('have.length.at.least', 1);
  }

  assertCardContainsName(name, index = 0) {
    this.cardHeaders.eq(index).should('contain.text', name);
  }

  assertCardContainsJobTitle(jobTitle, index = 0) {
    this.cardSubtitles.eq(index).should('contain.text', jobTitle);
  }

  assertCardContainsLocation(location, index = 0) {
    this.cardDescriptions.eq(index).should('contain.text', location);
  }

  assertResetFormState() {
    this.employeeNameInput.should('have.value', '');
    this.jobTitleDropdown.should('contain.text', '-- Select --');
    this.locationDropdown.should('contain.text', '-- Select --');
  }

  assertNoRecordsFound() {
    this.recordsFoundLabel.should('be.visible').and('contain.text', 'No Records Found');
    this.directoryCards.should('not.exist');
  }

  assertEmployeeDetailVisible() {
    this.detailSheet.should('be.visible');
  }
}

export default new DirectoryPage();
