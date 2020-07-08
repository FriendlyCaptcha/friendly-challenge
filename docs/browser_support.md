# Browser Support

## Supported browsers
All modern browsers are supported, on both mobile and desktop. That includes Safari, Edge, Chrome, Firefox, and Opera. It does not include Internet Explorer (see the *Internet Explorer* section below). See the targeted [**browserlist compatible browsers**](https://browserl.ist/?q=%22%3E0.05%25%22%2C+%22not+dead%22%2C+%22not+ie+11%22%2C+%22not+ie_mob+11%22).

For all of the above browsers even very old versions (>8 years old) are supported. You are responsible for adding the necessary polyfills for these browsers (`fetch`, `Promise`, and `URL`).

**Very old browser support is not thoroughly tested at this point**, if you find any issues please create a [**Github issue**](https://github.com/gzuidhof/friendly-challenge/issues). If you need to support very old browsers in production you should provide a fallback to a different CAPTCHA for now to be safe.

### Compatability mode for the library

If you are importing friendly-challenge into your own bundle and want to support old browsers (those that don't support ES2017) you should change your imports to be from `friendly-challenge/compat`. For example:

```
import {WidgetInstance} from 'friendly-challenge'
// should be
import {WidgetInstance} from 'friendly-challenge/compat'
```

Both imports are ES2017, so you should use a tool like Babel to transpile it to ES5 or below. The difference between these two imports is the webworker script which is included as a string in the source code, for the *compat* library it is ES5 compatible and includes necessary polyfills (at the cost of worse performance and an extra 3KB bundle size).

### Internet Explorer
The FriendlyCaptcha widget does not support Internet Explorer out of the box. Some notes:
* Technically, no features are used that prevent use in IE 10 or 11, and I got it to work.
* The performance was however so bad that the CAPTCHA would take minutes to solve.
* IE does not support loading a background worker from a string or from a different host, so you would have to host the background worker script on your own server, or you would need to run the worker synchronously which may freeze up the UI.

These limitations as well as the awful user experience due to the slowness make FriendlyCaptcha a poor fit for internet explorer.

> If you really need to support IE users on your website I recommend you use a fallback alternative CAPTCHA (such as reCAPTCHA) for those users. Alternatively you can get in touch and I can guide you through how to compile friendly-challenge with support for IE.

## NoScript
Users need to have Javascript enabled to solve the CAPTCHA. I recommend you add a note for those users that have Javascript disabled by default:
```html
<noscript>You need Javascript for CAPTCHA verification to submit this form.</noscript>
```

This will only be visible to users without Javascript enabled.

