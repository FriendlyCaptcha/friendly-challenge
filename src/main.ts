import { findCaptchaElements } from "./dom";
import { WidgetInstance } from "./captcha";

declare global {
    interface Window {
        friendlyChallenge: any;
    }
}

window.friendlyChallenge = {
    WidgetInstance: WidgetInstance
}

function setup() {
  let autoWidget = window.friendlyChallenge.autoWidget;
  
  const elements = findCaptchaElements();
  for (let index = 0; index < elements.length; index++) {
      const hElement = elements[index] as HTMLElement;
      if (hElement && !hElement.dataset["attached"]) {
          autoWidget = new WidgetInstance(hElement);
          hElement.dataset["attached"] = "1";
      }
  }
  window.friendlyChallenge.autoWidget = autoWidget;
};


if(document.readyState !== "loading") {
  setup();
} else {
  document.addEventListener("DOMContentLoaded", setup);
}
