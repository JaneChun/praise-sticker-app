// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for React 19 + Hermes compatibility
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
