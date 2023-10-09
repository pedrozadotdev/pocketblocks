/// <reference path="../pb_data/types.d.ts" />
module.exports = {
  slugify: (str) =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-"),
  createOrg: () => {
    const settingsCollection = $app
      .dao()
      .findCollectionByNameOrId("pbl_settings");
    const settings = new Record(settingsCollection, {
      org_name: "Acme Organization",
    });
    $app.dao().saveRecord(settings);
  },
  changeUserConfigs: (type, del) => {
    const userModel = $app.dao().findCollectionByNameOrId("users");
    switch (type) {
      case "local:username":
        userModel.options.set("allowEmailAuth", false);
        userModel.options.set("requireEmail", false);
        userModel.options.set("allowUsernameAuth", true);
        break;
      case "local:email":
        userModel.options.set("allowUsernameAuth", false);
        userModel.options.set("allowEmailAuth", true);
        userModel.options.set("requireEmail", true);
        break;
      case "local:both":
        userModel.options.set("allowUsernameAuth", true);
        userModel.options.set("allowEmailAuth", true);
        userModel.options.set("requireEmail", true);
        break;
      case "local:delete":
        userModel.options.set("allowUsernameAuth", false);
        userModel.options.set("allowEmailAuth", false);
        userModel.options.set("requireEmail", false);
        break;
      case "oauth":
        userModel.options.set("allowOAuth2Auth", true);
        break;
      case "oauth:delete":
        userModel.options.set("allowOAuth2Auth", false);
        break;
      default: {
        userModel.options.set("allowUsernameAuth", false);
        userModel.options.set("allowEmailAuth", false);
        userModel.options.set("requireEmail", false);
        userModel.options.set("allowOAuth2Auth", false);
      }
    }
    if (del === "oauth") {
      userModel.options.set("allowOAuth2Auth", false);
    } else if (del === "local") {
      userModel.options.set("allowUsernameAuth", false);
      userModel.options.set("allowEmailAuth", false);
      userModel.options.set("requireEmail", false);
    }
    $app.dao().saveCollection(userModel);
  },
  validateAuthFields: (auth) => {
    const local_type = auth.get("local_id_type");
    const autoVerified = auth.get("local_email_auto_verified");
    if (auth.get("type") === "local") {
      if (!local_type) {
        throw new BadRequestError(
          "local_id_type is required in local type mode!"
        );
      }
      if (local_type === "username" && autoVerified) {
        throw new BadRequestError(
          "local_email_auto_verified cannot be true if local_id_type is username!"
        );
      }
      if (auth.get("oauth_custom_name") || auth.get("oauth_icon_url")) {
        throw new BadRequestError(
          "oauth_* fields should be set only in oauth types mode!"
        );
      }
    } else {
      if (
        auth.get("local_id_label") ||
        auth.get("local_id_input_mask") ||
        local_type ||
        autoVerified
      ) {
        throw new BadRequestError(
          "local_* fields should be set only in local type mode!"
        );
      }
    }
  },
  migrate: () => {
    const snapshot = [
      {
        id: "_pbl_users_auth_",
        created: "2023-10-01 20:45:02.793Z",
        updated: "2023-10-09 13:41:14.134Z",
        name: "users",
        type: "auth",
        system: false,
        schema: [],
        indexes: [],
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        options: {
          allowEmailAuth: false,
          allowOAuth2Auth: false,
          allowUsernameAuth: false,
          exceptEmailDomains: null,
          manageRule: null,
          minPasswordLength: 8,
          onlyEmailDomains: null,
          requireEmail: false,
        },
      },
      {
        id: "buotp00b3wthds4",
        created: "2023-10-01 20:47:08.041Z",
        updated: "2023-10-09 13:40:01.376Z",
        name: "pbl_folders",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "ut4yejq0",
            name: "name",
            type: "text",
            required: true,
            presentable: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "utohiinz",
            name: "created_by",
            type: "relation",
            required: true,
            presentable: false,
            unique: false,
            options: {
              collectionId: "mcmsmx4dil87690",
              cascadeDelete: true,
              minSelect: null,
              maxSelect: 1,
              displayFields: null,
            },
          },
        ],
        indexes: [],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
      {
        id: "5cbl3c26o7q3y4r",
        created: "2023-10-01 20:47:08.041Z",
        updated: "2023-10-09 13:40:01.376Z",
        name: "pbl_groups",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "erbxkpft",
            name: "name",
            type: "text",
            required: true,
            presentable: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "boai0yzu",
            name: "users",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "mcmsmx4dil87690",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: null,
              displayFields: null,
            },
          },
          {
            system: false,
            id: "9gsdvkry",
            name: "avatar",
            type: "url",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: null,
              onlyDomains: null,
            },
          },
        ],
        indexes: [],
        listRule: '@request.auth.id != "" && users.user_id ?= @request.auth.id',
        viewRule: '@request.auth.id != "" && users.user_id ?= @request.auth.id',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
      {
        id: "irij2ydvjhpjirp",
        created: "2023-10-01 20:47:08.042Z",
        updated: "2023-10-09 13:40:01.376Z",
        name: "pbl_settings",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "dl7qasvz",
            name: "org_name",
            type: "text",
            required: true,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "hd84wwqt",
            name: "logo",
            type: "url",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: [],
              onlyDomains: [],
            },
          },
          {
            system: false,
            id: "bcqxifjj",
            name: "icon",
            type: "url",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: null,
              onlyDomains: null,
            },
          },
          {
            system: false,
            id: "bqfjx39c",
            name: "header_color",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            },
          },
          {
            system: false,
            id: "jzvxz6oh",
            name: "home_page",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "qzkeq7euavz7ccm",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: ["id", "name"],
            },
          },
          {
            system: false,
            id: "jygvo6zb",
            name: "themes",
            type: "json",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "ws67fstj",
            name: "script",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "jiz5rzft",
            name: "libs",
            type: "json",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "7jtyk5ep",
            name: "css",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "6ub1q6bc",
            name: "theme",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
      {
        id: "37sihdzrz2vchvc",
        created: "2023-10-01 20:47:08.042Z",
        updated: "2023-10-09 13:40:01.376Z",
        name: "pbl_snapshots",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "rwy6md9w",
            name: "app",
            type: "relation",
            required: true,
            presentable: false,
            unique: false,
            options: {
              collectionId: "qzkeq7euavz7ccm",
              cascadeDelete: true,
              minSelect: null,
              maxSelect: 1,
              displayFields: ["id", "name"],
            },
          },
          {
            system: false,
            id: "ah3ylj3q",
            name: "dsl",
            type: "json",
            required: true,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "lpm7hows",
            name: "context",
            type: "json",
            required: true,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "nvmvoxav",
            name: "created_by",
            type: "relation",
            required: true,
            presentable: false,
            unique: false,
            options: {
              collectionId: "mcmsmx4dil87690",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null,
            },
          },
        ],
        indexes: ["CREATE INDEX `idx_HhOJuLs` ON `pbl_snapshots` (`app`)"],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
      {
        id: "mcmsmx4dil87690",
        created: "2023-10-01 20:47:08.042Z",
        updated: "2023-10-09 13:40:01.377Z",
        name: "pbl_users",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "vjarz45q",
            name: "user_id",
            type: "text",
            required: true,
            presentable: false,
            unique: true,
            options: {
              min: 15,
              max: 15,
              pattern: "",
            },
          },
          {
            system: false,
            id: "jgdjvoe8",
            name: "name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "0nk8v0g8",
            name: "avatar",
            type: "file",
            required: false,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              maxSize: 5242880,
              mimeTypes: [
                "image/jpeg",
                "image/png",
                "image/svg+xml",
                "image/gif",
                "image/webp",
              ],
              thumbs: [],
              protected: false,
            },
          },
          {
            system: false,
            id: "ferbzow6",
            name: "avatar_url",
            type: "url",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: null,
              onlyDomains: null,
            },
          },
        ],
        indexes: [
          "CREATE UNIQUE INDEX `idx_PiBIa6f` ON `pbl_users` (`user_id`)",
        ],
        listRule: '@request.auth.id != "" && @request.auth.id = user_id',
        viewRule: '@request.auth.id != ""',
        createRule: null,
        updateRule:
          '@request.auth.id != "" && @request.auth.id = user_id && @request.data.user_id:isset = false',
        deleteRule: null,
        options: {},
      },
      {
        id: "qzkeq7euavz7ccm",
        created: "2023-10-01 20:47:08.043Z",
        updated: "2023-10-09 13:40:01.377Z",
        name: "pbl_applications",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "akn1tsal",
            name: "name",
            type: "text",
            required: true,
            presentable: true,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "jzbgbqng",
            name: "slug",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            },
          },
          {
            system: false,
            id: "7dszyexu",
            name: "type",
            type: "number",
            required: true,
            presentable: false,
            unique: false,
            options: {
              min: 1,
              max: 6,
              noDecimal: false,
            },
          },
          {
            system: false,
            id: "a8v7tnwa",
            name: "status",
            type: "select",
            required: true,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: ["NORMAL", "RECYCLED"],
            },
          },
          {
            system: false,
            id: "fjt8hbgb",
            name: "public",
            type: "bool",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "zw10iltv",
            name: "all_users",
            type: "bool",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "1jz4dasq",
            name: "created_by",
            type: "relation",
            required: true,
            presentable: false,
            unique: false,
            options: {
              collectionId: "mcmsmx4dil87690",
              cascadeDelete: true,
              minSelect: null,
              maxSelect: 1,
              displayFields: null,
            },
          },
          {
            system: false,
            id: "d4eis2i5",
            name: "groups",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "5cbl3c26o7q3y4r",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: null,
              displayFields: ["id", "name"],
            },
          },
          {
            system: false,
            id: "c7sv0wnb",
            name: "users",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "mcmsmx4dil87690",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: null,
              displayFields: null,
            },
          },
          {
            system: false,
            id: "emmg3c0n",
            name: "app_dsl",
            type: "json",
            required: true,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "xf4jqmlk",
            name: "edit_dsl",
            type: "json",
            required: true,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "i2elgt3k",
            name: "folder",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "buotp00b3wthds4",
              cascadeDelete: true,
              minSelect: null,
              maxSelect: 1,
              displayFields: ["id", "name"],
            },
          },
        ],
        indexes: [
          "CREATE UNIQUE INDEX `idx_6puZ5rc` ON `pbl_applications` (`slug`)",
        ],
        listRule:
          'public = true || (@request.auth.id != "" && (all_users = true || users.user_id ?= @request.auth.id || groups.users.user_id ?= @request.auth.id))',
        viewRule:
          'public = true || (@request.auth.id != "" && (all_users = true || users.user_id ?= @request.auth.id || groups.users.user_id ?= @request.auth.id))',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
      {
        id: "qyddcgq509sns52",
        created: "2023-10-06 20:38:52.228Z",
        updated: "2023-10-09 13:40:01.377Z",
        name: "pbl_auth",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "5mopwlkp",
            name: "type",
            type: "select",
            required: true,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: [
                "local",
                "google",
                "facebook",
                "github",
                "gitlab",
                "discord",
                "twitter",
                "microsoft",
                "spotify",
                "kakao",
                "twitch",
                "strava",
                "gitee",
                "livechat",
                "gitea",
                "oidc",
                "oidc2",
                "oidc3",
                "apple",
                "instagram",
                "vk",
                "yandex",
              ],
            },
          },
          {
            system: false,
            id: "cbcxosyo",
            name: "local_id_label",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "wllrsxmb",
            name: "local_id_input_mask",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "q8uzb9bc",
            name: "local_id_type",
            type: "select",
            required: false,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: ["username", "email", "both"],
            },
          },
          {
            system: false,
            id: "5ujwz8j4",
            name: "local_email_auto_verified",
            type: "bool",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
          {
            system: false,
            id: "beuyhl9a",
            name: "oauth_custom_name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: "",
            },
          },
          {
            system: false,
            id: "sgedslhb",
            name: "oauth_icon_url",
            type: "url",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: null,
              onlyDomains: null,
            },
          },
          {
            system: false,
            id: "hdnegskp",
            name: "allow_signup",
            type: "bool",
            required: false,
            presentable: false,
            unique: false,
            options: {},
          },
        ],
        indexes: ["CREATE UNIQUE INDEX `idx_YJrGSfP` ON `pbl_auth` (`type`)"],
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        options: {},
      },
    ];

    const collections = snapshot.map((item) => new Collection(item));
    $app.dao().importCollections(collections, true, null);
  },
  removeAutoMigrations: () => {
    $os.removeAll($filepath.join($filepath.dir(__hooks), "pb_migrations"));
  },
};
