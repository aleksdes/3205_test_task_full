describe('User menu', () => {
  beforeEach(() => {
    cy.mockWorkflowApi()
    cy.visit('/')
    cy.wait('@getWorkflow')
  })

  it('should show user avatar', () => {
    cy.get('.p-avatar').should('be.visible')
  })

  it('should open drawer with user info on avatar click', () => {
    cy.get('.p-avatar').first().click()
    cy.get('.p-drawer').should('be.visible')
    cy.contains('Алексей Валерьевич').should('be.visible')
  })

  it('should show login in drawer description', () => {
    cy.get('.p-avatar').first().click()
    cy.get('.p-drawer').should('be.visible')
    cy.contains('a.kiselev').should('be.visible')
  })

  it('should show logout button in drawer', () => {
    cy.get('.p-avatar').first().click()
    cy.get('.p-drawer').should('be.visible')
    cy.contains('button', 'Выйти').should('be.visible')
  })

  it('should close drawer on close button', () => {
    cy.get('.p-avatar').first().click()
    cy.get('.p-drawer').should('be.visible')

    cy.get('.p-drawer-header').within(() => {
      cy.get('button').click()
    })
    cy.get('.p-drawer').should('not.exist')
  })
})
