# Browser Support

All modern browsers are supported, on both mobile and desktop, all releases up to at least 8 years old. That includes Safari, Edge, Chrome, Firefox, and Opera. It does not include Internet Explorer (see the *Internet Explorer* section below). See the targeted [**browserlist compatible browsers**](https://browserl.ist/?q=%22since+2013%22%2C+%22not+dead%22%2C+%22not+ie+%3C%3D+11%22%2C+%22not+ie_mob+%3C%3D+11%22).

## Polyfills

If you want to support browsers over 4 years old, you will need some polyfills (`fetch`, `Promise`, `URL` and `Object.assign`).

You can use the build that includes the polyfills:
```html
<!-- from unpkg -->
<script type="module" src="https://unpkg.com/friendly-challenge@0.6.0/widget.module.min.js" async defer></script>
<script nomodule src="https://unpkg.com/friendly-challenge@0.6.0/widget.polyfilled.min.js" async defer></script>

<!-- OR from jsdelivr -->
<script type="module" src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.6.0/dist/widget.module.min.js" async defer></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.6.0/dist/widget.polyfilled.min.js" async defer></script>
```

Or you can include the polyfills manually:
```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/url-polyfill@1.1.9/url-polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.1.0"></script>
<script src="https://cdn.jsdelivr.net/npm/object-assign-polyfill@0.1.0"></script>
```


If you find any compatability issues please create a [**Github issue**](https://github.com/gzuidhof/friendly-challenge/issues).

## Compatability mode for the library

If you are importing *friendly-challenge* into your own bundle and want to support old browsers (those that don't support ES2017) you should change your imports to be from `friendly-challenge/compat`. For example:

```
import {WidgetInstance} from 'friendly-challenge'
// change to
import {WidgetInstance} from 'friendly-challenge/compat'
```

Both imports are ES2017, use a tool like Babel to transpile it to ES5 or lower. The difference between these two imports is the webworker script which is included as a string. In the *compat* build it is ES5 compatible and includes necessary polyfills (at the cost of slighlty worse performance and an extra 3KB bundle size).

### Old browser speed
The Javascript engine in old browsers is generally slower than modern ones, the CAPTCHA may take a minute to solve on very old browsers (>5 years old).

## Internet Explorer
The FriendlyCaptcha widget does not support Internet Explorer out of the box. Some notes:
* Technically, no features are used that prevent use in IE 10 or 11, it does work.
* The issue is that you need to host the background worker script on your own domain as it can't be created from a string.

This limitation makes it more tricky to integrate, you will need to compile the *friendly-challenge* library yourself and make some modifications.
> If you really need to support IE users on your website I recommend you use a fallback alternative CAPTCHA (such as reCAPTCHA) for those users. Alternatively, if you are a paying user, you can get in touch and I can guide you through how to compile friendly-challenge with support for IE.

## NoScript
Users need to have Javascript enabled to solve the CAPTCHA. I recommend you add a note for those users that have Javascript disabled by default:
```html
<noscript>You need Javascript for CAPTCHA verification to submit this form.</noscript>
```

This will only be visible to users without Javascript enabled.
