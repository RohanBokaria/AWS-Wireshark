#!/bin/bash
grep -qxF "export CUR_IP=$CUR_IP" /home/vagrant/.bash_profile || echo "export CUR_IP=$CUR_IP" >> /home/vagrant/.bash_profile

sudo yum install -y git
cd ~
git clone https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project.git vagrant
git config --global --unset-all user.name
git config --global --unset-all user.email

echo "installing python3"
sudo yum install -y python3
echo "python3 install successful"

echo "installing python dependencies"
cd ~/vagrant/src/trader
pip3 install -r requirements.txt --user
echo "python dependencies install successful"

echo "Trader Provision Ran"
