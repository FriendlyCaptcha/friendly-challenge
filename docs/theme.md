# Customizing the look

The styling of FriendlyCaptcha is done in plain CSS, and you can change it however you want. A stylesheet gets injected into the `head` of your HTML document when the first widget is loaded.

## Dark mode

FriendlyCaptcha ships with two built-in themes, by adding the `dark` class to your `frc-captcha` element you can enable dark mode:

```html
<!-- light mode -->
<div class="frc-captcha" data-sitekey="<your sitekey>"></div>

<!-- dark mode -->
<div class="frc-captcha dark" data-sitekey="<your sitekey>"></div>
```


## Using your own stylesheet
You can create your own stylesheet for the FriendlyCaptcha widget. The [existing css file](https://github.com/gzuidhof/friendly-challenge/blob/master/src/styles.css) is probably a good start.

If any HTML element with id `frc-style` is present on the HTML document, the original styles will not be injected. So to use your own custom theme you could add the following:

```html
 <link rel="stylesheet" id="frc-style" href="/my-custom-widget-theme.css">
```
