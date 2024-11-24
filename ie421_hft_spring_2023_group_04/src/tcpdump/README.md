# TCPDump Parsing Script

This Python script captures packets using `tcpdump`, filters for specific packets sent between an exchange and a client, and calculates the latency. The script then sends this data to a backend server using an API.

## Dependencies

- Python 3.6 or higher
- tcpdump
- requests

To install the dependencies on your vm, run the following command:

```bash
sudo yum install -y python3-pip
pip3 install --user requests
```

## Usage
Set up the script by modifying the exchange_ip, exchange_port, and api_url variables
```bash
exchange_ip = "192.168.33.30"
exchange_port = "3125"
api_url = "http://192.168.33.101:3000/PingPong"
```
Run the script with the following command:
```bash
python3 tcpdump_parsing.py
```
The script will start capturing packets with tcpdump and display the parsed information. When a matching packet is detected, the script calculates the latency and sends the data to the specified API.