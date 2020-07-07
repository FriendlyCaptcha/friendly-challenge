# Browser Support

## Supported browsers
All modern browsers are supported, on both mobile and desktop. That includes Safari, Edge, Chrome, Firefox, and Opera. For all of these browsers even very old versions (>8 years old) are supported, the fallback script has polyfills for these browsers.
<!-- 
```
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://unpkg.com/unfetch/polyfill"></script>
``` -->

If you are importing friendly-challenge into your own bundle and want to support old browsers (those that don't support ES2017) you should change your imports to be from `friendly-challenge/compat`. For example:

```
import {WidgetInstance} from 'friendly-challenge'
// would become
import {WidgetInstance} from 'friendly-challenge/compat'
```


### Internet Explorer
The FriendlyCaptcha widget does not support Internet Explorer out of the box.

Technically, no features are used that prevent use in IE 10 or 11, and I actually got it to work. The performance was however so bad that the CAPTCHA would take minutes to solve. IE does not support loading a background worker from a string or from a different host, so you would have to host the background worker script on your own server. This limitation as well as the awful user experience due to the slowness make FriendlyCaptcha a poor fit for internet explorer.

> If you really need to support IE users on your website I recommend you use a fallback alternative CAPTCHA (such as reCAPTCHA) for those users. Alternatively you can get in touch and I can guide you through how to compile friendly-challenge with support for IE.

## NoScript
Users need to have Javascript enabled to solve the CAPTCHA. I recommend you add a note for those users that have Javascript disabled by default:
```html
<noscript>You need Javascript for CAPTCHA verification to submit this form.</noscript>
```

This will only be visible to users without Javascript enabled.

