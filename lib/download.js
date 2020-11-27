/* eslint-disable no-console */
/*
  Download go-ipfs distribution package for desired version, platform and architecture,
  and unpack it to a desired output directory.

  API:
    download(<version>, <platform>, <arch>, <outputPath>)

  Defaults:
    go-ipfs version: value in package.json/version
    go-ipfs platform: the platform this program is run from
    go-ipfs architecture: the architecture of the hardware this program is run from
    go-ipfs install path: './go-ipfs'
*/
const fs = require('fs');
const path = require('path');
const goenv = require('go-platform');
const gunzip = require('gunzip-maybe');
const tarFS = require('tar-fs');
const unzip = require('unzip-stream');
const fetch = require('node-fetch');

const env = require('./env');

function unpack(url, installPath, stream) {
  return new Promise((resolve, reject) => {
    if (url.endsWith('.zip')) {
      return stream.pipe(unzip.Extract({ path: installPath }).on('close', resolve).on('error', reject));
    }

    return stream.pipe(gunzip()).pipe(tarFS.extract(installPath).on('finish', resolve).on('error', reject));
  });
}

function cleanArguments(version, platform, arch, installPath) {
  const conf = {
    version: env.version,
    distUrl: env.distUrl,
  };

  return {
    version: process.env.TARGET_VERSION || version || conf.version,
    platform: process.env.TARGET_OS || platform || goenv.GOOS,
    arch: process.env.TARGET_ARCH || arch || goenv.GOARCH,
    distUrl: process.env.GO_IPFS_DIST_URL || conf.distUrl,
    installPath: installPath ? path.resolve(installPath) : env.appDir,
  };
}

async function ensureVersion(version, distUrl) {
  const res = await fetch(`${distUrl}/go-ipfs/versions`);
  console.info(`${distUrl}/go-ipfs/versions`);
  if (!res.ok) {
    throw new Error(`Unexpected status: ${res.status}`);
  }

  const versions = (await res.text()).trim().split('\n');

  if (versions.indexOf(version) === -1) {
    throw new Error(`Version '${version}' not available`);
  }
}

async function getDownloadURL(version, platform, arch, distUrl) {
  await ensureVersion(version, distUrl);

  const res = await fetch(`${distUrl}/go-ipfs/${version}/dist.json`);
  if (!res.ok) throw new Error(`Unexpected status: ${res.status}`);
  const data = await res.json();

  if (!data.platforms[platform]) {
    throw new Error(`No binary available for platform '${platform}'`);
  }

  if (!data.platforms[platform].archs[arch]) {
    throw new Error(`No binary available for arch '${arch}'`);
  }

  // eslint-disable-next-line no-shadow
  const { link } = data.platforms[platform].archs[arch];
  return `${distUrl}/go-ipfs/${version}${link}`;
}

async function download({ version, platform, arch, installPath, distUrl }) {
  const url = await getDownloadURL(version, platform, arch, distUrl);
  console.info(`Downloading ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Unexpected status: ${res.status}`);
  }
  console.info(`Downloaded ${url}`);

  await unpack(url, installPath, res.body);
  console.info(`Unpacked ${installPath}`);

  const binPath = path.join(installPath, 'go-ipfs', `ipfs${platform === 'windows' ? '.exe' : ''}`);
  if (fs.existsSync(binPath)) {
    return binPath;
  }
  throw new Error('Unexpected download result: ipfs binary does not exist');
}

module.exports = async (...args) => {
  // eslint-disable-next-line no-param-reassign
  args = cleanArguments(...args);
  const binPath = await download(args);
  return binPath;
};
