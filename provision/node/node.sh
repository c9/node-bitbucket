#!/usr/bin/env bash

#nodejs
curl -sL https://deb.nodesource.com/setup | sudo bash - #http://stackoverflow.com/questions/12913141/message-failed-to-fetch-from-registry-while-trying-to-install-any-module
sudo apt-get install nodejs -y
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt-get install build-essential -y
sudo npm install -g request
sudo npm install -g moment

sudo npm cache clean -f
sudo npm install -g n
sudo n 6.2.2

sudo ln -s /usr/local/n/versions/node/6.2.2/bin/node /usr/bin/node


sudo npm install -g request

sudo npm install -g jasmine-node
npm rebuild
