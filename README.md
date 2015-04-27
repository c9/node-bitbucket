# node-bitbucket

API to programmatically query / write on bitbucket.
Pure NodeJS implementation.

### Install

```npm i node-bitbucket --save ```

### Usage

```js
    var BitBucket = require('node-bitbucket').BitBucket;
    var session = var (new BitBucket(true)).authenticatePassword(secrets.username, secrets.password);

    session.getUserApi().getUserData(username, function(){ /* then handler */ });
    session.getRepoApi()...
    session.getSshApi()...
    session.getEmailApi()...
```

### Documentation

Please check source code.