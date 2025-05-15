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

      cy.visit("http://localhost:5173/");
      cy.wait(["@auth", "@ingredients"]);
      cy.get('[data-cy="ingredient-card"]', { timeout: 10000 }).should(
        "have.length.gte",
        1
      );
    }
  );

  it("открытие и закрытие модалки с деталями ингредиента", () => {
    cy.get('[data-cy="ingredient-card"]', { timeout: 10000 }).should("exist");

    cy.get('[data-cy="ingredient-card"]')
      .contains("Краторная булка N-200i")
      .click();
    cy.get('[data-cy="ingredient-details"]').should("be.visible");
    cy.contains("Детали ингридиента");

    cy.get('[data-cy="ingredient-details"]').contains("Краторная булка N-200i");
    cy.get('[data-cy="modal-close-icon"]').click();
    cy.get('[data-cy="ingredient-details"]').should("not.exist");

    cy.get('[data-cy="ingredient-card"]')
      .contains("Краторная булка N-200i")
      .click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="ingredient-details"]').should("not.exist");
  });

  it("при перетаскивании булки в конструкторе появляются верхняя и нижняя булки", () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains("Краторная булка N-200i")
      .drag('[data-cy="ingredient-card-drop"]');
    cy.get('[data-cy="bun-top"]').should("exist");
    cy.get('[data-cy="bun-bottom"]').should("exist");
  });

  it("при перетаскивании начинки конструктор её отображает", () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains("Соус Spicy-X")
      .drag('[data-cy="ingredient-card-drop"]');
    cy.get('[data-cy="filling"]').should("exist");
  });

  it("корректное создание заказа", () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains("Краторная булка N-200i")
      .drag('[data-cy="ingredient-card-drop"]');
    cy.get('[data-cy="bun-top"]').should("exist");
    cy.get('[data-cy="bun-bottom"]').should("exist");
    cy.get('[data-cy="ingredient-card"]')
      .contains("Соус Spicy-X")
      .drag('[data-cy="ingredient-card-drop"]');
    cy.get('[data-cy="filling"]').should("exist");
    cy.contains("Оформить заказ").click();

    cy.intercept("POST", "/api/orders", { fixture: "order" }).as("order");
    cy.contains("идентификатор заказа").should("exist");
  });
});
