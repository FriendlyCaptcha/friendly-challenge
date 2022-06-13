# Widget API

You can listen to events from the widget, or even create your own widgets programatically. Below is some documentation on how to do either.

> The widget code is all open source which should help with debugging, you can find the **WidgetInstance** class definition [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/src/captcha.ts).

## Attribute API (html tags)

### data-callback attribute
For simple integrations you can specify callbacks directly on the widget HTML element.

```html
<div class="frc-captcha" data-sitekey="<my sitekey>" data-callback="myCallback"></div>

<script>
function myCallback(solution) {
    console.log("Captcha finished with solution " + solution);
}
</script>
```

The callback specified here should be defined in the global scope (i.e. on the `window` object). The callback will get called with one string argument: the `solution`  that should be sent to the server as proof that the CAPTCHA was completed. You can use this to enable a submit button on a form when the CAPTCHA is complete.

### data-start attribute

You can specify when the widget should start solving a puzzle, you can specify the `data-start` attribute with one of the following values:
   * `auto`: the solver will start as soon as possible. This is recommended if the user will definitely be submitting the CAPTCHA solution (e.g. there is only one form on the page), this has the best user experience.
   * `focus`: as soon as the form the widget is in fires the `focusin` event the solver starts, or when the user presses the start button in the widget. This is recommended for webpages where only few users will actually submit the form. **This is the default.**
   * `none`: the solver only starts when the user presses the button or it is programatically started by calling `start()`.

Example:
```html
<div class="frc-captcha" data-sitekey="<my sitekey>" data-start="auto"></div>
```

### data-lang attribute

FriendlyCaptcha ships with some translations built-in (since version 0.7.0), right now valid values for this attribute are `"en"`, `"fr"`, `"de"`, `"it"`, `"nl"`, `"pt"`, `"es"`, `"ca"`, `"da"`, `"ja"`, `"ru"` and `"sv"` for English, French, German, Italian, Dutch, Portuguese, Spanish, Catalan, Danish, Japanese, Russian and Swedish respectively.

