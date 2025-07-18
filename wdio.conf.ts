export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/specs/**/*.ts'],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': '12',
      'appium:deviceName': 'Android Device',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': 'RRCW403Q69W', // ganti dengan udid device kamu
      'appium:appPackage': 'appsfoundry',
      'appium:appActivity': '.MainActivity',
      'appium:noReset': true,
    },
  ],
  framework: 'mocha',
  services: ['appium'],
  reporters: ['spec'],
  mochaOpts: {
    timeout: 60000,
  },
}