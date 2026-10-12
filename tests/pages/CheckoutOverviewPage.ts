import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly title = this.page.locator('[data-test="title"]');
  readonly items = this.page.locator('[data-test="inventory-item"]');
  readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  readonly totalLabel = this.page.locator('[data-test="total-label"]');
  readonly finishButton = this.page.locator('[data-test="finish"]');

  async getSummary(): Promise<{ subtotal: number; tax: number; total: number }> {
    return {
      subtotal: parsePrice(await this.subtotalLabel.innerText()),
      tax: parsePrice(await this.taxLabel.innerText()),
      total: parsePrice(await this.totalLabel.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async expectSubtotal(expected: number): Promise<void> {
    const { subtotal } = await this.getSummary();
    expect(subtotal).toBeCloseTo(expected, 2);
  }

  async expectTotalAddsUp(): Promise<void> {
    const { subtotal, tax, total } = await this.getSummary();
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }
}
