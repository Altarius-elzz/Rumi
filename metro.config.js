// Metro configuration for Expo.
// We inject a DOMException polyfill as a Metro "polyfill" so it runs BEFORE
// React Native's InitializeCore/setUpDOM (which references DOMException on
// some Expo Go / Hermes builds and otherwise throws at startup).

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const defaultGetPolyfills =
  config.serializer && config.serializer.getPolyfills
    ? config.serializer.getPolyfills
    : () => require('@react-native/js-polyfills')();

config.serializer = {
  ...config.serializer,
  getPolyfills: (opts) => [
    ...defaultGetPolyfills(opts),
    path.resolve(__dirname, 'polyfills.js'),
  ],
};

module.exports = config;
