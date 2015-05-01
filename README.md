# node-bitbucket 

Mac/Linux | Windows
---- | ----
[![Build Status](https://travis-ci.org/maboiteaspam/node-bitbucket.svg?branch=master)](https://travis-ci.org/maboiteaspam/node-bitbucket) 
| 
[![Windows Build status](http://img.shields.io/appveyor/ci/maboiteaspam/node-bitbucket.svg)](https://ci.appveyor.com/project/maboiteaspam/node-bitbucket/branch/master)

API to programmatically query / write on bitbucket.

Pure NodeJS implementation.


# About this repo

It s a fork or original repo found on github, itself a fork of a bitbucket repo.

I only want to note about the license, i see there is one, i m not interested into this, not at all.

I just need this to work, the rest is pointless.


### Install

```npm i node-bitbucket --save ```

### Usage

```js
    var secrets = {
        username:'',
        password:'',
        oauth = {
            clientId: '',
            secret: ''
        }
    };

    // var secrets = require('./secrets.json');
    
    var BitBucket = require('node-bitbucket').BitBucket;
    var session = var (new BitBucket(true)).authenticatePassword(secrets.username, secrets.password);

    session.getUserApi().getUserData(username, function(){ /* then handler */ });
    session.getRepoApi()...
    session.getSshApi()...
    session.getEmailApi()...
```

### Documentation

Please check source code.

### Todo

- write documentation
- write missing tests (see tests files directly)
- re write example
- fix lint
