import { findCaptchaElement } from "./dom";
import { WidgetInstance } from "./captcha";

let autoWidget = null;
const element = findCaptchaElement() as HTMLElement;
if (element && !element.dataset["attached"]) {
    autoWidget = new WidgetInstance(element);
    element.dataset["attached"] = "1";
}

// @ts-ignore
window.friendlyChallenge = {
    WidgetInstance,
    autoWidget
};
