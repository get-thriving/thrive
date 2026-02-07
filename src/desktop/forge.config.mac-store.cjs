const {
  outDir,
  packagerConfig,
  hooks,
  rebuildConfig,
  plugins,
} = require("./forge.config.common.cjs");

module.exports = {
  outDir: outDir,
  packagerConfig: {
    ...packagerConfig,
    osxSign: process.env.QUICK
      ? undefined
      : {
          provisioningProfile: "../../secrets/Thrive_MacOS.provisionprofile",
          identity: "Apple Distribution: Horia Coman",
          type: "distribution",
          verbose: true,
          hardenedRuntime: true,
          continueOnError: false,
        },
  },
  hooks: hooks,
  rebuildConfig: rebuildConfig,
  makers: [
    {
      name: "@electron-forge/maker-pkg",
      config: {
        identity: "3rd Party Mac Developer Installer: Horia Coma",
      },
    },
  ],
  plugins: plugins,
};
