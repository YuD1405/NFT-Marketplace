import os
import json
import requests
import time

metadata_folder = './json'  # folder chứa json
gateway = 'https://gateway.pinata.cloud/ipfs/'

def ipfs_to_http(ipfs_url):
    if ipfs_url.startswith("ipfs://"):
        parts = ipfs_url.replace("ipfs://", "").split("/")
        return f"{gateway}{parts[0]}/{'/'.join(parts[1:])}"
    return ipfs_url

for filename in os.listdir(metadata_folder):
    if filename.endswith('.json'):
        filepath = os.path.join(metadata_folder, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        image_ipfs = data.get('image')
        image_http = ipfs_to_http(image_ipfs)

        try:
            res = requests.head(image_http, timeout=10)
            if res.status_code == 200:
                print(f"✅ {filename} → OK: {image_http}")
            else:
                print(f"❌ {filename} → Broken link (Status {res.status_code}): {image_http}")
            time.sleep(0.5)
        except Exception as e:
            print(f"❌ {filename} → ERROR: {e}")
        
