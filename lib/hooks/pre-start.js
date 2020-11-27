/* eslint-disable no-console */
process.env.DEBUG = 'ipfsd-ctl:*';

const { ensureBinary } = require('../util');

(async () => {
  try {
    const binPath = await ensureBinary();
    console.log('go-ipfs binary is found at', binPath);
  } catch (err) {
    console.error(err);
    throw new Error('go-ipfs download failed, maybe you should set IPFS_DIST_URL to fix this');
  }
})();
