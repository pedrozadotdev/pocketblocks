/// <reference path="../pb_data/types.d.ts" />

onBeforeBootstrap(() => {
  $app.onBeforeServe().add(() => {
    const pblUtils = require(`${__hooks}/pbl_utils.js`);
    try {
      $app.dao().findCollectionByNameOrId("pbl_settings");
    } catch (_) {
      pblUtils.migrate();
      pblUtils.createOrg();
      pblUtils.setupSettings();
      pblUtils.removeAutoMigrations();
      console.log("[POCKETBLOCKS]: Initial setup finished!");
    }
  });
});
