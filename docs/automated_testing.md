# Automated Testing

Testing can be at odds with a captcha you add to your website or app. Perhaps you use automated testing tools like [Cypress](https://www.cypress.io/), [Selenium](https://www.selenium.dev/), or [Puppeteer](https://github.com/puppeteer/puppeteer). On this page you will find some tips and approaches that will help work out a testing story for pages that include a captcha widget.

## Testing tips

### Mocking out the API
The easiest and most recommended approach is to mock out the API in the backend. Instead of calling our API and getting the JSON response, you instead always use `{success: true}` when running in test mode. With this approach you can keep all other code in your application the same.

### IP or password-based gating
If you perform automated end-to-end tests in production you may want to conditionally disable the captcha check for your test-runner.
* If you know the IPs of the machines that run these tests you could whitelist those and skip the captcha check for those (or use the mocking approach above).
* If you do not know the IP beforehand, you could have your test-runner put a secret in the form submission that you check for. In other words, you can specify a password that bypasses the captcha.

### Dynamic button enabling
Many websites that have a form protected using Friendly Captcha will only enable the submit button after the captcha widget is finished to prevent users from submitting without a valid captcha solution. When you are using a browser automation tool you may want to enable the button despite the captcha not being completed, we advice you achieve this by executing a snippet of Javascript (which is something you can do in all browser testing automation tools).


Here's an example such snippet:
```javascript
const button = document.querySelector("#my-button");
button.disabled = false;
```
