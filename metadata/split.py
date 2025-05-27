import json
import re

input_filename = 'nfts.json'

with open(input_filename, 'r', encoding='utf-8') as f:
    nft_list = json.load(f)

for nft in nft_list:
    # Lấy ID từ description, ví dụ: "This is NFT weapon for game - #36."
    match = re.search(r'#(\d+)', nft.get('description', ''))
    if match:
        nft_id = match.group(1)
        output_filename = f'json/NFT_{nft_id}.json'
        
        with open(output_filename, 'w', encoding='utf-8') as out_f:
            json.dump(nft, out_f, ensure_ascii=False, indent=2)
        
        print(f'Created file: {output_filename}')
    else:
        print(f"Không tìm thấy ID trong description của NFT: {nft.get('name', 'Unknown')}")
