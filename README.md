# ipfs-deployer

![](https://github.com/blocklet/ipfs-deployer/workflows/release-blocklet/badge.svg)
![](https://img.shields.io/badge/Powered%20By-ABT%20Node-yellowgreen)

Blocklet to help you run IPFS nodes on ABT Node

## Install on my ABT Node

[![Install on my ABT Node](https://raw.githubusercontent.com/blocklet/development-guide/main/assets/install_on_abtnode.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2Fblocklet%2Fipfs-deployer%2Freleases%2Fdownload%2F0.9.1%2Fblocklet.json)

## Run and debug in the cloud with Gitpod

Click the "Open in Gitpod" button, Gitpod will start ABT Node and the blocklet.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/blocklet/ipfs-deployer)

## Run and debug locally

```shell
npm install -g @abtnode/cli
git clone git@github.com:blocklet/ipfs-deployer.git
cd ipfs-deployer
```

```shell
make init
make run
```

## Notes

For those who can not access https://dist.ipfs.io, please configure your blocklet to use https://releases.arcblockio.cn as `IPFS_DIST_URL`.

## Contribute

> TODO

## License

The code is licensed under the MIT license found in the
[LICENSE](LICENSE) file.
