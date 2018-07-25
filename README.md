# XSDOMParser

![alt travis ci](https://travis-ci.org/lexmihaylov/XSDOMParser.svg?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b5bfb5f16f5c75c8330b/maintainability)](https://codeclimate.com/github/lexmihaylov/XSDOMParser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b5bfb5f16f5c75c8330b/test_coverage)](https://codeclimate.com/github/lexmihaylov/XSDOMParser/test_coverage)

XSDOMParser is an atempt to support native dom parser in webworkers. The library can work
inside a browser or on nodejs. Although the aim was for this to be a polyfill for 
the DOMParser api, it does not support all it's features.

# Usage
Install the library via `npm`
```bash
npm i xsdomparser
```

Include it in your page:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <script src="node_modules/xsdomparser/xsdomparser.js"></script>
    </head>
    <body>
        <!--comment-->
    </body>
</html>
```

Or include it in your node script
```js
const XSDOMParser = require('xsdomparser');
```