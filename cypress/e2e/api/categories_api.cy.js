import categoryAPI from '../../support/api/CategoryAPI';

describe('Platzi Fake Store API - Categories Test Suite', () => {
  let testData;
  let createdCategoryId;

  before(() => {
    cy.fixture('categoryData').then((data) => {
      testData = data;
    });
  });

  // =========================================================================
  // 1. GET ALL CATEGORIES
  // =========================================================================
  it('TC-01-API [GET]: Should successfully retrieve all categories with status 200', () => {
    categoryAPI.getAllCategories().then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(200);

      // Response Body Assertions
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      // Verify schema and values of the first category object
      const firstCategory = response.body[0];
      expect(firstCategory).to.have.property('id').that.is.a('number');
      expect(firstCategory).to.have.property('name').that.is.a('string');
      expect(firstCategory).to.have.property('image').that.is.a('string');
      expect(firstCategory).to.have.property('creationAt').that.is.a('string');
      expect(firstCategory).to.have.property('updatedAt').that.is.a('string');
    });
  });

  // =========================================================================
  // 2. GET CATEGORIES WITH QUERY PARAMETER (LIMIT)
  // =========================================================================
  it('TC-02-API [GET]: Should retrieve limited categories using limit query parameter', () => {
    const limit = 3;
    categoryAPI.getAllCategories({ limit }).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(200);

      // Response Body Assertions
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(limit);
      response.body.forEach((category) => {
        expect(category).to.have.property('id').that.is.a('number');
        expect(category).to.have.property('name').that.is.a('string');
      });
    });
  });

  // =========================================================================
  // 3. GET SINGLE CATEGORY BY VALID ID
  // =========================================================================
  it('TC-03-API [GET]: Should successfully retrieve single category by valid ID', () => {
    const categoryId = testData.defaultCategoryId || 1;
    categoryAPI.getCategoryById(categoryId).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(200);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(categoryId);
      expect(response.body.name).to.be.a('string').and.not.be.empty;
      expect(response.body.image).to.be.a('string').and.include('http');
    });
  });

  // =========================================================================
  // 4. GET CATEGORY WITH NON-EXISTENT ID (NEGATIVE)
  // =========================================================================
  it('TC-04-API [GET]: Should return 400 when requesting non-existent category ID', () => {
    categoryAPI.getCategoryById(testData.nonExistentId).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.equal('EntityNotFoundError');
      expect(response.body.message).to.include('Could not find any entity of type "Category"');
    });
  });

  // =========================================================================
  // 5. GET CATEGORY WITH INVALID ID FORMAT (NEGATIVE)
  // =========================================================================
  it('TC-05-API [GET]: Should return 400 Bad Request when ID is not a numeric string', () => {
    categoryAPI.getCategoryById(testData.invalidStringId).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('Bad Request');
      expect(response.body.message).to.equal('Validation failed (numeric string is expected)');
      expect(response.body.statusCode).to.equal(400);
    });
  });

  // =========================================================================
  // 6. POST CREATE CATEGORY (POSITIVE)
  // =========================================================================
  it('TC-06-API [POST]: Should successfully create a new category with valid payload', () => {
    const newCategoryPayload = {
      name: `${testData.validCategory.name} - ${Date.now()}`,
      image: testData.validCategory.image,
    };

    categoryAPI.createCategory(newCategoryPayload).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(201);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('id').that.is.a('number');
      expect(response.body.name).to.equal(newCategoryPayload.name);
      expect(response.body.image).to.equal(newCategoryPayload.image);
      expect(response.body).to.have.property('creationAt');
      expect(response.body).to.have.property('updatedAt');

      // Store created ID for subsequent tests
      createdCategoryId = response.body.id;
    });
  });

  // =========================================================================
  // 7. POST CREATE CATEGORY WITH EMPTY FIELDS (NEGATIVE)
  // =========================================================================
  it('TC-07-API [POST]: Should return 400 when creating category with empty required fields', () => {
    categoryAPI.createCategory(testData.invalidCategoryEmpty).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('Bad Request');
      expect(response.body.statusCode).to.equal(400);
      expect(response.body.message).to.be.an('array');
      expect(response.body.message).to.include('name should not be empty');
      expect(response.body.message).to.include('image should not be empty');
    });
  });

  // =========================================================================
  // 8. POST CREATE CATEGORY WITH INVALID IMAGE URL FORMAT (NEGATIVE)
  // =========================================================================
  it('TC-08-API [POST]: Should return 400 when creating category with invalid image URL format', () => {
    categoryAPI.createCategory(testData.invalidImageUrl).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('Bad Request');
      expect(response.body.statusCode).to.equal(400);
      expect(response.body.message).to.be.an('array');
      expect(response.body.message).to.include('image must be a URL address');
    });
  });

  // =========================================================================
  // 9. PUT UPDATE EXISTING CATEGORY (POSITIVE)
  // =========================================================================
  it('TC-09-API [PUT]: Should successfully update existing category name and image', () => {
    // Ensure we have a category ID to update
    const targetId = createdCategoryId || 1;
    const updatePayload = {
      name: `${testData.updatedCategory.name} - ${Date.now()}`,
      image: testData.updatedCategory.image,
    };

    categoryAPI.updateCategory(targetId, updatePayload).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(200);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.equal(targetId);
      expect(response.body.name).to.equal(updatePayload.name);
      expect(response.body.image).to.equal(updatePayload.image);
    });
  });

  // =========================================================================
  // 10. PUT UPDATE CATEGORY WITH NON-EXISTENT ID (NEGATIVE)
  // =========================================================================
  it('TC-10-API [PUT]: Should return 400 when updating non-existent category ID', () => {
    const updatePayload = {
      name: 'Non Existent Update Category',
    };

    categoryAPI.updateCategory(testData.nonExistentId, updatePayload).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.equal('EntityNotFoundError');
      expect(response.body.message).to.include('Could not find any entity of type "Category"');
    });
  });

  // =========================================================================
  // 11. GET PRODUCTS BY CATEGORY ID (POSITIVE)
  // =========================================================================
  it('TC-11-API [GET]: Should successfully retrieve products by category ID', () => {
    const categoryId = testData.defaultCategoryId || 1;
    categoryAPI.getProductsByCategory(categoryId).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(200);

      // Response Body Assertions
      expect(response.body).to.be.an('array');
      if (response.body.length > 0) {
        const firstProduct = response.body[0];
        expect(firstProduct).to.have.property('id').that.is.a('number');
        expect(firstProduct).to.have.property('title').that.is.a('string');
        expect(firstProduct).to.have.property('price').that.is.a('number');
        expect(firstProduct).to.have.property('category');
        expect(firstProduct.category.id).to.equal(categoryId);
      }
    });
  });

  // =========================================================================
  // 12. DELETE CATEGORY BY ID (POSITIVE)
  // =========================================================================
  it('TC-12-API [DELETE]: Should successfully delete an existing category', () => {
    // If createdCategoryId exists, delete it. Otherwise create a temporary one to delete safely.
    const executeDelete = (idToDelete) => {
      categoryAPI.deleteCategory(idToDelete).then((response) => {
        // Status Code Assertion
        expect(response.status).to.equal(200);

        // Response Body Assertion
        expect(String(response.body)).to.equal('true');
      });
    };

    if (createdCategoryId) {
      executeDelete(createdCategoryId);
    } else {
      const tempCategory = {
        name: `Temp Cat To Delete - ${Date.now()}`,
        image: testData.validCategory.image,
      };
      categoryAPI.createCategory(tempCategory).then((createRes) => {
        expect(createRes.status).to.equal(201);
        executeDelete(createRes.body.id);
      });
    }
  });

  // =========================================================================
  // 13. DELETE CATEGORY WITH NON-EXISTENT ID (NEGATIVE - BONUS)
  // =========================================================================
  it('TC-13-API [DELETE]: Should return 400 when attempting to delete non-existent category ID', () => {
    categoryAPI.deleteCategory(testData.nonExistentId).then((response) => {
      // Status Code Assertion
      expect(response.status).to.equal(400);

      // Response Body Assertions
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.equal('EntityNotFoundError');
      expect(response.body.message).to.include('Could not find any entity of type "Category"');
    });
  });
});
