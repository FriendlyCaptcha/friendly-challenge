# 📱 Flutter

You can use the Friendly Captcha widget in your [Flutter](https://flutter.dev/) apps.

It works by opening an embedded WebView that displays the Friendly Captcha widget. When this widget has completed the anti-robot check, the solution string becomes available in your Flutter app code. You then send this solution to your backend server for verification.

Here we will run you through the steps to get it working.

> We are not Flutter experts, this integration will be improved over time. We welcome any suggestions to the example code below. _Contributions are welcome!_

### 1. Setup

- You will need to target at least Android SDK version 17 (edit `minSdkVersion` in `android/app/build.gradle`).
- Add `flutter_inappwebview` to your dependencies in `pubspec.yaml`:
  ```yaml
  dependencies:
    flutter:
      sdk: flutter
    flutter_inappwebview: 5.3.2
  ```

### 2. Define a Friendly Captcha widget in Flutter

Create a file `friendlycaptcha.dart` (or some other filename) and paste the following code:

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

String buildPageContent({String sitekey, String theme = "", String start = "auto", String lang = "", String puzzleEndpoint = ""}) {
  return """
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Friendly Captcha Verification</title>

    <script type="module" src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.17/widget.module.min.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.17/widget.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            ${theme == "dark" ? "background-color: #000;" : ""}
        }
    </style>
  </head>
  <body>
    <form action="POST" method="?">
      <div class="frc-captcha ${theme}" data-sitekey="${sitekey}" data-start="${start}" data-callback="doneCallback" data-lang="${lang}" data-puzzle-endpoint="${puzzleEndpoint}"></div>
    </form>
    <script>
      let isFlutterInAppWebViewReady = false;
      window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
       isFlutterInAppWebViewReady = true;
      });
      function doneCallback(solution) {
        if (!isFlutterInAppWebViewReady) { setTimeout(function(){doneCallback(solution)}, 500); } // Try again after 500ms
        window.flutter_inappwebview.callHandler('solutionCallback', {solution: solution});
      }
    </script>
  </body>
</html>
""";
}
class FriendlyCaptcha extends StatefulWidget {
  Function(String solution) callback;

  String sitekey;
  String theme;
  String start;
  String lang;
  String puzzleEndpoint;

  FriendlyCaptcha({
    @required this.sitekey,
    @required this.callback,
    this.theme = "",
    this.start = "auto",
    this.lang = "",
    this.puzzleEndpoint = ""}
  ) {}

  @override
  State<StatefulWidget> createState() {
    return CaptchaState();
  }
}

class CaptchaState extends State<FriendlyCaptcha> {
  InAppWebViewController webViewController;

  @override
  initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var htmlSource = buildPageContent(
        sitekey: widget.sitekey,
        lang: widget.lang,
        puzzleEndpoint: widget.puzzleEndpoint,
        theme: widget.theme,
        start: widget.start,
    );

    return ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: 100, // Empirically determined to fit the widget.. to be improved
        ),
        child: Container(
            child: InAppWebView(
              initialData: InAppWebViewInitialData(
                data: htmlSource
              ),
              initialOptions: InAppWebViewGroupOptions(
                  crossPlatform: InAppWebViewOptions(
                    useShouldOverrideUrlLoading: true,
                    disableContextMenu: true,
                    clearCache: true,
                    incognito: true,
                    applicationNameForUserAgent: "FriendlyCaptchaFlutter"
                  ),
                  android: AndroidInAppWebViewOptions(
                    useHybridComposition: true,
                  )
              ),
              onConsoleMessage: (controller, consoleMessage) {
                print(consoleMessage); // Useful for debugging, this prints (error) messages from the webview.
              },
              shouldOverrideUrlLoading: (controller, navigationAction) async {
                // We deny any navigation away (which could be caused by the user clicking a link)
                return NavigationActionPolicy.CANCEL;
              },
              onWebViewCreated: (InAppWebViewController w) {
                webViewController = w;
                w.addJavaScriptHandler(handlerName: 'solutionCallback', callback: (args) {
                  widget.callback(args[0]["solution"]);
                });
              },
            )
        )
    );
  }
}
```

### 3. Use the widget anywhere in your app

The widget takes two required arguments: a `callback` that is called when the widget is completed, and your `sitekey`.

Optionally you can also pass `lang`, `puzzleEndpoint`, `start` (defaults to `"auto"`), `theme` (`"dark"` is the only theme built-in). See the [`data-attributes` documentation](#/widget_api?id=data-start-attribute).

```dart
// Creates a German widget
FriendlyCaptcha(
  callback: mySolutionCallback,
  sitekey: "<my_sitekey>",
  lang: "de",
)
```

**Notes:**

- Usually you would store the `solution` that gets passed to the callback in your app's state.
- When the user performs the action you want to require the captcha for (e.g. user signup), you would send along this solution to your server.
- In your backend server you then talk to our [verification API](#/verification_api) to check whether the captcha was valid.

**Possible improvements (contributions welcome!):**

- If the user has no network connection we currently don't display an error.
- Widget reset functionality (a captcha solution can only be used once, currently you would recreate the widget entirely if your user can submit multiple times).
- Publish the above code as a Dart package and embed the widget's Javascript code so that we don't make any request to a CDN.
- Currently there is some space around the widget. You can edit the body's CSS to have it match your app's background color.  
  In the future the embedded webpage communicate its size so that the embedded WebView's size can exactly match the widget.

## Example app

We created an example app which you can view [here](https://github.com/FriendlyCaptcha/friendly-captcha-flutter-example). The relevant source file is [here](https://github.com/FriendlyCaptcha/friendly-captcha-flutter-example/blob/main/friendly_captcha_flutter_app/lib/main.dart).

#### Example App screenshot

![Example App Screenshot](https://i.imgur.com/GJxlpZ6.png)
