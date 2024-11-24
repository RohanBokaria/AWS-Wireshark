start cmd /k "cd %cd% && vagrant ssh fix_exchange_0 -c 'python3 src/exchange/exchange.py'"
start cmd /k "cd %cd% && vagrant ssh fix_trader_0 -c 'python3 src/trader/trader_msg_generator.py'"
start cmd /k "cd %cd% && vagrant ssh netcap_backend"
start cmd /k "cd %cd% && vagrant ssh fix_exchange_0 -c 'python3 src/tcpdump/tcpdump_parsing.py'"