> Are you a native speaker and want to add your language?
> Please make an issue [here](https://github.com/FriendlyCaptcha/friendly-challenge/issues).  
> The translations we need are detailed [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/src/localization.ts), there's only a dozen values or so.

Example:
```html
<!-- This will create a widget with German text -->
<div class="frc-captcha" data-sitekey="<my sitekey>" data-lang="de"></div>
```

### data-solution-field-name
By default a hidden form field with name `frc-captcha-solution` is created. You can change the name of this field by setting this attribute, which can be useful for integrations with certain frameworks and content management systems.

Example:
```html
<div class="frc-captcha" data-sitekey="<my sitekey>" data-solution-field-name="my-captcha-solution-field"></div>
```

### data-puzzle-endpoint
*Only relevant if you are using our [dedicated EU endpoint service](/#/eu_endpoint)*.
By default the widget fetches puzzles from `https://api.friendlycaptcha.com/api/v1/puzzle`, which serves puzzles globally from over 200 data centers. As a premium service we offer an alternative endpoint that serves requests from datacenters in Germany only.

Example:
```html
<!-- Use the dedicated EU endpoint -->
<div class="frc-captcha" data-sitekey="<my sitekey>" data-puzzle-endpoint="https://eu-api.friendlycaptcha.eu/api/v1/puzzle"></div>
```

## Javascript API
For more advanced integrations you can use the **friendly-challenge** Javascript API.

### If you are using the widget script tag
If you added widget script tag to your website, a global variable `friendlyChallenge` will be present on the window object.

**Example**

```javascript
// Creating a new widget programmatically
const element = document.querySelector("#my-widget");
const myCustomWidget = new friendlyChallenge.WidgetInstance(element, {/* opts, more details in next section */})

// Or to get the widget that was created on script load (null if no widget instance was created)
const defaultWidget = friendlyChallenge.autoWidget;
```

### If you are using the friendly-challenge library

**Example**

```javascript
import { WidgetInstance } from "friendly-challenge";

function doneCallback(solution) {
    console.log("CAPTCHA completed succesfully, solution:", solution);
    // ... Do something with the solution, maybe use it in a request
}

// This element should contain the `frc-captcha` class for correct styling
const element = document.querySelector("#my-widget");
const options = {
    doneCallback: doneCallback;
    sitekey: "<my sitekey>",
}
const widget = new WidgetInstance(element, options);

// this makes the widget fetch a puzzle and start solving it.
widget.start()
```

The options object takes the following fields, they are all optional:
* **`startMode`**: string, default `"focus"`. Can be `"auto"`, `"focus"` or `"none"`. See documentation above (start mode) for the meaning of these.
* **`sitekey`**: string. Your sitekey.
* **`readyCallback`**: function, called when the solver is done initializing and is ready to start.
* **`startedCallback`**: function, called when the solver has started.
* **`doneCallback`**: function, called when the CAPTCHA has been completed. One argument will be passed: the solution string that should be sent to the server.
* **`errorCallback`**: function, called when an internal error occurs. The error is passed as an object, the fields and values of this object are still to be documented and are changing frequently. Consider this experimental.
* **`language`**: string or object, the same values as the `data-lang` attribute can be provided, or a custom translation object for your language. See [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/src/localization.ts) for what this object should look like.
* **`solutionFieldName`**: string, default `"frc-captcha-solution"`. The solution to the CAPTCHA will be put in a hidden form field with this name.

* **`puzzleEndpoint`**: string, the URL the widget should retrieve its puzzle from. This defaults to Friendly Captcha's endpoint, you will only ever need to change this if you are creating your own puzzles or are using our dedicated EU endpoint service.
* **`skipStyleInjection`**: boolean, if this is set to true the Friendly Captcha widget CSS will no longer be automatically injected into your webpage. You will be responsible for styling the element yourself.

### Resetting the widget
If you are building a single page application (SPA), chances are the page will not refresh after the captcha is submitted. As a solved captcha can only be used once, you will have to reset the widget yourself (e.g. on submission). You can call the `reset()` function on the widget instance to achieve this.

For example, if you are using the automatically created widget:
```javascript
friendlyChallenge.autoWidget.reset();
```

### Destroying the widget
To properly clean up the widget, you can use the `destroy()` function. It removes any DOM element and terminates any background workers.

### Full example in React (with React Hooks)
*Contributed by @S-u-m-u-n, thank you!*  
The following example presents a way to embed the Friendly Captcha widget in a React component:
```javascript
import { useEffect, useRef } from "react";
import { WidgetInstance } from 'friendly-challenge';

const FriendlyCaptcha = () => {
  const container = useRef();
  const widget = useRef();

  const doneCallback = (solution) => {
    console.log('Captcha was solved. The form can be submitted.');
    console.log(solution);
  }

  const errorCallback = (err) => {
    console.log('There was an error when trying to solve the Captcha.');
    console.log(err);
  }

  useEffect(() => {
    if (!widget.current && container.current) {
      widget.current = new WidgetInstance(container.current, { 
        startMode: "auto",
        doneCallback: doneCallback,
        errorCallback: errorCallback 
      });
    }

    return () => {
      if (widget.current != undefined) widget.current.destroy();
    }
  }, [container]);

  return (
    <div ref={container} className="frc-captcha" data-sitekey="YOUR_SITE_KEY" />
  );
}

export default FriendlyCaptcha;
```

### Full example in Vue (with Composition API)
The following example presents a way to embed the Friendly Captcha widget in a Vue component:
```html
<template>
  <div ref="container"></div>
</template>

<script lang="ts" setup>
import { WidgetInstance } from "friendly-challenge";
import { ref, watch } from "vue";

const container = ref();
const widget = ref();

const doneCallback = (solution) => {
  console.log('Captcha was solved. The form can be submitted.');
  console.log(solution);
}

const errorCallback = (err) => {
  console.log('There was an error when trying to solve the Captcha.');
  console.log(err);
}

watch(container, () => {
  // reset the widget instance when the container changes
  if (widget.value) {
    widget.value.destroy();
  }

  if (container.value) {
    widget.value = new WidgetInstance(container.value, {
      startMode: "auto",
      doneCallback: doneCallback,
      errorCallback: errorCallback 
    });
  }
});
</script>
```

## Questions or issues
If you have any questions about the API or run into problems, the best place to get help is the *issues* page on the [github repository](https://github.com/FriendlyCaptcha/friendly-challenge/issues).
