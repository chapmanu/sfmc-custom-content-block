# Chapman Salesforce Custom Content Blocks

Reccomend completing salesforce trailhead [here]() for more info on creating Custom Content Blocks

Also Reccomend watching developers walk through of Custom Content Blocks [here]()

## Salesforce Cloud Package

To create a Custom Content Block a salesforce package needs to be installed with the proper configuration. Currently IS&T only has access to the create and install packages.

### Custom Content Block Component

Start by installing the component Custom Content Block. Enter the appropriate name and description which will be used intarnally for Salesforce display. The `Endpoint URL` is the url where the component is hosted, for more info see [hosting section](#hosting) for more details about the Custom Block Content Component see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/create-content-block.htm)

### API Integration Component

To access salesforce assets and data or to update data the package will need an API integration. Which will generate the necessary auth routes for Server to Server API access see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/api-integration.htm)

The API integration will also need the permission scopes of the Custom Content Block i.e. read/write access for assets and data. For a list of permissions see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/data-access-permissions.htm)

## Salesforce API Access

SMCTech uses Salesforce Custom Content Blocks through Server to Server API Integration for asset and data retrieval and updates,  which you can find documentation for [here](https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/integration-s2s-client-credentials.htm)

### Auth Route

API access is granted through the auth routes created when the [API Integration](#API-Integration-Component) Component was installed on the packaged by posting a request with the 

### REST Endpoint

Asset and data retrieval is used by creating a request to the REST API endpoint created when the [API Integration](#API-Integration-Component) Component was installed on the package. This url will be used as the base url when requesting from the Salesforce Cloud see [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/content-api.htm) about the various endpoint requests

### Hosting

Hosting for the custom content block is currently handled on Heroku for staging allowing for quick testing. To begin update heroku `origin` to the current content block repo 

## Client To Server Asset Requests

Currently the salesforce custom block server is built using `nodejs` with `express`.

### Proxy

Front end requests are proxied on the server to the REST API endpoint created when the [API Integration](#API-Integration-Component)

### Assets

#### Images

Images are requested using the `query` type outlined in the [salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/routes.htm#detail_advancedQuery) for the advanced query. It is currently querying by file extensions specifically `["tif", "tiff", "bmp","jpg", "jpeg", "gif", "png"]`