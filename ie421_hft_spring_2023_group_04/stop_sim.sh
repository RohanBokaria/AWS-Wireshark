#!/bin/sh
source ./src/.env
for (( i = 0; i < $NUM_EXCHANGES; i++ ))
do
    vagrant ssh fix_exchange_$i -c 'pkill python'
    echo "Exchange $i stopped."
done
for (( i = 0; i < $NUM_TRADERS; i++ ))
do
    vagrant ssh fix_trader_$i -c 'pkill python'
    echo "Trader $i stopped."
done
