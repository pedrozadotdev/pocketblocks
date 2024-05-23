# Authentication

PocketBlocks provides a huge list of authentication options. If you can use it in [Pocketbase](https://pocketbase.io/), you can use it in PocketBlocks.

## Enable Authentication Options

By default authentication with username and email is enable.

<figure><img src="../.gitbook/assets/workspace-management/auth/08.png" alt=""><figcaption></figcaption></figure>

To allow users to authenticate with **OAuth providers**, go to the Pocketbase Admin Panel, **Settings** in the side menu, select **Auth providers**, and configure some of the options available.

<figure><img src="../.gitbook/assets/workspace-management/auth/01.png" alt=""><figcaption></figcaption></figure>

## Signup

By default, anyone can sign up. To disable the signup page (and feature), create a rule with restrictions.

<figure><img src="../.gitbook/assets/workspace-management/auth/02.png" alt=""><figcaption></figcaption></figure>

## Customization

You can customize some aspects of the authentication page. Go to **PocketBlocks Settings** Page then go to **Authentication**:

<figure><img src="../.gitbook/assets/workspace-management/auth/03.png" alt=""><figcaption></figcaption></figure>

You can change the username input label and apply a mask by selecting the **Local** login type option:

<figure><img src="../.gitbook/assets/workspace-management/auth/04.png" alt=""><figcaption></figcaption></figure>

You also can change the name of an OAuth provider and its icon by selecting the respective login type option:

<figure><img src="../.gitbook/assets/workspace-management/auth/05.png" alt=""><figcaption></figcaption></figure>

## Email Features

To enable password recovery and email verification/change, you need to configure a **SMTP Server** in PocketBase Admin Panel:

<figure><img src="../.gitbook/assets/workspace-management/auth/06.png" alt=""><figcaption></figcaption></figure>
