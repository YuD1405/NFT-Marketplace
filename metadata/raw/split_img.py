from PIL import Image

def split_image_to_3x3_grid(image_path, output_dir, count):
    # Mở ảnh
    img = Image.open(image_path)
    width, height = img.size

    # Kích thước mỗi ô nhỏ
    tile_width = width // 3
    tile_height = height // 3

    for row in range(3):
        for col in range(3):
            left = col * tile_width
            upper = row * tile_height
            right = left + tile_width
            lower = upper + tile_height

            # Crop ảnh
            cropped_img = img.crop((left, upper, right, lower))
            cropped_img.save(f"{output_dir}/image_{count}.png")
            count += 1

    print("✅ Ảnh đã được cắt thành 9 phần và lưu thành công.")

# Ví dụ sử dụng
split_image_to_3x3_grid("raw_img/1-9.png", "images", 1)
split_image_to_3x3_grid("raw_img/10-18.png", "images", 10)
split_image_to_3x3_grid("raw_img/19-27.png", "images", 19)
split_image_to_3x3_grid("raw_img/28-36.png", "images", 28)
split_image_to_3x3_grid("raw_img/37-45.png", "images", 37)
split_image_to_3x3_grid("raw_img/46-50.png", "images", 46)
