#!/usr/bin/env bash

#nodejs
sudo apt install curl -y

sudo rm /usr/bin/node || true
curl -sL https://deb.nodesource.com/setup | sudo bash - #http://stackoverflow.com/questions/12913141/message-failed-to-fetch-from-registry-while-trying-to-install-any-module
sudo apt-get install nodejs -y

sudo rm /usr/bin/node
sudo ln -s /usr/bin/nodejs /usr/bin/node

sudo apt-get install build-essential -y
sudo apt install npm

sudo npm cache clean -f
sudo npm install -g n
sudo n 6.2.2

sudo rm /usr/bin/node || true
sudo ln -s /usr/local/n/versions/node/6.2.2/bin/node /usr/bin/node

npm rebuild
