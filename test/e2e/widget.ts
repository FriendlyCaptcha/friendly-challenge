import { NightwatchBrowser } from 'nightwatch';

module.exports = {
    'FriendlyCaptcha widget works in the happy case' : function (client: NightwatchBrowser) {
        client
        .url('https://unpkg.com/friendly-challenge@0.2.0/index.html')
        .waitForElementVisible("body")
        .assert.elementPresent(".frc-captcha")
        .waitForElementVisible(".frc-content")
        .assert.titleContains('FriendlyCaptcha')
        .assert.elementPresent("input[name=frc-captcha-solution]")
        .expect.element("input[name=frc-captcha-solution]").value.to.equal(".UNSTARTED");
    
        // Trigger the solve
        client
        .click('.frc-button')
        .waitForElementVisible(".frc-progress")
        // .assert.value("input[name=frc-captcha-solution]", ".UNFINISHED")
        .assert.elementNotPresent(".frc-button")
        
        // Wait for done
        .waitForElementNotPresent(".frc-progress")
        .assert.containsText('.frc-text', 'I am human')
        .getAttribute(".frc-text", "title", function(s){console.log(s.value);}) 
        .assert.elementPresent("#frc-captcha-done-callback-generated-element")
        .expect.element("input[name=frc-captcha-solution]").value.to.match(/[a-f0-9]{32}\.[a-zA-Z0-9/+=]*\.[a-zA-Z0-9/+=]*\.[a-zA-Z0-9/+=]{4}/);
        
        client.end();
    }
};
