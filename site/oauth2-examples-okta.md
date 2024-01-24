# Use Okta as OAuth 2.0 server

Demonstrate how to authenticate using OAuth 2.0 protocol
and Okta as Authorization Server using the following flows:

1. Access management ui via a browser :ballot_box_with_check:

## Prerequisites to follow this guide

- Have an account in https://www.okta.com.
- Docker

## Create your app integration in Okta UI

When using **Okta as OAuth 2.0 server**, your client app (in our case RabbitMQ) needs a way to trust the security tokens issued to it by the **Okta OIDC Sign-In Widget**.

The first step in establishing that trust is by **creating your app** with the identity platform in Okta. More details about App registration in Okta are available [here](https://help.okta.com/en-us/Content/Topics/Apps/Apps_App_Integration_Wizard_OIDC.htm).

Once you have logged onto your account in [Okta](https://www.okta.com), follow below steps:

<ol>
<li>In the Admin Console, go to Applications.</li>
<li>Click Create App Integration.</li>
<li>To create an OIDC app integration, select OIDC - OpenID Connect as the Sign-in method.</li>
<li>Choose the type of application to integrate with Okta. Select Web Application, Single-Page Application, or Native Application. In our use case it is Single-Page Application(SPA).</li>
<li>Click Next. </li>
</ol>

The App Integration Wizard for OIDC has three sections:

In General Settings, provide the following information:

  - **Name**: App integration name: Specify a name for your app integrationn (ex: *rabbitmq-oauth2*)
  - **Grant type**: Select **Authorization Code** and **Refresh Token**
  - **Redirect URI**:
    * On the **Sign-in redirect URIs** type http://localhost:15672/js/oidc-oauth/login-callback.html
    * Configure the **Sign-out redirect URIs** to https://localhost:15672

In Trusted Origins (for Web and Native app integrations), choose **keep the default values**.

In Assignments, choose **Allow everyone in your organization to access**.

Finally, click on **Save** and write down the following values, as you will need them later to configure RabbitMQ:  

  * **ClientID**  
  * **Okta domain name**

## Create Okta OAuth 2.0 authorization server, scopes and claims for your app

An authorization server is used to authenticate users and issue access tokens that can be used to access protected resources. In Okta, an authorization server can be used to define scopes, which are essentially permissions that determine what resources a user can access. By defining scopes, you can control the level of access that different users have to your resources.

Here are the steps to create scopes for `admin` and `dev` groups using the default authorization server in Okta:

1. Log in to your Okta account and navigate to the **Authorization Servers** tab in the Okta Console under **Security-> API**.

2. Click on the default authorization server that is provided.

3. Click on the **Scopes** tab and then click the **Add Scope** button.

4. Enter `admin` as the name of the scope and a description if desired.

5. Repeat step 4 to create a scope for `dev`.

6. Save your changes.

And below are the steps to create claim for **role** to distinguish `admin` and `dev` groups when authenticating using the default authorization server in Okta:

1. Log in to your Okta account and navigate to the **Authorization Servers** tab in the Okta Console under **Security-> API**.

2. Click on the default authorization server that is provided.

3. Click on the **Claims** tab and then click the **Add Claim** button.

4. Enter `role` as the name of the claim.

5. Choose **Access Token** as Include in token type.

6. Choose **Expression** as Value type

7. In **Value** field enter the following expression:  
  `isMemberOfGroupName("admin") ? "admin" : isMemberOfGroupName("monitoring") ? "monitoring" : ""`

8. Click on create.


**Note**: the expression above returns a claim named `role` with value `admin` if the user is a member of the `admin` group, and `monitoring` if the user is a member of the `monitoring` group:

### Create groups to allow access to RabbitMQ Management UI

1. Log in to your Okta Admin Dashboard and navigate to the **Groups** page by clicking on the **Groups** tab in the top menu.

2. Click the **Add Group** button in the top right corner of the page.

3. In the **Add Group** dialog box, enter a name for the group in the **Group Name** field. You can also enter a description for the group in the **Description** field, although this is optional.

4. If you want to add members to the group right away, you can do so by clicking the **Add People** button in the **Members** section of the dialog box. You can search for users by name or email address, and add them to the group by selecting their name and clicking the **Add** button.

5. If you want to set group rules, you can do so by clicking the **Rules** tab in the dialog box. Group rules allow you to automatically add or remove users from the group based on criteria such as their email domain, job title, or department.

6. Once you've finished configuring the group, click the **Create Group** button to create the group.


## Assign App and users to groups

To assign a user to a group in Okta, and grant them access to an app associated with that group, you can follow these steps. For our use case we want to assign some users to `dev` and `admin` group and assign the `rabbitmq-oauth2` app to both groups.

1. Log in to your Okta Admin Dashboard and navigate to the **Users** page by clicking on the **Directory** tab in the top menu, and then selecting **People**.

2. Find the user you want to assign to the groups, and click on their name to open their user profile.

3. In the user profile, click on the **Groups** tab to view the groups that the user is currently a member of.

4. To add the user to a group, click the **Add Group** button in the top right corner of the page. Select the group you want to add the user to from the list of available groups, and click the **Add** button to add the user to the group.

5. To grant the user access to an app associated with the group, navigate to the **Applications** tab in the user profile. Find the app you want to grant access to, and click on the app name to open its settings.

6. In the app settings, click on the **Assignments** tab to view the users and groups that are currently assigned to the app.

7. To add the user to the app, click the **Assign** button in the top right corner of the page. Select the group you want to assign the user to from the list of available groups, and click the **Assign** button to assign the user to the app for that group.

8. Repeat steps 4-7 to add the user to any additional groups and apps.

Once you've added the user to the appropriate groups and apps, they should have access to the app and any resources associated with those groups.


## Configure RabbitMQ to use Okta  as OAuth 2.0 authentication backend:

The configuration on Okta side is done. You now have to configure RabbitMQ to use the resources you just created.

[rabbitmq.config](https://github.com/rabbitmq/rabbitmq-oauth2-tutorial/tree/main/conf/okta/rabbitmq.config) is a RabbitMQ advanced configuration to **enable okta as OAuth 2.0 authentication backend** for the RabbitMQ OAuth2 and Management plugins.

Update it with the following values (you should have noted these in the previous steps):

  - **{okta-domain-name}** associated to your okta domain name>.
  - **okta_client_app_ID** associated to the okta app that you registered in okta for rabbitMQ.


## Start RabbitMQ

Run the following commands to run RabbitMQ docker image:

<pre class="lang-bash">
export MODE=okta
make start-rabbitmq
</pre>


## Verify RabbitMQ Management UI access

Go to RabbitMQ Management UI `https://localhost:15671`. Depending on your browser, ignore the security warnings (raised by the fact that you are using a self-signed certificate) to proceed.

Once on the RabbitMQ Management UI page, click on the **Click here to log in** button,
authenticate with your **okta user**.

At the end, you should be redirected back to the RabbitMQ Management UI.
