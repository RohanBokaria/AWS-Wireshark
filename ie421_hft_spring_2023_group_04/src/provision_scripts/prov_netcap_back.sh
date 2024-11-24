#!/bin/bash
grep -qxF "export CUR_IP=$CUR_IP" /home/vagrant/.bash_profile || echo "export CUR_IP=$CUR_IP" >> /home/vagrant/.bash_profile

# Install NVM and Node 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 16
echo "Node 16 install successful"

sudo yum install -y git
cd ~
git clone https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project.git vagrant
cd ~/vagrant/src/netcap_api
git config --global --unset-all user.name
git config --global --unset-all user.email

echo "Installing dependencies"
npm i -g @nestjs/cli yarn prisma pm2
yarn

# Install MySQL
echo "Installing Oracle MySQL package repo"
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo yum -y install https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm

echo "Installing MySQL 8 Community Server"
sudo yum -y install mysql-community-server

echo "Enabling and starting mysql server"
sudo systemctl start mysqld.service
sudo systemctl enable mysqld.service

echo "Cleaning up security and setting root password to vagrant"
export MYSQLPASS=`sudo grep 'A temporary password' /var/log/mysqld.log |tail -1 | awk '{print $NF}'`

mysql --connect-expired-password --user=root -p$MYSQLPASS <<_EOF_
set password = 'Vagrant123$';
SET GLOBAL validate_password.policy=LOW;
FLUSH PRIVILEGES;
_EOF_

mysql --connect-expired-password --user=root -pVagrant123\$ <<_EOF_
SET GLOBAL validate_password.policy=LOW;
SET GLOBAL validate_password.length=7;
set password = 'vagrant';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
FLUSH PRIVILEGES;
_EOF_

echo "Creating database schema"
mysql -u root -pvagrant < ~/vagrant/create_schema.sql

echo "Finished configuring MySQL"

 echo "Installing prisma"
yarn add @prisma/client

cd ~/vagrant/src/netcap_api
npx prisma db push --accept-data-loss --force-reset --skip-generate
# echo "Finished installing Prisma
