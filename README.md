# Angular 1.5 Webpack Stylus Boilerplate

## Webpack & NPM Setup
- TODO: Jade integration works but auto reload fails unless you force webpack to re-compile each time. If you still want to use jade just delete this line

```
//webpack.config.js

jade = null;
```
and change index.html to index.jade (be sure to remove the bundle.js script tag from the old html file as it is auto injected through the html plugin via webpack).

###Run it.

```
npm install -g webpack webpack-dev-server
npm install
npm start
```

The app can be found at `localhost:8080/` by default, or `localhost:8080/webpack-dev-server` for the hot-module version.

## File Setup

File Structure:

```
root
├── app
│   ├── core
│   │       ├──bootstrap.js //angular initializer
│   │       └──vendor.js
│   │
│   ├── index.html
│   ├── index.styl
│   └──index.js
├── .jshintrc
├── node_modules
└── package.json
```

### Hot Mode

Hot mode = live-reload of modules. No need to reload the entire project on every change, just load what changed.

/webpack.config.js

```js
entry: {
    app: ['webpack/hot/dev-server', './index.js']
  }
```

### Quick Start

/package.json

```json
"scripts": {
    "start": "webpack-dev-server --content-base app --hot"
  }
```

#### Bootstrap Angular

I like to bootstrap Angular, rather than adding `ng-app="app"` into the html.

/app/core/bootstrap.js

#### Bootstrap Styles + jQuery

Loaded via cdns for easier cache access
