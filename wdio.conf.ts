// # Jalankan test
// npx wdio run wdio.conf.ts

// # Generate HTML dari hasil test
// allure generate allure-results --clean -o allure-report

// # Buka laporan HTML-nya
// allure open allure-report

import type { Options } from '@wdio/config';
import fs from 'fs';
import path from 'path';

export const config: Options.WebdriverIO = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': '12',
      'appium:deviceName': 'Android Device',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': 'RRCW403Q69W',
      'appium:appPackage': 'com.appsfoundry.scoop',
      'appium:appActivity': 'com.appsfoundry.scoop.presentation.main.MainActivity',
      'appium:noReset': true,
    },
  ],

  framework: 'mocha',
  services: ['appium'],

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],

  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },

  globals: true,

   /**
   * Hook sebelum setiap test suite
   * - Pastikan aplikasi ditutup dan dibuka ulang (fresh state)
   */
   beforeSuite: async function () {
    await driver.closeApp();
    await driver.launchApp();
  },

   /**
   * Screenshot setelah setiap test (baik sukses maupun gagal)
   */
   afterTest: async function (test, context, { error, passed }) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const status = passed ? 'SUCCESS' : 'ERROR';
    const safeTitle = test.title.replace(/\s+/g, '_');
    const filename = `${status}_${safeTitle}_${timestamp}.png`;
    const folderPath = path.join(__dirname, 'screenshots');
    const filePath = path.join(folderPath, filename);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    await browser.saveScreenshot(filePath);
    await browser.takeScreenshot(); // attach to Allure
    console.log(`📸 Screenshot saved: ${filePath}`);

    if (!passed) {
      console.error(`❌ Test failed: ${test.title}`);
      console.error(`📄 Error message: ${error?.message}`);
    }
  },

  /**
   * Generate & buka Allure report otomatis setelah test
   */
  onComplete: function () {
    const { spawnSync, spawn } = require('child_process');
  
    // Generate allure report
    const generate = spawnSync('npx', ['allure', 'generate', 'allure-results', '--clean'], {
      stdio: 'inherit',
      shell: true,
    });
  
    if (generate.status !== 0) {
      console.error('❌ Gagal generate allure report');
      return;
    }
  
    console.log('✅ Allure report berhasil digenerate');
  
    // Buka allure report di browser
    const open = spawn('npx', ['allure', 'open'], {
      stdio: 'inherit',
      shell: true,
    });
  
    open.on('error', (err) => {
      console.error('❌ Gagal membuka allure report:', err);
    });
  }
};