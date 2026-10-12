import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly title = this.page.locator('[data-test="title"]');
  readonly items = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');

  /** The cart row with the given product name. */
  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async getItemPrice(name: string): Promise<number> {
    const text = await this.item(name).locator('[data-test="inventory-item-price"]').innerText();
    return parsePrice(text);
  }

  async removeItem(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  // ── Assertions ──

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async expectItem(name: string): Promise<void> {
    await expect(this.item(name)).toBeVisible();
  }

  async expectItemPrice(name: string, price: number): Promise<void> {
    expect(await this.getItemPrice(name)).toBeCloseTo(price, 2);
  }
}
