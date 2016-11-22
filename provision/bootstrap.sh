#!/usr/bin/env bash

sudo su - vagrant

# Use single quotes instead of double quotes to make it work with special-character passwords
PASSWORD='test'

# install apache 2.5 and php 5.5
sudo apt-get install -y apache2
sudo apt-get install -y php5
sudo apt-get install php5-mcrypt -y
sudo apt-get install php5-curl -y
sudo apt-get install php5-xdebug -y
sudo apt-get install php5-imagick -y
sudo php5enmod imagick
sudo php5dismod xdebug

sudo php5enmod mcrypt
sudo cp /vagrant/php-cli.ini /etc/php5/cli/php.ini
sudo cp /vagrant/php.ini /etc/php5/apache2/php.ini
sudo cp /vagrant/hosts /etc/hosts

sudo chown vagrant /var/www/
sudo cp /vagrant/provision/apache2/000-default.conf /etc/apache2/sites-available/000-default.conf


# install mysql and give password to installer
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password $PASSWORD"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $PASSWORD"
sudo apt-get -y install mysql-server
sudo apt-get install php5-mysql

sudo cp /vagrant/provision/sql/my.cnf /etc/mysql/my.cnf
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -uroot -ptest mysql
mysql -uroot -ptest < /vagrant/provision/sql/users.sql

sudo service mysql restart


# enable mod_rewrite
sudo a2enmod rewrite
#sudo a2enmod ssl


# restart apache
service apache2 restart

# install git
sudo apt-get -y install git
git config --global push.default simple
git config --global user.email "russjohnson09@gmail.com"
git config --global user.name "Russ Johnson"

git config --global pack.threads 1
git config --global pack.deltaCacheSize 250m
git config --global pack.packSizeLimit  250m
git config --global pack.windowMemory 250m

git config --global core.packedGitLimit 250m
git config --global core.packedGitWindowSize  250m


