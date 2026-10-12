# SauceDemo E2E

End-to-end tests for [saucedemo.com](https://www.saucedemo.com) written in **TypeScript + Playwright**,
organised with the **Page Object Model**.

## Quick start

Requires Node.js 18+ (20 LTS recommended).

```bash
npm install   # installs dependencies and downloads Chromium (postinstall hook)
npm test      # runs the whole suite headlessly
```

No `.env` is needed. The suite uses SauceDemo's public demo account
(`standard_user` / `secret_sauce`).

Other commands:

```bash
npm run test:headed                              # watch the browser
npm run test:ui                                  # Playwright UI mode
npm run test:report                              # open the HTML report of the last run
npx playwright test tests/specs/login.spec.ts    # a single spec
```

## What is tested

| Spec | Scenarios |
|---|---|
| `login.spec.ts` | login, logout, wrong password, locked-out user, empty username, direct URL access without login |
| `cart.spec.ts` | add one product, add several products, cart price matches the listing, remove on the cart page, remove one of several, remove on the product list, continue shopping keeps the cart |
| `checkout.spec.ts` | full purchase flow (login → cart → checkout → confirmation) with price verification, multi-item subtotal, required first name, required postal code |

## Project structure

```
tests/
├── components/
│   └── Header.ts              # top bar shared by all pages: cart link, badge, logout
├── pages/                     # one page object per screen
│   ├── BasePage.ts            # page + header + goto() built from the page's `path`
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInfoPage.ts
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
├── data/
│   └── testData.ts            # users, product names, checkout form data
├── fixtures/
│   └── fixtures.ts            # injects page objects into tests
├── utils/
│   └── price.ts               # "$29.99" -> 29.99
└── specs/
    ├── login.spec.ts
    ├── cart.spec.ts
    └── checkout.spec.ts
```

## How the Page Object Model is applied

- **One class per screen.** Each page object declares its `path` and its locators as
  `readonly` fields, plus a few action methods (`addToCart`, `checkout`, `fillInfo`...).
- **Shared UI lives in a component.** The cart icon, badge and burger menu appear on every
  page, so they sit in `Header` and are reachable from any page as `somePage.header`.
- **Assertions are page-object methods.** Each page object exposes `expect...` methods
  (`expectLoaded`, `expectItemCount`, `expectErrorMessage`...). Specs read as plain steps:
  `await cartPage.expectItemCount(1)`, and the Playwright `expect` calls live next to the locators.
- **Page objects arrive as fixtures.** Destructure what you need:
  `test('...', async ({ loginPage, cartPage }) => { ... })`.
- **Locator strategy.** User-facing locators (`getByRole`, `getByPlaceholder`) where
  possible, SauceDemo's stable `data-test` attributes otherwise.

Example test:

```ts
test('adding a product updates the cart badge', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.header.expectCartCount(1);

  await inventoryPage.header.openCart();
  await cartPage.expectItem(products.backpack);
});
```

## Adding a new page object

1. Create `tests/pages/MyPage.ts` extending `BasePage`. Set `protected readonly path`
   and declare locators as `readonly` fields using `this.page`.
2. Register it in `tests/fixtures/fixtures.ts` (the `PageObjects` type and `test.extend`).
3. Use it in a spec: `async ({ myPage }) => { ... }`.

## Configuration

Copy `.env.example` to `.env` to override defaults. All variables are optional.

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Target base URL |
| `SAUCE_USERNAME` | `standard_user` | Username for the happy-path user |
| `SAUCE_PASSWORD` | `secret_sauce` | Password for the test users |

`playwright.config.ts` runs Chromium only, keeps a trace on first retry, and saves a
screenshot and video on failure. An HTML report is generated on every run.

## CI (GitHub Actions)

```yaml
name: E2E Tests
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci                                 # postinstall downloads Chromium
      - run: npx playwright install-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```
