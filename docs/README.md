# 🤖 FriendlyCaptcha Documentation


## What is FriendlyCaptcha

FriendlyCaptcha is a system for preventing bots from spamming your website. You can add the FriendlyCaptcha **widget** to your web app to fight spam, with little impact to the user experience.

FriendlyCaptcha works different from other CAPTCHAs such as Google's ReCAPTCHA. In ReCAPTCHA the user is asked to perform a task that depends on human cognition, such as labeling cars in images. FriendlyCaptcha instead sends the user a cryptographic puzzle that takes their device a few seconds to solve, without any user involvement.

It is explained in more detail on the [FriendlyCaptcha website](https://friendlycaptcha.com).

---

## Adding FriendlyCaptcha to your website or app

This documentation is designed for people familiar with HTML and some back-end programming. To incorporate FriendlyCaptcha you will probably need to edit some code.

There are three steps:

1. Sign up for an account on the [FriendlyCaptcha website](https://friendlycaptcha.com), there you can generate a `sitekey` to use for your website as well as an `API key`.
2. Add the FriendlyCaptcha widget to any form that you wish to protect with a CAPTCHA. If you are not using forms but are using a framework like React, that's not a problem.
3. Change your server code to make it verify the CAPTCHA solutions that were submitted.

If you wish to learn about the inner working of FriendlyCaptcha before we continue, the [**friendly-pow**](https://github.com/gzuidhof/friendly-pow) README is a good starting point. Otherwise, let's continue!

### 1. Generating a sitekey
Log in to your FriendlyCaptcha account and head to the [account page](https://friendlycaptcha.com/signup). Follow the instructions to create a new *application*. Once you have completed this, take note of the `sitekey` value in the *apps* table, we will need it in the next step.

> If you don't have an account yet, you can create one [here](https://friendlycaptcha.com/signup) for free. 

### 2. Adding the widget


#### Adding the friendly-challenge script

First, you will need to add the code that renders the widget and makes it work, this widget code is called **friendly-challenge**. You have two options on how to do this, either you can use a script tag to load **friendly-challenge** into your website from any CDN that hosts NPM packages, or you can import the code into your own Javascript bundle.

##### Option A: Using a script tag
You can import it from your favorite Javascript CDN, such as unpkg:
```html
<script src="https://unpkg.com/friendly-challenge@0.1.0/dist/friendlycaptcha.min.js" async defer></script>
```
or, alternatively, from jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.1.0/dist/friendlycaptcha.min.js" async defer></script>
```

> Pro-tip: Make sure to always import a specific version (e.g. `friendly-challenge@0.1.0`), then you can be sure that the integration with your website keeps working when changes are made.

I recommend that you include the `async` and `defer` attributes like in the examples above, they make sure that the browser does not wait to load these scripts to show your website.

##### Option B: Import into your Javascript code
Alternatively, you can install the `friendly-challenge` library using npm or yarn:
```bash
npm install --save friendly-challenge
# or
yarn add friendly-challenge
```

You can then import it into your app:
```javascript
import "friendly-challenge"
// or
require("friendly-challenge")
```

> It is possible to programmatically trigger and interact with the widget using the Javascript API.  In this tutorial however, we will consider the simple case in which you simply want to secure a HTML form.

#### Adding the widget itself

The friendly-challenge code you added won't do anything unless there is a special HTML element present that tells it where to create the widget. It will check for this widget once when it gets loaded, you can programmatically make it check for the element again.

Where you want to add a FriendlyCaptcha widget, add
```html
<div class="frc-captcha" data-sitekey="<YOUR SITEKEY>"></div>
```
You will need to replace `<YOUR SITEKEY>` with the sitekey that you created in step 1. The contents of this `div` element will be replaced with the widget HTML.

The widget adds a hidden input field with the CAPTCHA solution, this will automatically get added the form data sent to your server when the user presses submit.

### 3. Verifying the CAPTCHA solution on the server

> The verification is almost the same as Google's ReCAPTCHA, so it should be easy to switch between the two (either direction).

In the form data sent to the server, there will be an extra text field called `frc-captcha-solution`. The value of this field will be a string. 

You should verify that it this is a valid solution by making a POST request to `https://friendlycaptcha.com/api/v1/siteverify` with the following parameters:

| POST Parameter | Description                                         |   |   |   |
|----------------|-----------------------------------------------------|---|---|---|
| `solution`       | The solution value that the user submitted          |   |   |   |
| `secret`         | An API key generated in step 1 that proves it's you |   |   |   |
| `sitekey`        | **Optional:** the sitekey that you want to make sure the puzzle was generated from. |   |   |   |

> If you have not created an API key yet, you can do so on the FriendlyCaptcha [account page](https://friendlycaptcha.com/account).

The response will then tell you whether the CAPTCHA solution is valid and hasn't been used before, it's a JSON object:

```JSON
{
  "success": true|false,
  "errorCodes": [...] // optional
}
```

If the `success` field is false, you should reject the user's request. 

The possible error codes:

| Error code   | Description                                         |   |   |   |
|----------------|-----------------------------------------------------|---|---|---|
| `missing_secret`       | You forgot to add the secret (=api key) parameter.          |   |   |   |
| `invalid_secret`       | The API key you provided was invalid.          |   |   |   |
| `missing_solution` | You forgot to add the solution parameter.                                                    |   |   |   |
| `invalid_solution` | The solution you provided was invalid (perhaps the user tried to tamper with the puzzle).                                                    |   |   |   |
| `timeout_or_duplicate` | The puzzle that the solution was for has expired or has already been used.                                                     |   |   |   |













