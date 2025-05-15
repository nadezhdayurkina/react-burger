///<reference types="cypress"/>

describe("burger app", () => {
  beforeEach(
    "корректно открывается домашняя страница и загружаются ингредиенты",
    () => {
      window.localStorage.setItem(
        "refreshToken",
        "Bearer YzMSwiZXhwIjoxNzQ3MjE0ODMxfQ.Q7Sk"
      );
      cy.intercept("GET", "/api/auth/user", { fixture: "auth" }).as("auth");
      cy.intercept("GET", "/api/ingredients", { fixture: "ingredients" }).as(
        "ingredients"
      );

      cy.visit("/");
      cy.wait(["@auth", "@ingredients"]);
      cy.get('[data-cy="ingredient-card"]').as("ingredientCard");
      cy.get("@ingredientCard", { timeout: 10000 }).should("exist");
      cy.get("@ingredientCard")
        .contains("Краторная булка N-200i")
        .as("ingredientCardBun");
      cy.get("@ingredientCard")
        .contains("Соус Spicy-X")
        .as("ingredientCardFilling");
      cy.get('[data-cy="ingredient-card-drop"]').as("ingredientCardDrop");
    }
  );

  it("открытие и закрытие модалки с деталями ингредиента", () => {
    cy.get("@ingredientCardBun").click();
    cy.get('[data-cy="ingredient-details"]').as("ingredientDetails");

    cy.get("@ingredientDetails").should("be.visible");
    cy.contains("Детали ингредиента");
    cy.get("@ingredientDetails").contains("Краторная булка N-200i");

    cy.get('[data-cy="modal-close-icon"]').click();
    cy.get("@ingredientDetails").should("not.exist");

    cy.get("@ingredientCardBun").click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get("@ingredientDetails").should("not.exist");
  });

  it("при перетаскивании булки в конструкторе появляются верхняя и нижняя булки", () => {
    cy.dragIngredient("@ingredientCardBun");
    cy.shouldExist('[data-cy="bun-top"]', '[data-cy="bun-bottom"]');
  });

  it("при перетаскивании начинки конструктор её отображает", () => {
    cy.dragIngredient("@ingredientCardFilling");
    cy.shouldExist('[data-cy="filling"]');
  });

  it("корректное создание заказа", () => {
    cy.dragIngredient("@ingredientCardBun");
    cy.dragIngredient("@ingredientCardFilling");
    cy.shouldExist(
      '[data-cy="bun-top"]',
      '[data-cy="bun-bottom"]',
      '[data-cy="filling"]'
    );

    cy.contains("Оформить заказ").click();
    cy.intercept("POST", "/api/orders", { fixture: "order" }).as("order");
    cy.contains("идентификатор заказа").should("exist");
  });
});
