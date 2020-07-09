// ONly applies fast-async
module.exports = {
    "plugins": [
      ["module:fast-async", {
        "compiler": {
          "promises": true,
          "generators": true
        },
        "useRuntimeModule": false
      }]
    ],
    "ignore": ["/node_modules\/(?!friendly-pow)/"]
}