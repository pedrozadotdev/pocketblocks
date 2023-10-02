/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap(() => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  try {
    $app.dao().findCollectionByNameOrId("users");
  } catch (e) {
    return console.log(
      "[POCKETBLOCKS]: First boot detected. Please restart de server!"
    );
  }
  try {
    $app.dao().findCollectionByNameOrId("pbl_settings");
    return;
  } catch (e) {
    try {
      pblUtils.migrate();
    } catch (e) {
      pblUtils.createAdmin();
      pblUtils.createOrg();
      console.log("[POCKETBLOCKS]: Initial setup finished!");
    }
  }
});
