import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test as base } from '@playwright/test';
import path from 'path';

type TestFixtures = {
  electronApp: ElectronApplication;
  page: Page;
};

export const test = base.extend<TestFixtures>({
  electronApp: async ({ }, use) => {
    const electronApp = await electron.launch({
      args: [
        path.join(__dirname, '../../electron/main.js'),
        '--no-sandbox'
      ],
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    });
    
    await use(electronApp);
    await electronApp.close();
  },
  
  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  }
});

export { expect } from '@playwright/test';