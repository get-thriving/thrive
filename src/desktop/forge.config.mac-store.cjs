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
          identity:
            "3rd Party Mac Developer Application: Mike Bestcat (BTZYJ9V34R)",
          type: "distribution",
          verbose: true,
          hardenedRuntime: false,
          continueOnError: false,
        },
  },
  hooks: hooks,
  rebuildConfig: rebuildConfig,
  makers: [
    {
      name: "@electron-forge/maker-pkg",
      config: {
        identity: "3rd Party Mac Developer Installer: Mike Bestcat (BTZYJ9V34R)",
      },
    },
  ],
  plugins: plugins,
};
