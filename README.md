ACME Wine Cellar
=============

Sample Application with Backbone.js, Twitter Bootstrap, Node.js, Express, Redis and MongoDB #

"ACME Wine Cellar" is a sample CRUD application built with with [Backbone.js](http://backbonejs.org/), [Twitter Bootstrap](http://getbootstrap.com/), [Node.js](http://nodejs.org/), [Express](http://expressjs.com/), [Redis](http://redis.io/) and [MongoDB](https://www.mongodb.org/).

The application allows you to browse through a list of wines, as well as add, update, and delete wines.

Installation
-----------------

Confirm you're running as root:

    $ sudo -i

Git clone the demo-app repo to a web directory:

    $ git clone git@github.com:Appdynamics/demo-app.git demo-app

Create a symlink to this Wine Cellar app:

    $ ln -s demo-app/nodes/winecellar winecellar

Install Node.js from [Nodejs.org](http://nodejs.org/download/)

Install [MongoDB](http://docs.mongodb.org/manual/installation/) and start Mongodb

Install [Redis](http://redis.io/download) and start Redis

Install dependent Node.js modules based on package.json declaration

    $ npm install  <in-your-winecellar-home>

Install “request” & “async” modules explicitly

    npm install request async

Install Node.js Agent
-----------------

Follow the instructions on [installing the AppDynamics Node.js Agent](http://docs.appdynamics.com/display/PRO14S/Install+the+App+Agent+for+Node.js).

Be sure to have a 3.8+ controller and insert your variables into the necessary javascript in the head of your front controller. 

```javascript
require("appdynamics").profile({
  controllerHostName: <controller host name>,
  controllerPort: <controller port number>,
  accountName: <AppDynamics account name>, //Required for a controller running in multi-tenant mode.
  accountAccessKey: <AppDynamics account key>, //Required for a controller running in multi-tenant mode.
  applicationName: <app_name>,
  tierName: <tier_name>,
  nodeName:<node_name>, //Prefix to the full node name.
  debug: true //Debug is optional; defaults to false.
 });

```

Run Node Cellar App
-----------------

For a single process

    $ node server.js
    
For a 5 process cluster

    $ node server-cluster.js

Access http://[hostname]:3000

