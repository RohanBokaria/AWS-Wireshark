import sys
import requests
import json

for line in iter(sys.stdin):
    print(line)
    requests.post("http://192.168.56.101:3000/rawPCAPService", json=json.loads(line));
