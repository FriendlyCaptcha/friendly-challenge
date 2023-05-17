# Content Security Policy (CSP)

Content Security Policy is a way to secure your website from cross-site scripting (XSS). The HTTP Content-Security-Policy response header allows website administrators to control resources the user agent is allowed to load for a given page.

## Configuring your CSP for Friendly Captcha
If you are using a CSP for your website you will have to configure it to allow Friendly Captcha's script to be loaded.

We recommend using the nonce-based approach documented with [CSP3](https://w3c.github.io/webappsec-csp/#framework-directive-source-list) and including your nonce in the `widget.min.js` script tag.

Alternatively and in most cases you will only need to add the following directives:
`script-src 'wasm-unsafe-eval' https://unpkg.com/ https://cdn.jsdelivr.net/npm/; worker-src blob:; child-src blob:"`