/* eslint-disable no-console */
process.env.DEBUG = 'ipfs-deployer:*';

const fs = require('fs');
const path = require('path');
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
        res.json(id);
      })
      .catch((err) => {
        res.json({ error: `Failed to get daemon id: ${err.message}` });
      });
  } else {
    res.json({ error: 'Your IPFS node is starting, please refresh a few minutes later...' });
  }
});

app.listen(env.adminPort, async () => {
  console.log('ipfs admin ready on port', env.adminPort);

  daemon = await ensureDaemon();
  console.log('ipfs daemon', daemon);

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

[
  'SIGINT',
  'SIGTERM',
  'SIGHUP', // the console window is closed
  'SIGBREAK', // <Ctrl>+<Break> (in Windows)
].forEach((sig) => {
  process.on(sig, () => {
    if (daemon) {
      const api = path.join(env.dataDir, 'api');
      if (fs.existsSync(api)) {
        fs.unlinkSync(api);
        console.log('ipfs api removed', sig);
      }
    }

    process.exit(0);
  });
});
