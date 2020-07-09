module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
          "exclude": [
            "transform-regenerator", "transform-async-to-generator"
          ],
          "targets": {
            "browsers": ["since 2013", "not dead", "not ie <= 11", "not ie_mob <= 11"]
          },
          "modules": "auto",
          "useBuiltIns": "entry",
          "corejs": 3,
        }
      ]
    ],
    plugins: [
      ["module:fast-async", {
        "compiler": {
          "promises": true,
          "generators": true
        },
        "useRuntimeModule": false
      }],
      
    ],
    ignore: [/node_modules\/(?!friendly-pow)/]
  }