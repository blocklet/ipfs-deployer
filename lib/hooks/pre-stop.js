/* eslint-disable no-console */
process.env.DEBUG = 'ipfsd-ctl:*';

const { ensureDaemon } = require('../util');

(async () => {
  const daemon = await ensureDaemon();
  await daemon.stop();
  console.log('ipfs daemon stopped');
})();
