// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname, {});

console.log(config.resolver.watchFolders);
config.resolver.watchFolders = [
  ...(config.resolver.watchFolders ?? []),
  './expo-image',
  '/Users/aleqsio/Work/Expo/expo/packages/expo',
];
config.resolver.extraNodeModules = {
  'expo-image': path.resolve('./expo-image-lib'),
};

module.exports = config;
