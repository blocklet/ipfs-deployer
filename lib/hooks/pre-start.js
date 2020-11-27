/* eslint-disable no-console */
process.env.DEBUG = 'ipfsd-ctl:*';

process
  .on('uncaughtException', (error) => {
    console.error(error.message);
    process.exit(1);
  })
  .on('unhandledRejection', (reason) => {
    console.error(reason.message);
    process.exit(1);
  });

const { ensureBinary } = require('../util');

(async () => {
  try {
    const binPath = await ensureBinary();
    console.log('go-ipfs binary is found at', binPath);
  } catch (err) {
    throw new Error(
      `go-ipfs download failed due to error: ${err.message}, maybe you should set IPFS_DIST_URL to fix this`
    );
  }
})();
