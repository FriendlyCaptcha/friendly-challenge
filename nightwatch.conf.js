const nightwatchConfig = {
  src_folders: ["test/e2e"],
  selenium : {
    "start_process" : false,
    "host" : "hub-cloud.browserstack.com",
    "port" : 80
  },

  test_settings: {
    default: {
      globals: {
        "waitForConditionTimeout": 20000
      },
      desiredCapabilities: {
        'browserstack.user': 'guidozuidhof1',
        'browserstack.key': 'WwE8ciGuuwJfVi4Ri4nK',
        'browser': 'chrome',
        'name': 'Bstack-[Nightwatch] Sample Test'
      }
    }
  }
};

// Code to copy seleniumhost/port into test settings
for(var i in nightwatchConfig.test_settings){
  var config = nightwatchConfig.test_settings[i];
  config['selenium_host'] = nightwatchConfig.selenium.host;
  config['selenium_port'] = nightwatchConfig.selenium.port;
}

module.exports = nightwatchConfig;