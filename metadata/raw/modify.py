import json
import os
from urllib.parse import urlparse

# Đường dẫn đến file json và thư mục chứa ảnh đã sinh ra
json_path = "nfts.json"
images_dir = "images"  # Thư mục chứa ảnh gốc image_1.png, image_2.png,...

def get_filename_from_url(url):
    """Lấy tên file từ URL"""
    return os.path.basename(urlparse(url).path)

def rename_images_from_json(json_path, images_dir):
    # Đọc dữ liệu JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Tạo danh sách tên file mới theo thứ tự JSON
    filenames = [get_filename_from_url(nft["image"]) for nft in data]
    
    # Bắt đầu từ index 40 (tức là image_41.png)
    for i in range(40, len(filenames)):
        old_name = os.path.join(images_dir, f"image_{i+1}.png")
        new_name = filenames[i]
        new_path = os.path.join(images_dir, new_name)
        print(old_name)
        print(new_path)
        if os.path.exists(old_name):
            os.rename(old_name, new_path)
            print(f"✅ Renamed {old_name} → {new_name}")
        else:
            print(f"⚠️  Missing: {old_name}")

rename_images_from_json(json_path, images_dir)
