# Self-Hosting FriendlyCaptcha

While of course we prefer you use the [managed SaaS version](https://friendlycaptcha.com) of FriendlyCaptcha - and believe in the end it is cheaper to pay for it than to spend time implementing your own solution and maintaining it - we understand that some may have special requirements that makes using an external service difficult (talk to us first though!). In this doc we provide instructions on how to set up a self-hosted FriendlyCaptcha server, because it's the *friendly* thing to do.

You can use the FriendlyCaptcha widget with your own self-hosted puzzle generation and verification code. In this guide we'll run you through what to set up to do that.

**Despite all information and building blocks being there to self-host the puzzle generation and verification, it is still not for the faint of heart.**

## Programming language support
The code to generate, sign and verify puzzles is available in Javascript and will run in browsers and some Javascript serverless environments. If you are using a different language such as Python or Go you will need to re-implement the verification and puzzle parsing: most of the steps use standardized tools (e.g. hash functions, encodings, crypto) that will be available as a library in most programming languages.

All the code we will be using is found in the [**friendly-pow**](https://github.com/friendlycaptcha/friendly-pow) Github repository. The structure and algorithm of the puzzles are explained in more detail in the README of that repository.

## Data store
You will need persistent storage, which preferably is **globally consistent**. You could use a database like Redis for this. If you only have a single application server you can probably get away with keeping it in memory - otherwise you will need to centralize the storage of used puzzles.

A puzzle in FriendlyCaptcha has an expiration date that ranges from 5 minutes to just under a day, we will need to keep submitted puzzles for at least that long to make sure puzzles are not used again (in a *replay attack*). This is very important as without this one could solve a single puzzle and then use its result for thousands of requests, which defeats the point of a CAPTCHA.

## Generating the puzzles

We will need to generate puzzles and sign them for use in the widget. A puzzle is consists of a buffer of bytes (32 to 64 bytes in length) that we transmit to the user encoded as a base64 string. You can use [this function](https://github.com/friendlycaptcha/friendly-pow/blob/master/src/puzzle.ts#L22) to generate a puzzle buffer. Some notes:
* The timestamp is in seconds since unix epoch, as an unsigned 32 bit integer.
* The account ID and app ID don't matter much if you only have a single captcha on your website. You can use these fields to keep track of different captcha instances, or just keep them as 0.
* The difficulty and expiration date are encoded in a single byte, [here](https://github.com/gzuidhof/friendly-pow/blob/master/src/encoding.ts) is the code that does the mapping to get the expiration in seconds.

In the end you will have a buffer of bytes (what we will call the `puzzle buffer`), encode these as a base64 string.

We sign this string with some signing secret, here is the [function](https://github.com/gzuidhof/friendly-pow/blob/master/src/crypto/signing.ts#L4) to do that using `HMAC-SHA256-128`. We will need the same signing secret to verify the signature.

Now, we hex encode this signature, and then concatenate the hex-encoded signature and base64 encoded puzzle buffer with a `.` separating them, an example:
```
b9e3c88c02a85ac71baf9f77547c5e60.XxNO/QdbzRU63mixAWQPlgAAAAAAAAAAlxuLKBLrVDk=.
```

We serve it from a GET endpoint to the user inside a JSON message with this structure:

```json
{
    "data": {
        "puzzle":"f1154e5d63d51e9cefa8f326539deb1c.XxNQIAdbzRU63mixAWQPlgAAAAAAAAAAGfu+UdipDx0="
    }
}
```

## Pointing the widget to your endpoint
Programmatically create a widget using the `friendly-challenge` library, see the [API documentation](/api) page for the specifics. In the constructor you will pass in any non-empty or nullish string as sitekey, and your own `puzzleEndpoint` that points to the endpoint on your server. Let's say here we pass in sitekey `MYSITEKEY` and endpoint `https://example.com/v1/puzzle`.

The widget will make a `GET` request with the sitekey url-encoded:

```GET https://example.com/v1/puzzle?sitekey=MYSITEKEY```


## Verifying the puzzle solution
The solution will be embedded in a hidden form input with name `frc-captcha-solution`, or you can read it out of the widget using Javascript. This string is the proof that the captcha was completed succesfully. When the captcha is not done yet the field will instead contain a string that always starts with a `.` explaining the state (e.g. `.SOLVING` or `.FETCHING`).

A valid solution looks like this:
```
b9e3c88c02a85ac71baf9f77547c5e60.XxNO/QdbzRU63mixAWQPlgAAAAAAAAAAlxuLKBLrVDk=.AAAAAPpyCgABAAAA4KUHAAIAAAA0+goAAwAAAMfRBAAEAAAAC2QKAAUAAACbOwEABgAAAO0zBQAHAAAAaPcMAAgAAACnvg0ACQAAADu5CAAKAAAAgm8CAAsAAAD6CwcADAAAAIP7DQANAAAA1boDAA4AAAAOuQAA.AgAB
```

This solution string consists of four parts. The first two parts are exactly the puzzle as sent by your endpoint, the third part is the `solution buffer` encoded as base64, and finally there is the `diagnostics buffer` encoded in base64 also. We will not touch on the diagnostics buffer, it is explained in more detail in the [*friendly-pow*](https://github.com/gzuidhof/friendly-pow) README.

To verify the solution you need to check the:

* Integrity: The puzzle buffer integrity is verified by checking that the signature matches.
* Account and App ID: Check whether these values are as expected if you set these to any specific value.
* Expiration: Timestamp and expiry time is compared to current time.
* Version: The version of the puzzle is checked (it's currently hardcoded to `1`)
* Solution Count: Check that we have enough solutions to the puzzle and that there are no duplicates.
* Replay check: Check whether this puzzle has been submitted before.
* Solution verification: Each of the solutions are verified to produce a correct hash given the difficulty.

Some routines that help with verifying solutions can be found in [this file](https://github.com/friendlycaptcha/friendly-pow/blob/master/src/verification.ts#L8), code for verifying the signature is found [here](https://github.com/friendlycaptcha/friendly-pow/blob/master/src/crypto/signing.ts#L13).

> Tip: For the replay (=duplicate) check it is sufficient to only store the puzzle buffer part of the string above. You only have to keep the puzzle for as long as its expiration date.

If these are checks **all** pass the captcha is valid. Remember to put this puzzle into your datastore to check for replay attacks.

## Some tips
* When you verify the puzzle make sure to use the values (such as expiration and difficulty) as encoded in the puzzle buffer and not some hardcoded values. Because we sign the puzzles, the user can not change these values without invalidating the signature. This allows you to change parameters like the difficulty in the future gracefully.
