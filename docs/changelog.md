# Changelog

## 0.8.3
* Fix for Internet Explorer 11 compatibility (thank you @Sevyls!)

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
