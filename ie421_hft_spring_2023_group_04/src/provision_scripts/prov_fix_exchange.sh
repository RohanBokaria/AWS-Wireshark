#!/bin/bash
grep -qxF "export CUR_IP=$CUR_IP" /home/vagrant/.bash_profile || echo "export CUR_IP=$CUR_IP" >> /home/vagrant/.bash_profile

sudo yum install -y git
cd ~
git clone https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project.git vagrant
git config --global --unset-all user.name
git config --global --unset-all user.email

echo "installing system dependencies"
sudo yum install -y python3 python3-devel gcc libpcap libpcap-devel
echo "python3 install successful"

echo "installing python dependencies"
cd ~/vagrant/src/exchange
pip3 install -r requirements.txt --user
echo "python dependencies install successful"

echo "Building custom C nanosleep module"
python3 setup.py build
cp build/lib*/*.so .

echo "Building custom packet capturing program"
cd ~/vagrant/src/tcpdump
make
sudo setcap cap_net_raw,cap_net_admin=eip ./netcap_upload

echo "Exchange Provision Ran"
