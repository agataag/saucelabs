import { test } from '../fixtures/fixtures';
import { users } from '../data/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and lands on the inventory page', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAs(users.standard);
    await inventoryPage.expectLoaded();
  });

  test('user can log out and is returned to the login page', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAs(users.standard);
    await inventoryPage.header.logout();
    await loginPage.expectLoaded();
  });

  test('shows an error for a wrong password', async ({ loginPage }) => {
    await loginPage.loginAs(users.wrongPassword);
    await loginPage.expectErrorMessage('Username and password do not match any user in this service');
    await loginPage.expectLoaded();
  });

  test('shows an error for a locked out user', async ({ loginPage }) => {
    await loginPage.loginAs(users.lockedOut);
    await loginPage.expectErrorMessage('Sorry, this user has been locked out.');
  });

  test('shows an error when username is empty', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await loginPage.expectErrorMessage('Username is required');
  });

  test('unauthenticated user cannot open the inventory page directly', async ({ loginPage, inventoryPage }) => {
    await inventoryPage.goto();
    await loginPage.expectErrorMessage(/only access .* when you are logged in/i);
    await loginPage.expectLoaded();
  });
});
