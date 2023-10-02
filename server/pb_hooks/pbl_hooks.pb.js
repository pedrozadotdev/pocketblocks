/// <reference path="../pb_data/types.d.ts" />

onAdminBeforeCreateRequest((e) => {
  const usersCollection = $app.dao().findCollectionByNameOrId("pbl_users");
  const user = new Record(usersCollection);
  const form = new RecordUpsertForm($app, user);
  const n = e.admin.email.split("@")[0];
  form.loadData({
    name: n && n[0].toUpperCase() + n.slice(1),
    email: e.admin.email,
  });

  form.submit();
});

onAdminBeforeDeleteRequest((e) => {
  const user = $app
    .dao()
    .findFirstRecordByData("pbl_users", "email", e.admin.email);
  $app.dao().deleteRecord(user);
});

onAdminBeforeUpdateRequest((e) => {
  const currentAdmin = $app.dao().findAdminById(e.admin.id);
  if (currentAdmin.email !== e.admin.email) {
    const user = $app
      .dao()
      .findFirstRecordByData("pbl_users", "email", currentAdmin.email);
    const form = new RecordUpsertForm($app, user);
    form.loadData({
      email: e.admin.email,
    });
    form.submit();
  }
});

onRecordBeforeCreateRequest((e) => {
  const usersCollection = $app.dao().findCollectionByNameOrId("pbl_users");
  const user = new Record(usersCollection);
  const form = new RecordUpsertForm($app, user);
  const n = e.record.get("email").split("@")[0];
  form.loadData({
    name: n && n[0].toUpperCase() + n.slice(1),
    email: e.record.get("email"),
  });

  form.submit();
}, "users");

onRecordBeforeDeleteRequest((e) => {
  const user = $app
    .dao()
    .findFirstRecordByData("pbl_users", "email", e.record.get("email"));
  $app.dao().deleteRecord(user);
}, "users");

onRecordBeforeUpdateRequest((e) => {
  const currentUser = $app.dao().findRecordById("users", e.record.get("id"));
  if (currentUser.get("email") !== e.record.get("email")) {
    const user = $app
      .dao()
      .findFirstRecordByData("pbl_users", "email", currentUser.get("email"));
    const form = new RecordUpsertForm($app, user);
    form.loadData({
      email: e.record.get("email"),
    });
    form.submit();
  }
}, "users");

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
