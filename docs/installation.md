# Installation

**There are three steps to adding Friendly Captcha to your website:**

1. Create an account on the [**Friendly Captcha website**](https://friendlycaptcha.com/signup) (it's free) and generate a `sitekey`.
2. Add the Friendly Captcha widget to your website
3. Change your server code to verify the CAPTCHA solutions

Let's go!

## 1. Generating a sitekey

Log in to your Friendly Captcha account and head to the [Applications page](https://app.friendlycaptcha.eu/dashboard).

Click `Create New Application` and enter the necessary details. Once you have completed this, take note of the `sitekey` value under the application nam,e, we will need it in the next step.

A sitekey always starts with the characters `FC`.

> If you don't have an account yet, you can create one [here](https://friendlycaptcha.com/signup).

## 2. Adding the widget

### Adding the widget script

The **friendly-challenge** library contains the code for CAPTCHA widget. You have two options on how to add this to your website, either you can use a script tag to load the widget from any CDN that hosts NPM packages, or you can import the code into your own Javascript bundle.

#### Option A: Using a script tag

```html
<!-- from unpkg -->
<script type="module" src="https://unpkg.com/friendly-challenge@0.9.10/widget.module.min.js" async defer></script>
<script nomodule src="https://unpkg.com/friendly-challenge@0.9.10/widget.min.js" async defer></script>

<!-- OR from jsdelivr -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.10/widget.module.min.js"
  async
  defer
></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.10/widget.min.js" async defer></script>
```

> Make sure to always import a specific version (e.g. `friendly-challenge@0.9.10`), then you can be sure that the script you import and integrate with your website doesn't change unexpectedly.

It is recommended that you include the `async` and `defer` attributes like in the examples above, they make sure that the browser does not wait to load these scripts to show your website. The size of the scripts is 18KB (8.5KB compressed) for modern browsers, and 24KB (10KB compressed) for old browsers.

> If you want to support old browsers, you can instead use a polyfill build, see the [**browser support**](browser_support?id=polyfills) page.

##### Download and self-host the widget library (releases)

Instead of using a CDN (e.g. for GDPR reasons) you can of course also download the library .js files and host them on your server.
Simply download the latest release from one of the CDN's mentioned above, like: https://cdn.jsdelivr.net/npm/friendly-challenge/

- The module widget.module.min.js: https://cdn.jsdelivr.net/npm/friendly-challenge/widget.module.min.js
- The nomodule widget.min.js: https://cdn.jsdelivr.net/npm/friendly-challenge/widget.min.js

Please remember to update to the latest release from time to time.

#### Option B: Import the library into your Javascript code

Alternatively, you can install the **friendly-challenge** library using a package manager such as npm:

```bash
npm install --save friendly-challenge
```

You can then import it into your app:

```javascript
import "friendly-challenge/widget";
```

> It is also possible to create and interact with the widget using the Javascript API. In this tutorial we will consider the simple case in which you want to secure a simple HTML form. If you are making a single page application (using e.g. React) you will probably want to use the API instead. See the [API documentation page](/widget_api).

### Adding the widget itself

The friendly-challenge code you added won't do anything unless there is a special HTML element present that tells it where to create the widget. It will check for this widget once when it gets loaded, you can programmatically make it check for the element again.

Where you want to add a Friendly Captcha widget, add

```html
<div class="frc-captcha" data-sitekey="<your sitekey>"></div>
```

Replace `<your sitekey>` with the sitekey that you created in step 1. The widget will be rendered where you include this element, this should be inside the `<form>` you want to protect.

A hidden input field with the CAPTCHA solution will be added automatically, this will be included in the form data sent to your server when the user submits the form.

## 3. Verifying the CAPTCHA solution on the server

> The verification is almost the same as Google's ReCAPTCHA, so it should be easy to switch between the two (either direction).

In the form data sent to the server, there will be an extra text field called `frc-captcha-solution`. We will send this string to the Friendly Captcha servers to verify that the CAPTCHA was completed successfully.

### Creating a verification request

You will need an API key to prove it's you, you can create one on the [**API Keys page**](https://app.friendlycaptcha.eu/dashboard) in the dashboard.

To verify the CAPTCHA solution, make a POST request to `https://api.friendlycaptcha.com/api/v1/siteverify` with the following parameters:

| POST Parameter | Description                                                                         |
| -------------- | ----------------------------------------------------------------------------------- |
| `solution`     | The solution value that the user submitted in the `frc-captcha-solution` field      |
| `secret`       | An API key that proves it's you, create one on the Friendly Captcha website         |
| `sitekey`      | **Optional:** the sitekey that you want to make sure the puzzle was generated from. |

You can pass these parameters in a JSON body, or as formdata.

> If your account is on the **Advanced** or **Enterprise** plan your server can also make a request [to our EU endpoint](./eu_endpoint).

### The verification response

The response will tell you whether the CAPTCHA solution is valid and hasn't been used before. The response body is a JSON object:

```JSON
{
  "success": true|false,
  "errors": [...] // optional
}
```

If `success` is false, `errors` will be a list containing at least one of the following error codes below. **If you are seeing status code 400 or 401 your server code is probably not configured correctly.**

| Error code                      | Status | Description                                                                               |
| ------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `secret_missing`                | 400    | You forgot to add the secret (=API key) parameter.                                        |
| `secret_invalid`                | 401    | The API key you provided was invalid.                                                     |
| `solution_missing`              | 400    | You forgot to add the solution parameter.                                                 |
| `bad_request`                   | 400    | Something else is wrong with your request, e.g. your request body is empty.               |
| `solution_invalid`              | 200    | The solution you provided was invalid (perhaps the user tried to tamper with the puzzle). |
| `solution_timeout_or_duplicate` | 200    | The puzzle that the solution was for has expired or has already been used.                |

> ⚠️ Status code 200 does not mean the solution was valid, it just means the verification was performed succesfully. Use the `success` field.

A solution can be invalid for a number of reasons, perhaps the user submitted before the CAPTCHA was completed or they tried to change the puzzle to make it easier. The first case can be prevented by disabling the submit button until the CAPTCHA has been completed succesfully.

### Verification Best practices

If you receive a response code other than 200 in production, you should probably accept the user's form despite not having been able to verify the CAPTCHA solution.

Maybe your server is misconfigured or the Friendly Captcha servers are down. While we try to make sure that never happens, it is a good idea to assume one day disaster will strike.

An example: you are using Friendly Captcha for a sign up form and you can't verify the solution, it is better to trust the user and let them sign up anyway, because otherwise no signup will be possible at all. Do send an alert to yourself!
