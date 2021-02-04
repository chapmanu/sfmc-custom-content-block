# Chapman Salesforce Custom Content Blocks

## Build Commands

### npm start

Run `npm start` to start the development server and navigate to localhost:3000 to display the front-end ui

### npm run build

To start the webpack build of the front-end UI for deployment to Heroku

### npm run deploy

To deploy the app to Heroku

## Recommended Reading/Viewing

Salesforce Trailhead: Salesforce Trailhead [here](https://trailhead.salesforce.com/content/learn/modules/content-builder-block-sdk) for more info on creating Custom Content Blocks

Salesfoce Developer Walkthrough: Salesforce developer walks through of Custom Content Blocks [here](https://www.youtube.com/watch?v=-02YOSySYcA&feature=youtu.be&t=667)

## Salesforce Cloud Package

To create a Custom Content Block a salesforce package needs to be installed with the proper configuration. Currently IS&T William and Mike only has access to create and install packages.

### Custom Content Block Component

Start by installing the component Custom Content Block. Enter the appropriate Name and Description which will be used intarnally for Salesforce display when selecting the Custom Content Block. The `Endpoint URL` is the url where the component is hosted, for more info see [hosting section](#hosting). For more details about the Custom Block Content Component see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/create-content-block.htm)

### API Integration Component

To retrieve salesforce assets and data or to update data the package will need an API integration. Which will generate the necessary auth routes for Server to Server API access see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/api-integration.htm)

The API integration will also need the permission scopes of the Custom Content Block i.e. read/write access for assets and data. For a list of permissions see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/data-access-permissions.htm)

## Salesforce API Access

SMCTech uses Salesforce Custom Content Blocks through Server to Server API Integration for asset and data retrieval and updates,  which you can find documentation for [here](https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/integration-s2s-client-credentials.htm)

### Auth Route

API access is granted through the auth routes created when the [API Integration](#API-Integration-Component) Component was installed on the packaged by posting a request

### REST Endpoint

Asset and data retrieval is used by creating a request to the REST API endpoint created when the [API Integration](#API-Integration-Component) Component was installed on the package. This url will be used as the base url when requesting from the Salesforce Cloud see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/content-api.htm) about the various endpoint requests

### Hosting

Hosting for the custom content block is currently handled on Heroku. To begin update heroku `origin` to the current content block repo 

## Client To Server Asset Requests

Currently the salesforce custom block server is built using `nodejs` with `express`.

### Proxy

Front end requests are proxied on the server to the REST API endpoint created when the [API Integration](#API-Integration-Component)

### Sessions

Each API requests needs to be served with an access token in the headers with the `Authorization` value and access token. Salesforce recommends storing the access token to prevent requesting an access token for each request. Access tokens are valid for 20 minutes and is recommended you retrieve a new token every 18 minutes. `mongoDB` using mLab with [`express-session`](https://github.com/expressjs/session) along with [`connect-mongodb-session`](https://github.com/mongodb-js/connect-mongodb-session#readme) are used to create sessions and store the access token for requests made in the 18 minute valid access token window. Afterward the token is then refreshed on the next requests. 

#### Images

Images are requested using the `query` type outlined in the [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/routes.htm#detail_advancedQuery) for the advanced query. It is currently querying by file extensions specifically `["tif", "tiff", "bmp","jpg", "jpeg", "gif", "png"]`

## Components

Components directory contains the UI for the custom content block and are created using [Javascript Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). These essentially use listeners and lifecycle methods to add and update content for the Content Block dispaly

## Block Tester and Examples

For testing SFMC Custom Content block use [this block tester](http://blocktester.herokuapp.com/) which can be used with localhost and any hosted content blocks. [See Salesforce Tutorial](https://www.youtube.com/watch?v=eJ74dxJ_JSo) for more information. For examples on Custom Content Block [See Salesforce Documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/content-sdk.htm). SFMC also has a [github for more deatils](https://github.com/salesforce-marketingcloud/blocksdk)
