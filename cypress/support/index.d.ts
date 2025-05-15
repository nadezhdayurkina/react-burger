declare namespace Cypress {
  interface Chainable {
    shouldExist(...selectors: string[]): void;
    /**
     * Перетаскивает ингредиент в конструктор
     * @param ingredientAlias Алиас элемента для перетаскивания
     * @example cy.dragIngredient('@ingredientCardBun')
     */
    dragIngredient(ingredientAlias: string): Chainable<JQuery<HTMLElement>>;
    /**
     * Перетаскивает элемент в другой (плагин @4tw/cypress-drag-drop)
     * @example cy.get('.item').drag('.target')
     */
    drag(target: string | JQuery<HTMLElement>): Chainable<JQuery<HTMLElement>>;
  }
}
