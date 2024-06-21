# Browser Support

All modern browsers are supported, on both mobile and desktop, all releases up to at least 8 years old. That includes Safari, Edge, Chrome, Firefox, and Opera. Internet Explorer 11 also works, with some sidenotes (see the section below). See the targeted [**browserlist compatible browsers**](https://browserslist.dev/?q=c2luY2UgMjAxMywgbm90IGRlYWQsIG5vdCBpZSA8PTEwLCBub3QgaWVfbW9iIDw9IDEx).

## Polyfills

If you want to support browsers over 5 years old, you will need some polyfills (`fetch`, `Promise`, `URL` and `Object.assign`).

You can use the build that includes the polyfills:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.16/dist/widget.module.min.js"
  async
  defer
></script>
<script
  nomodule
  src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.16/dist/widget.polyfilled.min.js"
  async
  defer
></script>
```

Or you can include the polyfills manually:

```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/url-polyfill@1.1.9/url-polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.1.0"></script>
<script src="https://cdn.jsdelivr.net/npm/object-assign-polyfill@0.1.0"></script>
```

If you find any compatibility issues please create a [**Github issue**](https://github.com/FriendlyCaptcha/friendly-challenge/issues).

## Compatibility mode for the library

If you are importing _friendly-challenge_ into your own bundle and want to support old browsers (those that don't support ES2017) you should change your imports to be from `friendly-challenge/compat`. For example:

```
import {WidgetInstance} from 'friendly-challenge'
// change to
import {WidgetInstance} from 'friendly-challenge/compat'
```

Both imports are ES2017, use a tool like Babel to transpile it to ES5 or lower. The difference between these two imports is the webworker script which is included as a string. In the _compat_ build it is ES5 compatible and includes necessary polyfills (at the cost of slighlty worse performance and an extra 3KB bundle size).

### Old browser speed

The Javascript engine in old browsers is generally slower than modern ones, the CAPTCHA may take a minute to solve on very old browsers (>5 years old).

## NoScript

Users need to have Javascript enabled to solve the CAPTCHA. We recommend you add a note for users that have Javascript disabled by default:

```html
<noscript>You need Javascript for CAPTCHA verification to submit this form.</noscript>
```

This will only be visible to users without Javascript enabled.

## Internet Explorer

Internet Explorer 11 is supported out of the box, but take note that **the Javascript engine is very slow in Internet Explorer leading to a poor user experience**: the CAPTCHA will likely take more than a minute to solve.

Consider displaying a message to IE users that they should use a different browser. You can use this Javascript snippet to display a note after the widget in Internet Explorer only:

```javascript
if (!!document.documentMode) {
  // Only true in Internet Explorer
  Array.prototype.slice.call(document.querySelectorAll(".frc-captcha")).forEach(function (element) {
    var messageElement = document.createElement("p");
    messageElement.innerHTML =
      "The anti-robot check works better and faster in modern browsers such as Edge, Firefox, or Chrome. Please consider updating your browser";
    element.parentNode.insertBefore(messageElement, element.nextSibling);
  });
}
```
