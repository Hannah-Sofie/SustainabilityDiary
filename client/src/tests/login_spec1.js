/* global cy */

describe("Login Page", () => {
  it("allows a user to log in", () => {
    cy.visit("/login"); // Adjust the URL as necessary

    cy.get('input[name="email"]').type("user@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Assuming successful login redirects to a dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, user@example.com"); // Verify the dashboard contains a welcome message or similar indication of a successful login
  });
});
