import { test } from '../fixtures/fixtures';
import { users, checkoutInfo, products } from '../data/testData';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.standard);
  });

  test('user can complete the full checkout flow for a product', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    const itemPrice = await inventoryPage.getPrice(products.backpack);

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.expectItem(products.backpack);
    await cartPage.checkout();
    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.fillInfo(checkoutInfo);
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectItemCount(1);
    await checkoutOverviewPage.expectSubtotal(itemPrice);
    await checkoutOverviewPage.expectTotalAddsUp();

    await checkoutOverviewPage.finish();

    await checkoutCompletePage.expectOrderPlaced();
    await checkoutCompletePage.header.expectCartEmpty();
  });

  test('subtotal equals the sum of item prices for multiple products', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    const backpackPrice = await inventoryPage.getPrice(products.backpack);
    const bikeLightPrice = await inventoryPage.getPrice(products.bikeLight);

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInfoPage.fillInfo(checkoutInfo);
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.expectSubtotal(backpackPrice + bikeLightPrice);
  });

  test.describe('information form validation', () => {
    test.beforeEach(async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCart(products.backpack);
      await inventoryPage.header.openCart();
      await cartPage.checkout();
    });

    test('requires a first name', async ({ checkoutInfoPage }) => {
      await checkoutInfoPage.continue();

      await checkoutInfoPage.expectErrorMessage('First Name is required');
      await checkoutInfoPage.expectLoaded();
    });

    test('requires a postal code', async ({ checkoutInfoPage }) => {
      await checkoutInfoPage.fillFirstName(checkoutInfo.firstName);
      await checkoutInfoPage.fillLastName(checkoutInfo.lastName);
      await checkoutInfoPage.continue();

      await checkoutInfoPage.expectErrorMessage('Postal Code is required');
    });
  });
});
