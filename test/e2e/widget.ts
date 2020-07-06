import { NightwatchBrowser } from 'nightwatch';

module.exports = {
    'FriendlyCaptcha widget works in the happy case' : function (client: NightwatchBrowser) {
        client
        .url('localhost:8080/dist/index.html')
        .waitForElementVisible("body")
        .assert.elementPresent(".frc-captcha")
        .waitForElementVisible(".frc-content")
        .assert.titleContains('FriendlyCaptcha')
        .assert.elementPresent("input[name=frc-captcha-solution]")
        .assert.value("input[name=frc-captcha-solution]", ".UNSTARTED")

        // Trigger the solve
        .click('.frc-button')
        .waitForElementVisible(".frc-progress")
        .assert.value("input[name=frc-captcha-solution]", ".UNFINISHED")
        .assert.elementNotPresent(".frc-button")
        
        // Wait for done
        .waitForElementNotPresent(".frc-progress")
        .assert.containsText('.frc-text', 'I\'m not a robot')
        .getAttribute(".frc-text", "title", function(s){console.log(s.value)}) 
        .expect.element("input[name=frc-captcha-solution]").value.to.match(/[a-f0-9]{32}\.[a-zA-Z0-9/+=]*\.[a-zA-Z0-9/+=]*\.[a-zA-Z0-9/+=]{4}/)
        .assert.elementPresent("#frc-captcha-done-callback-generated-element")
        // .end()
    }
};
