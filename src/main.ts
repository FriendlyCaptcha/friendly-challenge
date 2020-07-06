export { FriendlyCaptcha } from "./captcha";
import { findCaptchaElement, injectStyle } from "./dom";
import { FriendlyCaptcha } from "./captcha";

const element = findCaptchaElement() as HTMLElement;

if (element) {
    injectStyle();
    const c = new FriendlyCaptcha(element);
    (window as any).friendlyCaptchaDefaultInstance = c;
    c.init();
}
