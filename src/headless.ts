/**
 * Now, headless browser detection on the clientside is never perfect. One can modify any clientside code to disable or change this check,
 * and one can spoof whatever is checked here.
 * 
 * However: it doesn't make it worthless: it's yet another hurdle for spammers to overcome.
 */
export function isHeadless() {
    const nav = navigator;
    let correctPrototypes = true;
    try {
        correctPrototypes = PluginArray.prototype === (nav.plugins as any).__proto__;
        if (nav.plugins.length > 0) correctPrototypes = correctPrototypes &&  Plugin.prototype === (nav.plugins as any)[0].__proto__;
    } catch(e){/* Do nothing, this browser misbehaves in mysterious ways */}

    if (
        nav.userAgent.toLowerCase().indexOf("headless")
        || nav.appVersion.toLowerCase().indexOf("headless") 
        || nav.webdriver === true
        || !nav.language
        || !!nav.languages.length
        || !correctPrototypes
        || (window.outerHeight === 0 && window.outerWidth === 0)
     ) {
        return true;
    }
 
    return false;
}
