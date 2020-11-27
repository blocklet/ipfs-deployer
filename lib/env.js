require('dotenv').config();

const path = require('path');

const cwd = process.cwd();

module.exports = Object.freeze({
  version: 'v0.7.0',
  appDir: process.env.BLOCKLET_APP_DIR || cwd,
  dataDir: process.env.BLOCKLET_DATA_DIR || path.join(cwd, '.ipfs'),
  adminPort: Number(process.env.BLOCKLET_PORT) || 3000,
  gatewayPort: Number(process.env.IPFS_GATEWAY_PORT),
  apiPort: Number(process.env.IPFS_API_PORT),
  swarmPort: Number(process.env.IPFS_SWARM_PORT),
  distUrl: process.env.IPFS_DIST_URL || 'https://dist.ipfs.io',
});
