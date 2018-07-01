/* config-overrides.js */
const rewireCSSNext = require('react-app-rewire-postcss-cssnext');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config = rewireCSSNext(config, env);

  return config;
};
