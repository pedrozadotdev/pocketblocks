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
    const usersCollection = $app.dao().findCollectionByNameOrId("pbl_users");
    const user = new Record(usersCollection);
    const form = new RecordUpsertForm($app, user);
    const email = e.record.get("email");
    const n = email ? email.split("@")[0] : "NONAME";
    form.loadData({
      name: e.oAuth2User.name || (n && n[0].toUpperCase() + n.slice(1)),
      user_id: e.record.get("id"),
      avatar_url: e.oAuth2User.avatarUrl,
    });
    form.submit();
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
  pblUtils.validateAuthFields(e.record);
  if (e.record?.get("type") === "local") {
    const types = e.record?.get("local_id_type");
    pblUtils.changeUserConfigs(
      `${e.record?.get("type")}:${types.length > 1 ? "both" : types[0]}`
    );
  } else {
    pblUtils.changeUserConfigs("oauth");
  }
}, "pbl_auth");

onRecordBeforeUpdateRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  pblUtils.validateAuthFields(e.record);
  let del;
  const currentAuth = $app.dao().findRecordById("pbl_auth", e.record.id);
  if (e.record?.get("type") === "local") {
    if (currentAuth.get("type") !== "local") {
      try {
        $app
          .dao()
          .findFirstRecordByFilter(
            "pbl_auth",
            `id != "${e.record.id}" && type !== "local"`
          );
      } catch (e) {
        del = "oauth";
      }
    }
    const types = e.record?.get("local_id_type");
    pblUtils.changeUserConfigs(
      `local:${types.length > 1 ? "both" : types[0]}`,
      del
    );
  } else {
    if (currentAuth.get("type") === "local") {
      del = "local";
    }
    pblUtils.changeUserConfigs("oauth", del);
  }
}, "pbl_auth");

onRecordBeforeDeleteRequest((e) => {
  const pblUtils = require(`${__hooks}/pbl_utils.js`);
  try {
    if (e.record?.get("type") === "local") {
      pblUtils.changeUserConfigs("local:delete");
    } else {
      const auths = $app
        .dao()
        .findRecordsByFilter("pbl_auth", 'type != "local"');
      if (auths.length === 1) {
        pblUtils.changeUserConfigs("oauth:delete");
      }
    }
  } catch (e) {
    throw new BadRequestError(
      "You cannot remove more than one auth method at the same time. Try again!"
    );
  }
}, "pbl_auth");

//Prevent signup with disabled auth type
onRecordBeforeCreateRequest((e) => {
  const info = $apis.requestInfo(e.httpContext);
  const isAdmin = !!info.admin;
  const isPasswordSignup = !!info.data.password;
  let localAuth;
  try {
    localAuth = $app.dao().findFirstRecordByData("pbl_auth", "type", "local");
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
  if (localAuth.get("local_id_type") === "username") {
    if (!info.data.username) {
      throw new BadRequestError("Username is required!");
    }
    if (!!info.data.email) {
      throw new BadRequestError(
        "Don't use email when local_id_type is username!"
      );
    }
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

// Prevent update username/email/password if not enabled
onRecordBeforeUpdateRequest((e) => {
  let localAuth;
  try {
    localAuth = $app.dao().findFirstRecordByData("pbl_auth", "type", "local");
  } catch (e) {
    //Ignore
  }
  if (localAuth) {
    const info = $apis.requestInfo(e.httpContext);
    const isAdmin = !!info.admin;
    const isUsernameSetted = !!info.data.username;
    const isPasswordSetted =
      !!info.data.password || !!info.data.passwordConfirm;
    const allowUpdate = localAuth.get("local_allow_update");
    if (!isAdmin) {
      if (isUsernameSetted && !allowUpdate.includes("username")) {
        throw new BadRequestError("You cannot update the username");
      }
      if (isPasswordSetted && !allowUpdate.includes("password")) {
        throw new BadRequestError("You cannot update the password");
      }
    }
  }
}, "users");

onRecordBeforeRequestEmailChangeRequest((e) => {
  let localAuth;
  try {
    localAuth = $app.dao().findFirstRecordByData("pbl_auth", "type", "local");
  } catch (e) {
    //Ignore
  }
  if (localAuth && !localAuth.get("local_allow_update").includes("email")) {
    throw new BadRequestError("You cannot update the email");
  }
}, "users");

//Send back the current email to autologin
onRecordAfterConfirmEmailChangeRequest((e) => {
  const user = $app.dao().findRecordById("users", e.record.get("id"));
  const email = user.get("email");
  e.httpContext.json(200, { email });
  return hook.StopPropagation;
});
