#!/bin/bash
cd "$(dirname "$0")"
cd ..


mysql -uroot -ptest -e "drop database russapi;"

mysql -uroot -ptest -e "create database russapi;"


php init --env=Development --overwrite=all


php yii migrate/up --interactive=0


cd tests/casperjs


sudo rm /vagrant/screenshots -R


/usr/local/bin/casperjs test changepassword.js --xunit=results/changepassword.xml &

/usr/local/bin/casperjs test viewsows.js --xunit=results/viewsows.xml &

/usr/local/bin/casperjs test createsowindex.js --xunit=results/createsowindex.xml &

/usr/local/bin/casperjs test index.js --xunit=results/index.xml &

/usr/local/bin/casperjs test login.js --xunit=results/login.xml &

/usr/local/bin/casperjs test viewreadme.js --xunit=results/viewreadme.xml &

wait

