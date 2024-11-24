#!/bin/sh
cd ~/vagrant/src/exchange
nohup python3 distributed_exchange.py &
cd ~/vagrant/src/tcpdump
nohup python3 requestGen.py &
