# Content Security Policy (CSP)

Content Security Policy is a way to secure your website from cross-site scripting (XSS). The HTTP Content-Security-Policy response header allows website administrators to control resources the user agent is allowed to load for a given page.

## Configuring your CSP for Friendly Captcha
If you are using a CSP for your website you will have to configure it to allow Friendly Captcha's script to be loaded. There are three ways this can be achieved:

### Source-based approach (Easiest)
You will only need to add the following directives:

- If you're loading the widget from the CDN:

    `script-src 'wasm-unsafe-eval' https://cdn.jsdelivr.net/npm/; worker-src blob:; child-src blob:`

    > note: as an extra precaution you can use the full path to our CDN hosted widget by replacing `https://cdn.jsdelivr.net/npm/` above with `https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.module.min.js https://cdn.jsdelivr.net/npm/friendly-challenge@0.9.12/widget.min.js` (making sure the widget versions are correct)
- If you're loading the widget from your own bundle: 

    `script-src 'wasm-unsafe-eval' 'self'; worker-src blob:; child-src blob:`   

### Nonce-based approach (Recommended)

See [this guide](https://content-security-policy.com/nonce/) and include your nonce in the `widget.min.js` and `widget.module.min.js` script tag.

###  Hash-based approach

See [this guide](https://content-security-policy.com/hash/)