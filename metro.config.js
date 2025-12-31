// Load polyfills first, before any Metro imports
require('./metro-polyfills');

const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

// Ensure proper resolution of node_modules
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
  nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  // Disable package exports temporarily to use main field
  unstable_enablePackageExports: false,
};

// Enable symlinks
config.watchFolders = [__dirname];

// Transform all node_modules properly
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
