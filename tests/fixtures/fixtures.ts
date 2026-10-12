import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

type PageObjects = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<PageObjects>({
  loginPage: ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: ({ page }, use) => use(new InventoryPage(page)),
  cartPage: ({ page }, use) => use(new CartPage(page)),
  checkoutInfoPage: ({ page }, use) => use(new CheckoutInfoPage(page)),
  checkoutOverviewPage: ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: ({ page }, use) => use(new CheckoutCompletePage(page)),
});

export { expect } from '@playwright/test';
