# Changelog

### 0.9.12
- No longer uses the title attribute for debug information during solving. Some screen readers would read this title as it updates.
- Localization fix for Vietnamese (`"vi"`).
- The widget now exposes a `loadLanguage` function that allows you to programmatically change the language of the widget.

### 0.9.11
- Improvements to localizations, fix for Romanian (`"ro"`) localization (thank you @zcserei!).

### 0.9.10
- Fix for false positive headless browser check in rare cases on Windows devices (`"Browser check failed, try a different browser"`).
- Improved French (`"fr"`) localization (thank you @mikejpr!).

## 0.9.9
- Fix for NextJS 13 production builds.
- Added Chinese (Traditional) (`"zh_TW"`) localization (thank you @jhihyulin!).
- Added Vietnamese (`"vi"`) localization (thank you @duy13!).

## 0.9.8
- Fix for false positive headless errors in Chromium browsers when having certain plugins installed (`"Browser check failed, try a different browser"`).

## 0.9.7
- When an error is thrown by fetch (e.g. because of connection errors), the error of the fetch request can now be accessed under `error.rawError` in the object passed in the `onErrorCallback`.

## 0.9.6
- Added Chinese (Simplified) (`"zh"`) localization (thank you @shyn!).
- Added `"nb"` as an alias for Norwegian language (`"no"`).
- Improved accessibility by hiding visual-only SVG icons by adding `aria-hidden="true"`.
- Errors are now logged with `console.error` instead of only appearing in the widget.

## 0.9.5
- Added localizations `"el"`, `"uk"`, `"bg"`, `"cs"`, `"sk"`, `"no"`, `"fi"`, `"lt"`, `"lt"`, `"pl"`, `"et"`, `"hr"`, `"sr"`, `"sl"`, `"hu"`, and `"ro"` (Greek, Ukrainian, Bulgarian, Czech, Slovak, Norwegian, Finnish, Latvian, Lithuanian, Polish, Estonian, Croatian, Serbian, Slovenian, Hungarian, and Romanian), a big thank you to @Tubilopto!
- Added `type: "module"` to `package.json` (see #117) to help fix some issues in Javascript build pipelines. This may require some reconfiguring of your build pipeline.
- Build pipeline updates and upgrades (updated build dependencies, explicitly support IE11 in browser targets).

## 0.9.4

- Fixed the retry button not working after expiration.
- Added `skipStyleInjection` option to the config object. When true is passed the `<script>` element is no longer attached automatically.

## 0.9.3

- Add missing Typescript type declarations to package (see #109).
- Fix a regression in 0.9.2 causing the retry button not working when an error occurs.
- Added Turkish (`"tr"`) localization (thank you @selim995!).

## 0.9.2

- Fixed a bug which allowed for starting the same widget more than once
- Improved the accessibility of the widget for users using screen readers, there is now a localized, semantic title when the widget is completed stating *"Automatic spam check completed"*. This makes understanding what is going on easier for those who can not see the checkmark symbol.
- Updated dependencies.

## 0.9.1

- Added Swedish (`"sv"`) and Russian (`"ru"`) localization (thank you @astonsson and @YerzhanU!).
- Added a `min-width` and `max-width` rule to the widget which should help with small screens and containers.
- Balancing of the work across multiple cores is now performed more efficiently, this makes the time to solve more stable and predictable.
- HTML elements that have a widget attached now have their instance available under `element.friendlyChallengeWidget`, this helps with situations where you have multiple auto-attached widgets that you want to interact with using the JS API.
- Minor improvements to error logging in the console.
- Updated dependencies.

## 0.9.0

- The widget now solves in multiple threads at the same time. This means that for the same computational cost a user has to wait shorter.
- Webassembly now gets compiled inside the webworker, which should remove the need for `unsafe-eval` in CSP rules.
- Added `d.ts` file (Typescript declarations) for the compat library build.
- Added Danish localization (thank you @SimonJ)
- The client-side headless detection now sets the value `.HEADLESS_ERROR` instead of `.ERROR` as the stub solution value.

## 0.8.12

- Added Japanese localization (thank you @junsato1992!)
- Removed last remaining inline style tag and replaced with class.
- Removed `<animate>` tag from SVG and replaced with a CSS class, this prevents CSP issues in Firefox. (thank you @papegaaij!)

## 0.8.11

- Moved stray inline styles to the default stylesheet. This makes customizing the style easier, and helps with CSP policies that forbid inline styles.

## 0.8.10

- Added Spanish (`"es"`) and Catalan (`"ca"`) localizations (thank you @aniolpages!).

## 0.8.9

- Added missing `"pt"` value for Portuguese localization in Typescript typings.
- Fixed a bug which caused multiple endpoints separated by commas not to work.

## 0.8.8

- Added Portuguese localization (thank you @andrebonna!).

## 0.8.7

**No functional changes to the widget**

- Fixed the filename of the Typescript typings file, no functional changes to the library or widget. Thank you @aks-!
- We now use Prettier to format the library source files.

## 0.8.6

- Improved the error message when a puzzle could not be fetched.
  - The error is localized.
  - The end-user is no longer presented with the JS error, instead it is printed in the console for debugging.
  - In case of connection error a clickable link is added.
  - The error message now spans two lines, the line height was slightly reduced.
- Browser APIs used outside of functions are now guarded by a `typeof window !== 'undefined'`, this makes using FriendlyCaptcha easier in Gatsby and Next.js projects. Thank you @fdeberle!
- A small change to the retry behavior (in case of network failure): it now retries twice: after 1 second and after 4 seconds. After that the user can click the button to try again.

## 0.8.5

- Added check to make sure that the widget code gets executed after the DOM has been loaded. See #20.

## 0.8.4

- Added Italian localization (thank you @LucaDiba!).
- You can now pass the sitekey in the options object when using the programmatic API.
- Added support for specifying multiple puzzle endpoints separated with a comma, they will be tried in order.

## 0.8.3

- Fix for Internet Explorer 11 compatibility (thank you @Sevyls!).

## 0.8.2

- No functional changes, only a fix to the example page in which polyfills are used.

## 0.8.1

- Fixed the callback defined using `data-callback` receiving the wrong value as argument.

## 0.8.0

- Added basic headless browser detection into the widget, this will filter basic automated attacks.
- Style changes:
  - Changed the width of the widget from `280px` to `312px` by default (note it can still be styled to whichever size you wish using plain CSS).
  - Changed the default border color from `#ddd` to `#f4f4f4`. In dark mode it is now `#333` (it was unset before).
- Minor: Fix typo in console error message when an unknown language is specified.

## 0.7.4

- Added `data-puzzle-endpoint` support, which can be used to talk to a custom endpoint for puzzle generation, which is useful for testing.

## 0.7.3

- Added `text-transform: none` to the widget button's class (`.frc-button`). The default Wordpress style makes the button uppercase otherwise.

## 0.7.2

- Added support for French text in the widget. You can use it by specifying `data-lang="fr"` on the widget mount point.

## 0.7.1

- Added support for custom solution form field name. You can now specify the `data-solution-field-name` attribute to override the default name, which is `frc-captcha-solution`.

## 0.7.0

No breaking changes in this release.

- Added support for localization. You can now specify the `data-lang` attribute or pass a `language` object when using the JS API. Right now the built-in languages are English, German and Dutch.
