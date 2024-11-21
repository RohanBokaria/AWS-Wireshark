import websocket
import json

class CryptoWebSocket:
    def __init__(self, base_url, stream_name):
        self.socket = f"{base_url}/{stream_name}"

    def on_message(self, ws, message):
        data = json.loads(message)
        print(f"Message: {data}")

    def start(self):
        ws = websocket.WebSocketApp(
            self.socket,
            on_message=self.on_message
        )
        ws.run_forever()


if __name__ == "__main__":
    base_url = "wss://stream.binance.com:9443/ws"
    stream_name = "btcusdt@trade"
    client = CryptoWebSocket(base_url, stream_name)
    client.start()
