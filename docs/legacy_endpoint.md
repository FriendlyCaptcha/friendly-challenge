# Updating from the legacy endpoint

Since April 2021 we offer our global API on `api.friendlycaptcha.com/api/`.

Before then our documentation and widget distributions would default to `friendlycaptcha.com/api/`.

Only a small subset of our users are still using the old domain. We are starting to actively reach out to those that have not updated since, asking them to make the switch to the `api.friendlycaptcha.com` subdomain.

We are planning to sunset the API endpoints on the old domain entirely. Therefore, action on your part is needed.

## Why?

Serving our API from a separate subdomain allows for better reliability and better privacy preservation.



This change also offers us more flexibility in how we serve our website and apps. It simplifies moving away from a non-EU CDN provider.

---

## Upgrade instructions

Please perform the following updates. Upgrading should only take a few minutes, there have been no breaking changes for either the widget or the siteverify endpoints.

### Widget and the `friendly-challenge` library

If you are using version `0.8.3` or below, please update to the latest version as soon as possible. If you are using a more recent version still we advise to upgrade to the latest version (`0.9.12`).

The changelog can be found [here](https://github.com/FriendlyCaptcha/friendly-challenge/blob/master/docs/changelog.md).

### If you are using the WordPress plugin

Please upgrade to the latest version. Versions of the plugin before `1.2.0` are affected (released April 2021).

### Backend code

Please replace the following in your backend code:

```https://friendlycaptcha.com/api/v1/siteverify```

Replace it with

```https://api.friendlycaptcha.com/api/v1/siteverify```

> Note: If you are using the 🇪🇺 EU endpoint for siteverify, no changes are required in the backend code.
