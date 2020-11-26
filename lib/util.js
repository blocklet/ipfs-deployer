const fs = require('fs');
const path = require('path');
const env = require('go-platform');

const download = require('./download');

const ensureBinary = () =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    const appDir = process.env.BLOCKLET_APP_DIR || process.cwd();

    if (!appDir) {
      return reject(new Error('Missing process.env.BLOCKLET_APP_DIR'));
    }

    if (!fs.existsSync(appDir)) {
      return reject(new Error(`process.env.BLOCKLET_APP_DIR is not a valid path: ${appDir}`));
    }

    const binPath = path.join(appDir, `ipfs${env.platform === 'windows' ? '.exe' : ''}`);
    if (fs.existsSync(binPath) === true) {
      return resolve(binPath);
    }

    download(null, null, null, process.env.BLOCKLET_APP_DIR)
      // eslint-disable-next-line no-shadow
      .then((binPath) => resolve(binPath))
      .catch((err) => {
        console.error('go-ipfs binary downloaded failed', err.message);
        reject(err);
      });
  });

module.exports = { ensureBinary };
