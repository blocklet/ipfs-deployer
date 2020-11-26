/* eslint-disable no-console */
process.env.DEBUG = 'ipfsd-ctl:*';

const { ensureBinary } = require('../util');

(async () => {
  try {
    const binPath = await ensureBinary();
    console.log('go-ipfs binary is found at', binPath);
  } catch (err) {
    console.error(err);
  }
})();
