# node-bitbucket

API to programmatically query / write on bitbucket.
Pure NodeJS implementation.

### Install

```npm i node-bitbucket --sve ```

### Usage

```js
    var BitBucket = require('node-bitbucket').BitBucket;
    var bb = new BitBucket(true);
    var session = var bb.authenticatePassword(secrets.username, secrets.password);

    session.getUserApi().getUserData(username, function(){ /* then handler */ });
    session.getRepoApi()...
    session.getSshApi()...
    session.getEmailApi()...
```

### Documentation

Please check source code.