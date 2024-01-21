# Members and groups

In PocketBlocks, you can organize the members of your workspace using different groups, and assign roles to groups to manage [permissions for resources](permissions-for-resources.md). You can find members and groups settings in **users** and **groups** on Pocketbase Admin Panel.

<figure><img src="../.gitbook/assets/workspace-management/members-and-groups/01.png" alt=""><figcaption></figcaption></figure>

## Manage workspace members

### Workspace roles and permissions

Users can be **Admins** or **Members**. To be an **Admin** the user needs to be a **Pocketbase Admin**, if not, it will be a **member**.

| Role   | Workspace and group level permissions                                                                                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Admin  | <p>Workspace</p><ul><li>Modify workspace information (name, logo, etc.)</li><li>Manage workspace members</li><li>View workspace members</li></ul><p>Groups</p><ul><li>Create groups</li><li>Delete groups</li><li>Manage group members</li></ul> |
| Member | None                                                                                                                                                                                                                                             |

## Manage groups

Group-based management helps to organize members from different functional departments in your workspace. You can create groups in **groups** Pocketbase collection.

<figure><img src="../.gitbook/assets/workspace-management/members-and-groups/02.png" alt=""><figcaption></figcaption></figure>

### Group roles and permissions

The permissions are listed in the table below.

| Role   | Permissions                                                                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin  | <ul><li>Change group name</li><li>Delete groups</li><li>Manage group members</li><li>View group members</li><li>Manage group apps</li><li>View group apps</li></ul> |
| Member | View group apps                                                                                                                                                     |
