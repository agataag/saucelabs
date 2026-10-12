export type User = { username: string; password: string };
export type CheckoutInfo = { firstName: string; lastName: string; postalCode: string };

const password = process.env.SAUCE_PASSWORD || 'secret_sauce';

/** SauceDemo's public test accounts (listed on its login page). */
export const users = {
  standard: { username: process.env.SAUCE_USERNAME || 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
  wrongPassword: { username: 'standard_user', password: 'definitely_wrong_password' },
} satisfies Record<string, User>;

export const checkoutInfo: CheckoutInfo = {
  firstName: 'Agata',
  lastName: 'Tester',
  postalCode: '00-001',
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;
