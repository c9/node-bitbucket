-- DROP USER IF EXISTS 'dev'@'%';
-- DROP USER IF EXISTS 'dev'@'localhost';
-- DROP USER IF EXISTS 'test'@'%';
-- DROP USER IF EXISTS 'test'@'localhost';

-- create user 'dev3'@'%' identified by 'dev2';
-- create user 'dev3'@'localhost' identified by 'dev2';
-- grant all privileges on *.* to 'dev3'@'%' with grant option;
-- grant all privileges on *.* to 'dev3'@'localhost' with grant option;

create user 'dev2'@'%' identified by 'dev2';
create user 'dev2'@'localhost' identified by 'dev2';
grant all privileges on *.* to 'dev2'@'%' with grant option;
grant all privileges on *.* to 'dev2'@'localhost' with grant option;

create user 'dev'@'%' identified by 'dev';
create user 'dev'@'localhost' identified by 'dev';
grant all privileges on *.* to 'dev'@'%' with grant option;
grant all privileges on *.* to 'dev'@'localhost' with grant option;

create user 'test'@'%' identified by 'test';
create user 'test'@'localhost' identified by 'test';
grant all privileges on *.* to 'test'@'%' with grant option;
grant all privileges on *.* to 'test'@'localhost' with grant option;