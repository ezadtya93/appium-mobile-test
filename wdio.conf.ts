import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
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
      'appium:appActivity': 'com.appsfoundry.scoop/com.appsfoundry.scoop.presentation.main.MainActivity',
      'appium:noReset': true,
    },
  ],
  framework: 'mocha',
  services: ['appium'],
  reporters: ['spec'],
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json',
    },
  },
  globals: true, // aktifkan globals agar `$`, `browser` dikenali

  afterTest: async function (test, context, { error, passed }) {
    if (!passed) {
      console.log('❌ Test failed:', test.title);
      console.log('📄 Error message:', error?.message);
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ERROR_${test.title.replace(/\s+/g, '_')}_${timestamp}.png`;
      await browser.saveScreenshot(`./errorShots/${filename}`);
    }
  }
};
