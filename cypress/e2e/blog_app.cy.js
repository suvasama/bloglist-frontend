describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Kalle Kirjoittaja',
      username: 'kkirj',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('log in').click()
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('kkirj')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Kalle Kirjoittaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('kkirj')
      cy.get('#password').type('vaarasalasana')
      cy.get('#login-button').click()

      cy.get('#notification').should('contain', 'Wrong username or password')
      cy.get('#notification').should('not.contain', 'Kalle Kirjoittaja logged in')
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('kkirj')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('new blog').click()

      cy.get('#blog-title').type('Kallen oma blogi')
      cy.get('#blog-author').type('Kalle Kirjoittaja')
      cy.get('#blog-url').type('https://www.kallenomablogi.fi')

      cy.get('#create-blog').click()
    })

    it('A blog can be created', function() {
      cy.contains('Kallen oma blogi Kalle Kirjoittaja')
    })

    it('user can like a blog', function() {
      cy.contains('likes 0')
      cy.contains('view').click()
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })

    it('the blog creator sees the remove button', function() {
      cy.get('#remove-blog').should('not.have.css', 'display', 'none')
    })

    it('another user does not see the remove button', function() {
      const user = {
        name: 'Bertta Blogisti',
        username: 'bblog',
        password: 'salasana'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)

      cy.get('#logout-button').click()

      cy.contains('log in').click()
      cy.get('#username').type('bblog')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.get('#remove-blog').should('have.css', 'display', 'none')
    })

    it('the blogs are ordered by the number of likes in descending order', function() {
      cy.contains('view').click()
      cy.get('#like-button').click()

      cy.get('#new-blog-button').click()

      cy.get('#blog-title').type('Kallen toinen blogi')
      cy.get('#blog-author').type('Kalle Kirjoittaja')
      cy.get('#blog-url').type('https://www.kallentoinenblogi.fi')

      cy.get('#create-blog').click()

      cy.get('.blog').eq(0).should('contain', 'Kallen oma blogi')
      cy.get('.blog').eq(1).should('contain', 'Kallen toinen blogi')
    })
  })
})