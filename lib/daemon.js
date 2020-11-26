// Create a factory to spawn two test disposable controllers, get access to an IPFS api
// print node ids and clean all the controllers from the factory.
const Ctl = require('ipfsd-ctl');

const factory = Ctl.createFactory(
  {
    type: 'go',
    test: true,
    disposable: false,
    ipfsHttpModule: require('ipfs-http-client'),
  },
  {
    go: {
      ipfsBin: 'path/go/ipfs/bin',
    },
  }
);
const ipfsd2 = await factory.spawn({ type: 'go' }); // Spawns using options from `createFactory` but overrides `type` to spawn a `go` controller

console.log(await ipfsd1.api.id());
console.log(await ipfsd2.api.id());

await factory.clean(); // Clean all the controllers created by the factory calling `stop` on all of them.
