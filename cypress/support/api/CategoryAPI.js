class CategoryAPI {
  constructor() {
    this.baseUrl = 'https://api.escuelajs.co/api/v1/categories';
  }

  /**
   * GET all categories or filter with query params
   * @param {Object} queryParams - Optional query parameters e.g. { limit: 5 }
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  getAllCategories(queryParams = {}) {
    return cy.request({
      method: 'GET',
      url: this.baseUrl,
      qs: queryParams,
      failOnStatusCode: false,
    });
  }

  /**
   * GET single category by ID
   * @param {number|string} id - Category ID
   * @param {boolean} failOnStatusCode - Whether to fail on non-2xx status code
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  getCategoryById(id, failOnStatusCode = false) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/${id}`,
      failOnStatusCode,
    });
  }

  /**
   * POST create a new category
   * @param {Object} categoryData - Payload containing name and image
   * @param {boolean} failOnStatusCode - Whether to fail on non-2xx status code
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  createCategory(categoryData, failOnStatusCode = false) {
    return cy.request({
      method: 'POST',
      url: this.baseUrl,
      body: categoryData,
      failOnStatusCode,
    });
  }

  /**
   * PUT update category by ID
   * @param {number|string} id - Category ID to update
   * @param {Object} updateData - Updated payload
   * @param {boolean} failOnStatusCode - Whether to fail on non-2xx status code
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  updateCategory(id, updateData, failOnStatusCode = false) {
    return cy.request({
      method: 'PUT',
      url: `${this.baseUrl}/${id}`,
      body: updateData,
      failOnStatusCode,
    });
  }

  /**
   * DELETE category by ID
   * @param {number|string} id - Category ID to delete
   * @param {boolean} failOnStatusCode - Whether to fail on non-2xx status code
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  deleteCategory(id, failOnStatusCode = false) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/${id}`,
      failOnStatusCode,
    });
  }

  /**
   * GET all products belonging to a specific category
   * @param {number|string} id - Category ID
   * @param {boolean} failOnStatusCode - Whether to fail on non-2xx status code
   * @returns {Cypress.Chainable<Cypress.Response>}
   */
  getProductsByCategory(id, failOnStatusCode = false) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/${id}/products`,
      failOnStatusCode,
    });
  }
}

export default new CategoryAPI();
