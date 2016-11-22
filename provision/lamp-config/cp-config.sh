#!/usr/bin/env bash
cd "$(dirname "$0")"

sudo cp ../apache2/envvars /etc/apache2/envvars -v
sudo cp ../apache2/000-default.conf /etc/apache2/sites-available/ -v
sudo cp ../php/php.ini /etc/php5/apache2/ -v

sudo service apache2 restart