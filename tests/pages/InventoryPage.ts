import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly title = this.page.locator('[data-test="title"]');
  readonly items = this.page.locator('[data-test="inventory-item"]');
  readonly sortSelect = this.page.locator('[data-test="product-sort-container"]');

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async getPrice(name: string): Promise<number> {
    const text = await this.item(name).locator('[data-test="inventory-item-price"]').innerText();
    return parsePrice(text);
  }

  async addToCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
    await expect(this.items.first()).toBeVisible();
  }
}
