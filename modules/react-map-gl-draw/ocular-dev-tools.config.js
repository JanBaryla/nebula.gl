const {resolve} = require('path');

const config = {
  lint: {
    paths: ['src', 'test'],
    extensions: ['js']
  },

  alias: {
    'react-map-gl-draw/test': resolve('./test'),
    'react-map-gl-draw': resolve('./src')
  },

  entry: {
    test: 'test/src/index.js',
    'test-browser': 'test/browser.js',
    size: 'test/size/import-nothing.js'
  }
};

module.exports = config;
