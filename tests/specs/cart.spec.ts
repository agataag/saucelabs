import { test } from '../fixtures/fixtures';
import { users, products } from '../data/testData';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.standard);
  });

  test('adding a product updates the cart badge and cart contents', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.expectCartCount(1);
    await inventoryPage.header.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemCount(1);
    await cartPage.expectItem(products.backpack);
  });

  test('adding multiple products is reflected in badge and cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.header.expectCartCount(3);
    await inventoryPage.header.openCart();
    await cartPage.expectItemCount(3);
    await cartPage.expectItem(products.backpack);
    await cartPage.expectItem(products.bikeLight);
    await cartPage.expectItem(products.boltTShirt);
  });

  test('cart shows the same price as the product list', async ({ inventoryPage, cartPage }) => {
    const listedPrice = await inventoryPage.getPrice(products.backpack);
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.expectItemPrice(products.backpack, listedPrice);
  });

  test('removing a product on the cart page empties it and clears the badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.removeItem(products.backpack);
    await cartPage.expectItemCount(0);
    await cartPage.header.expectCartEmpty();
  });

  test('removing one of several products keeps the others in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.header.openCart();
    await cartPage.removeItem(products.backpack);
    await cartPage.expectItemCount(1);
    await cartPage.expectItem(products.bikeLight);
    await cartPage.header.expectCartCount(1);
  });

  test('removing a product on the product list clears the badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.expectCartCount(1);
    await inventoryPage.removeFromCart(products.backpack);
    await inventoryPage.header.expectCartEmpty();
    await inventoryPage.header.openCart();
    await cartPage.expectItemCount(0);
  });

  test('continue shopping returns to the product list and keeps the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.openCart();
    await cartPage.continueShopping();
    await inventoryPage.expectLoaded();
    await inventoryPage.header.expectCartCount(1);
  });
});
