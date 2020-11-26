const fs = require('fs');
const path = require('path');
const goEnv = require('go-platform');
const IPFSHttpClient = require('ipfs-http-client');

const IPFSDaemon = require('./daemon');
const download = require('./download');
const env = require('./env');

const ensureBinary = () =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    if (!env.appDir) {
      return reject(new Error('Missing process.env.BLOCKLET_APP_DIR'));
    }

    if (!fs.existsSync(env.appDir)) {
      return reject(new Error(`process.env.BLOCKLET_APP_DIR is not a valid path: ${env.appDir}`));
    }

    const binPath = path.join(env.appDir, 'go-ipfs', `ipfs${goEnv.platform === 'windows' ? '.exe' : ''}`);
    if (fs.existsSync(binPath) === true) {
      return resolve(binPath);
    }

    download(null, null, null, env.appDir)
      // eslint-disable-next-line no-shadow
      .then((binPath) => resolve(binPath))
      .catch((err) => {
        console.error('go-ipfs binary downloaded failed', err.message);
        reject(err);
      });
  });

const ensureDaemon = async () => {
  const binPath = await ensureBinary();
  const daemon = new IPFSDaemon({
    type: 'go',
    disposable: false,
    ipfsBin: binPath,
    ipfsHttpModule: IPFSHttpClient,
    ipfsOptions: {
      repo: env.dataDir,
      init: true, // auto init
      config: {
        Addresses: {
          API: `/ip4/127.0.0.1/tcp/${env.apiPort}`,
          Gateway: `/ip4/127.0.0.1/tcp/${env.gatewayPort}`,
          // Swarm: `/ip4/127.0.0.1/tcp/${env.swarmPort}`,
        },
        API: {
          HTTPHeaders: {
            'Access-Control-Allow-Origin': ['*'],
            'Access-Control-Allow-Methods': ['GET', 'PUT', 'POST'],
            'Access-Control-Allow-Headers': ['Authorization'],
            'Access-Control-Expose-Headers': ['Location'],
            'Access-Control-Allow-Credentials': ['true'],
          },
        },
      },
    },
    forceKill: true,
    forceKillTimeout: 5000,
  });

  return daemon;
};

module.exports = { ensureBinary, ensureDaemon };
