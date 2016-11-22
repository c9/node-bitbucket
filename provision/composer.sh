#!/usr/bin/env bash

# install Composer
sudo curl -s https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer self-update


composer global require "fxp/composer-asset-plugin:~1.1.1"