import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutInfo } from '../data/testData';

/** Step 1 of checkout: "Checkout: Your Information". */
export class CheckoutInfoPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly title = this.page.locator('[data-test="title"]');
  readonly firstNameInput = this.page.getByPlaceholder('First Name');
  readonly lastNameInput = this.page.getByPlaceholder('Last Name');
  readonly postalCodeInput = this.page.getByPlaceholder('Zip/Postal Code');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly cancelButton = this.page.locator('[data-test="cancel"]');
  readonly errorMessage = this.page.locator('[data-test="error"]');

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.fillFirstName(info.firstName);
    await this.fillLastName(info.lastName);
    await this.fillPostalCode(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async expectErrorMessage(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}
