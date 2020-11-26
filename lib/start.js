/* eslint-disable no-console */
process.env.DEBUG = 'ipfsd-ctl:*';

const express = require('express');

const { ensureDaemon } = require('./util');
const env = require('./env');

const app = express();

let daemon = null;

app.use((req, res) => {
  if (daemon) {
    daemon.api
      .id()
      .then((id) => {
        res.send(`Your IPFS node is running, id: ${id}`);
      })
      .catch((err) => {
        res.send(`Failed to get daemon id: ${err.message}`);
      });
  } else {
    res.send('Your IPFS node is starting, please refresh a few minutes later...');
  }
});

app.listen(env.adminPort, async () => {
  console.log('ipfs admin ready on port', env.adminPort);

  daemon = await ensureDaemon();

  try {
    await daemon.init();
    console.error('ipfs repo init success');
  } catch (err) {
    console.error('ipfs repo init failed', err);
  }

  try {
    await daemon.start();
    console.log('ipfs daemon started', env);
  } catch (err) {
    console.log('ipfs daemon start failed', err);
  }
});

// [
//   'SIGINT',
//   'SIGTERM',
//   'SIGHUP', // the console window is closed
//   'SIGBREAK', // <Ctrl>+<Break> (in Windows)
// ].forEach((sig) => {
//   process.on(sig, async () => {
//     if (daemon) {
//       try {
//         await daemon.stop();
//         console.log('ipfs daemon stopped', sig);
//       } catch (err) {
//         console.log('ipfs daemon stop failed', err);
//       }
//     }
//   });
// });
