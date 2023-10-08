/// <reference path="../pb_data/types.d.ts" />

//Sync pbl_user with user/admin
onAdminAfterCreateRequest((e) => {
  const usersCollection = $app.dao().findCollectionByNameOrId("pbl_users");
  const user = new Record(usersCollection);
  const form = new RecordUpsertForm($app, user);
  const n = e.admin.email.split("@")[0];
  form.loadData({
    name: n && n[0].toUpperCase() + n.slice(1),
    user_id: e.admin.id,
  });

  form.submit();
});

onAdminAfterDeleteRequest((e) => {
  const user = $app
    .dao()
    .findFirstRecordByData("pbl_users", "user_id", e.admin.id);
  $app.dao().deleteRecord(user);
});

onRecordAfterCreateRequest((e) => {
  const usersCollection = $app.dao().findCollectionByNameOrId("pbl_users");
  const user = new Record(usersCollection);
  const form = new RecordUpsertForm($app, user);
  const email = e.record.get("email");
  const n = email ? email.split("@")[0] : "NONAME";
  form.loadData({
    name: n && n[0].toUpperCase() + n.slice(1),
    user_id: e.record.get("id"),
  });

  form.submit();
}, "users");

onRecordAfterDeleteRequest((e) => {
  const user = $app
    .dao()
    .findFirstRecordByData("pbl_users", "user_id", e.record.get("id"));
  $app.dao().deleteRecord(user);
}, "users");

onRecordAfterAuthWithOAuth2Request((e) => {
  if (e.isNewRecord) {
    const user = $app
      .dao()
      .findFirstRecordByData("pbl_users", "user_id", e.record.get("id"));
    if (e.oAuth2User.name) {
      user.set("name", e.oAuth2User.name);
    }
    if (e.oAuth2User.avatarUrl) {
      user.set("avatar_url", e.oAuth2User.avatarUrl);
    }
    $app.dao().saveRecord(user);
  }
});

//Create/Update app slug
onRecordBeforeCreateRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  e.record.set("slug", pblUtils.slugify(e.record.get("name")));
}, "pbl_applications");

onRecordBeforeUpdateRequest((e) => {
  const currentApp = $app
    .dao()
    .findRecordById("pbl_applications", e.record.get("id"));
  if (currentApp.get("name") !== e.record.get("name")) {
    const pblUtils = require(`${__hooks}/pbl_utils.js`);
    e.record.set("slug", pblUtils.slugify(e.record.get("name")));
  }
}, "pbl_applications");

//Prevent create more than one organization
onRecordBeforeCreateRequest(() => {
  const firstSettings = $app.dao().findFirstRecordByFilter("pbl_settings", "");
  if (firstSettings) {
    throw new BadRequestError("Organization already exists!");
  }
}, "pbl_settings");

//Sync user model with pbl_auth
onRecordBeforeCreateRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  if (e.record?.get("type") === "local") {
    pblUtils.changeUserConfigs(
      `${e.record?.get("type")}:${e.record?.get("local_id_type")}`
    );
  } else {
    pblUtils.changeUserConfigs("oauth");
  }
}, "pbl_auth");

onRecordBeforeUpdateRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  if (e.record?.get("type") === "local") {
    pblUtils.changeUserConfigs(
      `${e.record?.get("type")}:${e.record?.get("local_id_type")}`
    );
  } else {
    pblUtils.changeUserConfigs("oauth");
  }
}, "pbl_auth");

onRecordAfterDeleteRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  if (e.record?.get("type") === "local") {
    pblUtils.changeUserConfigs("local:delete");
  } else {
    try {
      $app.dao().findFirstRecordByFilter("pbl_auth", 'type!="local"');
    } catch (e) {
      pblUtils.changeUserConfigs("oauth:delete");
    }
  }
}, "pbl_auth");

//Prevent signup with disabled auth type
onRecordBeforeCreateRequest((e) => {
  const info = $apis.requestInfo(e.httpContext);
  const isAdmin = !!info.admin;
  const isPasswordSignup = !!info.data.password;
  try {
    const localAuth = $app
      .dao()
      .findFirstRecordByData("pbl_auth", "type", "local");
    if (!isAdmin && isPasswordSignup && !localAuth.get("allow_signup")) {
      throw new Error();
    }
  } catch (e) {
    throw new BadRequestError(
      isAdmin
        ? "Please create a pbl_auth local record!"
        : "You cannot signup with this provider!"
    );
  }
  if (localAuth.get("local_id_type") === "username" && !info.data.username) {
    throw new BadRequestError("Username is required!");
  }
}, "users");

onRecordBeforeAuthWithOAuth2Request((e) => {
  try {
    const auth = $app
      .dao()
      .findFirstRecordByData("pbl_auth", "type", e.providerName);
    if (!auth.get("allow_signup") && e.isNewRecord) {
      throw new Error();
    }
  } catch (e) {
    throw new BadRequestError("You cannot signup with this provider!");
  }
});

// Auto Verified Email Feature
onRecordAfterCreateRequest((e) => {
  try {
    const localAuth = $app
      .dao()
      .findFirstRecordByData("pbl_auth", "type", "local");
    if (localAuth.get("local_email_auto_verified")) {
      const user = $app.dao().findRecordById("users", e.record.get("id"));
      user.set("verified", true);
      $app.dao().saveRecord(user);
    }
  } catch (e) {
    //Ignore
  }
}, "users");
