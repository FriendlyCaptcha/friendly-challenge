# Changelog

## 0.8.8
**No functional changes to the widget**

* Added Portuguese localization (thank you @andrebonna!).

## 0.8.7
**No functional changes to the widget**

* Fixed the filename of the Typescript typings file, no functional changes to the library or widget. Thank you @aks-!
* We now use Prettier to format the library source files.

## 0.8.6
* Improved the error message when a puzzle could not be fetched.
  * The error is localized.
  * The end-user is no longer presented with the JS error, instead it is printed in the console for debugging.
  * In case of connection error a clickable link is added.
  * The error message now spans two lines, the line height was slightly reduced.
* Browser APIs used outside of functions are now guarded by a `typeof window !== 'undefined'`, this makes using FriendlyCaptcha easier in Gatsby and Next.js projects. Thank you @fdeberle!
* A small change to the retry behavior (in case of network failure): it now retries twice: after 1 second and after 4 seconds. After that the user can click the button to try again.

## 0.8.5
* Added check to make sure that the widget code gets executed after the DOM has been loaded. See #20.

## 0.8.4
* Added Italian localization (thank you @LucaDiba!).
* You can now pass the sitekey in the options object when using the programmatic API.
* Added support for specifying multiple puzzle endpoints separated with a comma, they will be tried in order.

## 0.8.3
* Fix for Internet Explorer 11 compatibility (thank you @Sevyls!).

## 0.8.2
* No functional changes, only a fix to the example page in which polyfills are used.

## 0.8.1
* Fixed the callback defined using `data-callback` receiving the wrong value as argument.

## 0.8.0
* Added basic headless browser detection into the widget, this will filter basic automated attacks.
* Style changes:
  * Changed the width of the widget from `280px` to `312px` by default (note it can still be styled to whichever size you wish using plain CSS).
  * Changed the default border color from `#ddd` to `#f4f4f4`. In dark mode it is now `#333` (it was unset before).
* Minor: Fix typo in console error message when an unknown language is specified.

## 0.7.4
* Added `data-puzzle-endpoint` support, which can be used to talk to a custom endpoint for puzzle generation, which is useful for testing.

## 0.7.3
* Added `text-transform: none` to the widget button's class (`.frc-button`). The default Wordpress style makes the button uppercase otherwise.

## 0.7.2
* Added support for French text in the widget. You can use it by specifying `data-lang="fr"` on the widget mount point.

## 0.7.1
* Added support for custom solution form field name. You can now specify the `data-solution-field-name` attribute to override the default name, which is `frc-captcha-solution`.

## 0.7.0
No breaking changes in this release.

* Added support for localization. You can now specify the `data-lang` attribute or pass a `language` object when using the JS API. Right now the built-in languages are English, German and Dutch.
