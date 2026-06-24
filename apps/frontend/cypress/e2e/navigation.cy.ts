describe('Navigation', () => {
  beforeEach(() => {
    cy.mockWorkflowApi()
    cy.visit('/')
    cy.wait('@getWorkflow')
  })

  it('should show sidebar navigation icons', () => {
    cy.get('i.pi-home').should('be.visible')
    cy.get('i.pi-cog').should('be.visible')
  })

  it('should have expand toggle in sidebar', () => {
    cy.get('button[aria-label="Развернуть сайдбар"]').should('be.visible')
  })

  it('should show menu labels after expanding sidebar', () => {
    cy.get('button[aria-label="Развернуть сайдбар"]').click()
    cy.contains('Домашняя').should('be.visible')
    cy.contains('Настройки').should('be.visible')
  })

  it('should navigate to Settings page via sidebar icon', () => {
    cy.get('i.pi-cog').click()
    cy.url().should('include', '/settings')
    cy.contains('Settings Page').should('be.visible')
  })

  it('should show 404 page for unknown routes', () => {
    cy.visit('/non-existent-page')
    cy.contains('404').should('be.visible')
    cy.contains('Страница не найдена').should('be.visible')
  })
})
