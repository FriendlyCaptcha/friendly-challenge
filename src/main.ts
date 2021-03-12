import { findCaptchaElements } from "./dom";
import { WidgetInstance } from "./captcha";

const fc = (window as any).friendlyChallenge;
let autoWidget = fc ? fc.autoWidget : null;

const elements = findCaptchaElements();

for (var index = 0; index < elements.length; index++) {
    const hElement = elements[index] as HTMLElement;

    if (hElement && !hElement.dataset["attached"]) {
        autoWidget = new WidgetInstance(hElement);
        hElement.dataset["attached"] = "1";
    }
}

// @ts-ignore
window.friendlyChallenge = {
    WidgetInstance,
    autoWidget
};
