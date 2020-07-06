module.exports = {
    plugins: [
      // ["@babel/plugin-transform-runtime", {corejs: 3}],
    ],
    presets: [
      [
        "@babel/preset-env",
        {
          // "debug": true,
          "targets": {
            "browsers": "defaults"
          },
          "modules": false,
          "useBuiltIns": "entry",
          "corejs": 3,
        }
      ]
    ],
    ignore: [/node_modules\/(?!friendly-pow)/]
  }