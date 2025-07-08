import struct
import zlib

def create_png_icon(width, height, color_rgb):
    """Создает минимальную PNG иконку"""
    # PNG заголовок
    png_header = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Создаем пиксельные данные (синий квадрат)
    r, g, b = color_rgb
    pixels = []
    for y in range(height):
        row = [0]  # Filter byte
        for x in range(width):
            row.extend([r, g, b])  # RGB
        pixels.extend(row)
    
    # Сжимаем данные
    raw_data = bytes(pixels)
    compressed = zlib.compress(raw_data)
    
    # IDAT chunk
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_header + ihdr_chunk + idat_chunk + iend_chunk

# Создаем иконки
# Синий цвет для основы
blue_color = (15, 23, 42)  # #0f172a
cyan_color = (103, 232, 249)  # #67e8f9

# Создаем иконку 192x192
icon_192 = create_png_icon(192, 192, blue_color)
with open('pwa-192x192.png', 'wb') as f:
    f.write(icon_192)

# Создаем иконку 512x512
icon_512 = create_png_icon(512, 512, blue_color)
with open('pwa-512x512.png', 'wb') as f:
    f.write(icon_512)

# Создаем favicon (16x16)
favicon = create_png_icon(16, 16, cyan_color)
with open('favicon.ico', 'wb') as f:
    f.write(favicon)

# Создаем apple-touch-icon (180x180)
apple_icon = create_png_icon(180, 180, blue_color)
with open('apple-touch-icon.png', 'wb') as f:
    f.write(apple_icon)

print("PNG иконки созданы успешно!")
