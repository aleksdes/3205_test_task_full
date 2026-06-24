describe('App initialization', () => {
  beforeEach(() => {
    cy.mockWorkflowApi()
    cy.visit('/')
    cy.wait('@getWorkflow')
  })

  it('should load the page and render app container', () => {
    cy.get('#app').should('exist')
  })

  it('should show main content after init', () => {
    cy.contains('Структура рабочего процесса').should('be.visible')
  })

  it('should display workflow steps in table', () => {
    cy.get('table').should('be.visible')
    cy.contains('Закупка').should('be.visible')
  })
})
