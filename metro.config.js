// Configuration Metro (bundler) : on part de la config Expo par défaut.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Le dossier store/ (visuels et captures pour le Play Store) ne fait pas partie de l'app :
// Metro ne le surveille pas et ne l'inclut jamais dans le bundle.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const storeDir = escape(path.resolve(__dirname, 'store')).replace(/\\\\|\//g, '[\\\\/]');
const existing = config.resolver.blockList;
config.resolver.blockList = [
    ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
    new RegExp(`^${storeDir}[\\\\/].*$`),
];

module.exports = config;
