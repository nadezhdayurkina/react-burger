declare namespace Cypress {
  interface Chainable {
    /**
     * Перетаскивает элемент в другой (плагин @4tw/cypress-drag-drop)
     * @example cy.get('.item').drag('.target')
     */
    drag(target: string | JQuery<HTMLElement>): Chainable<JQuery<HTMLElement>>;
  }
}
