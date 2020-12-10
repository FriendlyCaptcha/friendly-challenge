import { findCaptchaElements } from "./dom";
import { WidgetInstance } from "./captcha";

const fc = (window as any).friendlyChallenge;
let autoWidget = fc ? fc.autoWidget : null;

const elements = findCaptchaElements();

for (let element of elements) {
    const hElement = element as HTMLElement;
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
