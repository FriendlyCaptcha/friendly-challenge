module.exports = {
    plugins: [
      ["module:fast-async", {
        "compiler": {
          "promises": true,
          "generators": false
        },
        "useRuntimeModule": true
      }]
      // ["@babel/plugin-transform-runtime", {corejs: 3}],
    ],
    presets: [
      [
        "@babel/preset-env",
        {
          "exclude": [
            "transform-regenerator", "transform-async-to-generator"
          ],
          // "debug": true,
          "targets": {
            "browsers": [">0.05%", "not dead", "not ie 11", "not ie_mob 11"]
          },
          "modules": "auto",
          "useBuiltIns": "entry",
          "corejs": 3,
        }
      ]
    ],
    ignore: [/node_modules\/(?!friendly-pow)/]
  }