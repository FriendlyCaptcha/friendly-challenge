# Widget API

You can listen to events from the widget, or even create your own widgets programatically. Below is some documentation on how to do either.

> The widget code is all open source which should help with debugging, you can find the **WidgetInstance** class definition [here](https://github.com/gzuidhof/friendly-challenge/blob/master/src/captcha.ts).

## data-callback attribute
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

> *Experimental:* There is also `data-callback-error`, which gets called in case there was an error completing the CAPTCHA. This is an experimental feature and should not be depended on for now. The most likely reason for an error here is a network error: either the user's connection has dropped or Friendly Captcha's servers are down. Note that a retry button is present for the user so it may be recoverable.

## data-start attribute

You can specify when the widget should start solving a puzzle, you can specify the `data-start` attribute with one of the following values:
   * `auto`: the solver will start as soon as possible. This is recommended if the user will definitely be submitting the CAPTCHA solution (e.g. there is only one form on the page), this has the best user experience.
   * `focus`: as soon as the form the widget is in fires the `focusin` event the solver starts, or when the user presses the start button in the widget. This is recommended for webpages where only few users will actually submit the form. **This is the default.**
   * `none`: the solver only starts when the user presses the button or it is programatically started by calling `start()`.

Example:
```html
<div class="frc-captcha" data-sitekey="<my sitekey>" data-start="auto"></div>
```

## data-lang attribute 🇺🇸🇬🇧🇩🇪🇳🇱

FriendlyCaptcha ships with some translations built-in (since version 0.7.0), right now valid values for this attribute are `"en"`, `"de"` and `"nl"` for English, German and Dutch respectively.

> Are you a native speaker and want to add your language?
> Please make an issue [here](https://github.com/FriendlyCaptcha/friendly-challenge/issues).  
> The translations we need are detailed [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/src/localization.ts), there's only a dozen values or so. A French translation would be especially appreciated!

Example:
```html
<!-- This will create a widget with German text -->
<div class="frc-captcha" data-sitekey="<my sitekey>" data-lang="de"></div>
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

const element = document.querySelector("#my-widget");
const options = {
    doneCallback: doneCallback;
}
const widget = new friendlyChallenge.WidgetInstance(element, options);

// this makes the widget fetch a puzzle and start solving it.
widget.start()
```

The options object takes the following fields, they are all optional:
* **`startMode`**: string, default `"focus"`. Can be `"auto"`, `"focus"` or `"none"`. See documentation above (start mode) for the meaning of these.
* **`readyCallback`**: function, called when the solver is done initializing and is ready to start.
* **`startedCallback`**: function, called when the solver has started.
* **`doneCallback`**: function, called when the CAPTCHA has been completed. One argument will be passed: the solution string that should be sent to the server.
* **`errorCallback`**: function, called when an internal error occurs. The error is passed as an object, the fields and values of this object are still to be documented and are changing frequently. Consider this experimental.
* **`language`**: string or object, the same values as the `data-lang` attribute can be provided, or a custom translation object for your language. See [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/src/localization.ts) for what this object should look like.

* **`puzzleEndpoint`**: string, the URL the widget should retrieve its puzzle from. This defaults to Friendly Captcha's endpoint, you will only ever need to change this if you are creating your own puzzles.
* **`forceJSFallback`**: boolean, default `false`:  Forces the widget to use the Javascript solver, which is much slower than the WebAssembly solver. Note that it will fallback to the JS solver automatically anyway. Recommended to never set this to true, it does not increase security.

### Resetting the widget
If you are building a single page application (SPA), chances are the page will not refresh after the captcha is submitted. As a solved captcha can only be used once, you will have to reset the widget yourself (e.g. on submission). You can call the `reset()` function on the widget instance to achieve this.

For example, if you are using the automatically created widget:
```javascript
friendlyChallenge.autoWidget.reset();
```

### Destroying the widget
To properly clean up the widget, you can use the `destroy()` function. It removes any DOM element and terminates any background workers.

### Full example in React (with React Hooks)
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
      if (widget.current != undefined) widget.current.reset();
    }
  }, [container]);

  return (
    <div ref={container} className="frc-captcha" data-sitekey="YOUR_SITE_KEY" />
  );
}

export default FriendlyCaptcha;
```

## Questions or issues
If you have any questions about the API or run into problems, the best place to get help is probably the *issues* page on the [github repository](https://github.com/FriendlyCaptcha/friendly-challenge/issues).
