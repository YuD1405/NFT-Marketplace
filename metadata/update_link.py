import os
import json

# 📁 Thư mục chứa các file metadata .json
metadata_folder = './json'

# 🌐 CID của folder ảnh trên IPFS (em sửa lại đúng của mình)
image_cid = 'QmZBrtfcFyMU17JptduvdJ4ZLK19xvB7jWGg5f3GSnRsJu'

# 🔁 Duyệt tất cả các file .json trong folder
for filename in os.listdir(metadata_folder):
    if filename.endswith('.json'):
        filepath = os.path.join(metadata_folder, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 🎯 Giữ lại tên file ảnh gốc từ link cũ
        old_image = data.get('image', '')
        image_name = os.path.basename(old_image)

        # 🛠 Thay link ảnh mới
        data['image'] = f'ipfs://{image_cid}/{image_name}'

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"✅ Updated: {filename}")
