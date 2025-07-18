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
   * Hook sesudah setiap test
   * - Jika gagal, ambil screenshot + simpan ke allure
   */
  afterTest: async function (test, context, { error, passed }) {
    if (!passed) {
      console.log('❌ Test failed:', test.title);
      console.log('📄 Error message:', error?.message);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ERROR_${test.title.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filePath = path.join('./errorShots', filename);

      // Buat folder jika belum ada
      if (!fs.existsSync('./errorShots')) {
        fs.mkdirSync('./errorShots');
      }

      await browser.saveScreenshot(filePath);
      await browser.takeScreenshot(); // untuk Allure
    }
  },

  /**
   * Setelah semua test selesai, generate Allure report otomatis
   */
  onComplete: function () {
    const generate = require('child_process').spawnSync('npx', ['allure', 'generate', 'allure-results', '--clean']);
    if (generate.status !== 0) {
      console.error('❌ Failed to generate Allure Report');
      console.error(generate.stderr.toString());
      return;
    }

    console.log('✅ Allure report generated successfully');
    require('child_process').spawn('npx', ['allure', 'open'], {
      stdio: 'inherit',
      shell: true
    });
  },
};