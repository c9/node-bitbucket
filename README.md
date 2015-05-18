# node-okbitbucket

Mac/Linux | Windows
---- | ----
  [![Build Status](https://travis-ci.org/maboiteaspam/node-okbitbucket.svg?branch=master)](https://travis-ci.org/maboiteaspam/node-okbitbucket) 
| 
  [![Windows Build status](http://img.shields.io/appveyor/ci/maboiteaspam/node-bitbucket.svg)](https://ci.appveyor.com/project/maboiteaspam/node-bitbucket/branch/master)


API to programmatically query / write on bitbucket.

Pure NodeJS implementation.


### Install

```sh
    npm i node-okbitbucket --save
```

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
    
    // enable debug messages
    if ( process.env.NODE_ENV === 'test' ){
      process.env.DEBUG='*';
    }
    
    var BitBucket = require('node-okbitbucket');
    
    var bbt = (new BitBucket())
            .authenticatePassword(secrets.username, secrets.password);

    bbt.getUserApi().getRepositories(username, function(err, repos){  });
    
    bbt.getUsersApi().getUserData(username, function(err, user){  });
    
    bbt.getSshApi().getKeys(function(err, keys){  });
    bbt.getSshApi().addKey(pubkey, function(err){  });
    bbt.getSshApi().deleteKey(pubkey, function(err){  });
    bbt.getSshApi().deleteAllKeys(function(){  });
    
    bbt.getRepoApi().show(username, repo, function(err, userRepo){  })
    bbt.getRepoApi().getUserRepos(username, function(err, repositories){  })
    
    
    bbt.getEmailApi().getAll(username, repo, function(err, userRepo){  })
    
```

### Documentation

* [`BitBucket`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/bitbucket.md)
* [`AbstractApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/abstract_api.md)
* [`EmailApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/email.md)
* [`RepositoryApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/repo.md)
* [`Request`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/request.md)
* [`SshApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/ssh.md)
* [`UserApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/user.md)
* [`UsersApi`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/users.md)

### Test

```
npm run test
DEBUG=node-okbitbucket mocha
```

* [`Test`](https://github.com/maboiteaspam/node-okbitbucket/tree/gh-pages/docs/test.md)


### Todo

- write documentation
- write missing tests (see tests files directly)
- re write example
- fix lint

# About this repo

It s a fork or original repo found on github, itself a fork of a bitbucket repo.

I only want to note about the license, 
i see there is one, 
i m not interested into this, not at all.

I just need this to work, the rest is pointless.