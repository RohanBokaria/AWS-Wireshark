#!/bin/bash
grep -qxF "export CUR_IP=$CUR_IP" /home/vagrant/.bash_profile || echo "export CUR_IP=$CUR_IP" >> /home/vagrant/.bash_profile

sudo yum install -y git
cd ~
git clone https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project.git vagrant
cd ~/vagrant/src/netcap_app
git config --global --unset-all user.name
git config --global --unset-all user.email

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 16
echo "Node 16 install successful"

echo "Installing dependencies"
npm i -g yarn pm2
yarn

