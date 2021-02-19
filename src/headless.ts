const nav = navigator;
const ua = nav.userAgent.toLowerCase();

/**
 * Headless browser detection on the clientside is imperfect. One can modify any clientside code to disable or change this check,
 * and one can spoof whatever is checked here. However, that doesn't make it worthless: it's yet another hurdle for spammers and
 * it stops unsophisticated scripters from making any request whatsoever.
 */
export function isHeadless() {
    let correctPrototypes = true;
    try {
        correctPrototypes = PluginArray.prototype === (nav.plugins as any).__proto__;
        if (nav.plugins.length > 0) correctPrototypes = correctPrototypes &&  Plugin.prototype === (nav.plugins as any)[0].__proto__;
    } catch(e){/* Do nothing, this browser misbehaves in mysterious ways */}

    return ( //tell-tale bot signs
        ua.indexOf("headless") !== -1
        || nav.appVersion.indexOf("Headless") !== -1
        || ua.indexOf("bot") !== -1 // http://www.useragentstring.com/pages/useragentstring.php?typ=Browser
        || ua.indexOf("crawl") !== -1 // Only IE5 has two distributions that has this on windows NT.. so yeah.
        || nav.webdriver === true
        || !nav.language
        || !nav.languages.length
        || !correctPrototypes
     );
}
