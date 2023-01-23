// Defensive init to make it easier to integrate with Gatsby, NextJS, and friends.
let nav: Navigator;
let ua: string;
if (typeof navigator !== "undefined") {
  nav = navigator;
  ua = nav.userAgent.toLowerCase();
}

/**
 * Headless browser detection on the clientside is imperfect. One can modify any clientside code to disable or change this check,
 * and one can spoof whatever is checked here. However, that doesn't make it worthless: it's yet another hurdle for spammers and
 * it stops unsophisticated scripters from making any request whatsoever.
 */
export function isHeadless() {
  return (
    //tell-tale bot signs
    ua.indexOf("headless") !== -1 ||
    nav.appVersion.indexOf("Headless") !== -1 ||
    ua.indexOf("bot") !== -1 || // http://www.useragentstring.com/pages/useragentstring.php?typ=Browser
    ua.indexOf("crawl") !== -1 || // Only IE5 has two distributions that has this on windows NT.. so yeah.
    nav.webdriver === true ||
    !nav.language ||
    (nav.languages !== undefined && !nav.languages.length) // IE 11 does not support NavigatorLanguage.languages https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
  );
}
