import subprocess
import re
import requests
import os
import datetime
import json
import sympy
import datetime
from decimal import Decimal
import time
from datetime import datetime, timezone, date
import simplefix

def parse_tcpdump():
    def convert_to_unix_epoch(timestamp_str, dat=None):
        if dat is None:
            dat = date.today()
        dt_str = f'{dat} {timestamp_str[:-3]}'
        dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S.%f")
        nanoseconds = int(timestamp_str[-3:])  # get the last three digits as nanoseconds
        unix_epoch_nano = dt.replace(tzinfo=timezone.utc).timestamp() * 10 ** 9
        unix_epoch_nano += nanoseconds  # add the nanoseconds to the timestamp
        return int(unix_epoch_nano)

    exchange_ip = "192.168.33.30"
    exchange_port = "3125"

    tcpdump_cmd = f"sudo tcpdump --time-stamp-precision=nano -A -i enp0s8 -n -l host {exchange_ip} and port {exchange_port}"
    #tcpdump_cmd = f"sudo tcpdump -A -i enp0s8 'ip host {exchange_ip} and tcp port {exchange_port}'"
    process = subprocess.Popen(tcpdump_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    ping_timestamp = ""
    pong_timestamp = ""
    src_ip = ""

    order_id = None
    for line in process.stdout:
        line = line.decode("utf-8").strip()
        # print(f"Raw Line: {line}")

        order_match = re.search(r'11=(\d+)', line)
        if order_match:
            order_id = order_match.group(1)
            print(f"Order ID: {order_id}")

        match = re.search(
            r"(\d{2}:\d{2}:\d{2}\.\d{9}) IP (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\..* > (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\..*.*length (\d+)",
            line)

        # Assuming FIX message is part of the 'line' variable

        if match:
            # print(f"Raw Line: {line}")
            timestamp, src_ip, dst_ip, length = match.groups()
            if length == "0":
                continue
            if src_ip != exchange_ip:
                ping_timestamp = timestamp
                print(f"Ping timestamp: {ping_timestamp}")
                if ping_timestamp is None:
                    print("ping is NONE!")
            elif ping_timestamp:
                pong_timestamp = timestamp
                print(f"Pong timestamp: {pong_timestamp}")
                if ping_timestamp and pong_timestamp:
                    latency = float(re.search(r"(\d+\.\d+) ms", os.popen(
                        f"echo '{ping_timestamp} {pong_timestamp}' | awk -F '[:.]' '{{printf \"%.3f ms\\n\",($0 - $1) * 3.6e+6+ ($5-$2)*60000 + ($6-$3)*1000 + ($7-$4)}}'").read()).group(
                        1))

                    print(f"Latency: {latency} ns")
                    bigint_value1 = None
                    bigint_value2 = None
                    if ping_timestamp:
                        u1 = convert_to_unix_epoch(ping_timestamp)
                        bigint_value1 = u1

                        print(f"Ping timestamp: {ping_timestamp}")
                    if pong_timestamp:
                        u2 = convert_to_unix_epoch(pong_timestamp)
                        bigint_value2 = u2
                        print(f"Pong timestamp: {pong_timestamp}")

                    # Send data to NestJS API
                    api_url = "http://192.168.33.101:3000/PingPong"
                    data = {
                        "id": order_id,
                        "source_ip": src_ip,
                        "ping_time": bigint_value1,
                        "pong_time": bigint_value2,
                        "latency": latency
                    }
                    response = requests.post(api_url, json=data)
                    print(f"Data sent to API, response: {response.status_code}")
                    ping_timestamp = ""
                    pong_timestamp = ""
                else:
                    print("disappear ping/pong")

if __name__ == "__main__":
    parse_tcpdump()