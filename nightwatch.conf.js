const chromedriver = require("chromedriver");

module.exports = {
    // An array of folders (excluding subfolders) where your tests are located;
    // if this is not specified, the test source must be passed as the second argument to the test runner.
    src_folders: ["test/e2e"],

    webdriver: {
      start_process: true,
      port: 4444,
      server_path: require('chromedriver').path,
      cli_args: [
        // very verbose geckodriver logs
        // '-vv'
      ]
    },
  
    test_settings: {
      default: {
        // launch_url: 'http://localhost:8080',
        desiredCapabilities : {
          browserName : 'chrome',
        //   alwaysMatch: {
        //     // Enable this if you encounter unexpected SSL certificate errors in Firefox
        //     // acceptInsecureCerts: true,
        //   }
        }
      }
    }
  };