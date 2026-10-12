import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Final checkout screen: "Thank you for your order!". */
export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';

  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  async expectOrderPlaced(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
