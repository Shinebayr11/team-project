#!/usr/bin/env python3
"""
`~/Desktop/landing zurag/` доторх эх зургуудыг landing-ийн `public/landing/`
дахь webp болгоно.

Гурван дүрэм:
  1. Босоо/дөрвөлжин эх зургийг харьцаанд нь CENTER-CROP-оор оруулна
     (`MediaSlot` нь `object-cover` тул хайрцагтайгаа яг таарвал дахин
     тайрагдахгүй).
  2. ХЭВТЭЭ эх зургийг тайрахгүй — бүтнээр нь голд тавьж, ард нь өөрийнх нь
     бүдгэрүүлсэн хуулбарыг дэвсгэр болгоно (`pad`). Машины зураг 783×391
     байсныг 4:5 болгож тайрвал 196px үлдэж, машин нь алга болно.
  3. ХЭЗЭЭ Ч хиймэлээр томруулахгүй — эх файлаас гарах хамгийн том хэмжээгээр
     хязгаарлана. Тиймээс гаралтын хэмжээ файл бүрд өөр.

Ажиллуулах:  cd frontend && python3 scripts/build-landing-images.py

⚠️ ХОЁР ФАЙЛ ЭНД БАЙХГҮЙ: `rhode-lip-tint.webp`, `iphone.webp`. Тэдний эх
зургийг ("images (1).jpeg", "images (2).jpeg") дараа нь өөр зургаар дарж
бичсэн тул дахин үүсгэх боломжгүй. Гаралтын webp нь `public/landing/`-д бүтэн
байгаа — энэ скрипт тэдэнд хүрэхгүй.
"""

import pathlib

from PIL import Image, ImageFilter, ImageOps

SRC = pathlib.Path.home() / "Desktop" / "landing zurag"
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "landing"

PORTRAIT = 4 / 5
PHONE = 9 / 19.5

# (эх файл, гаралт, харьцаа W/H, зорилтот өргөн)
JOBS = [
    ("zara5.jpg", "seller-live.webp", PHONE, 620),
    # Гадуур хувцас
    ("1a5a34cc33ae2db8091c4d5058da1c83.jpg", "carhartt-detroit.webp", PORTRAIT, 640),
    ("zara 2.jpg", "wool-bomber.webp", PORTRAIT, 640),
    ("zara6.jpg", "leather-jacket.webp", PORTRAIT, 640),
    ("ded4c687505e2f0060399aca74a2a477.jpg", "carhartt-akira.webp", PORTRAIT, 640),
    # Энгийн хувцас
    ("dress.avif", "yellow-dress.webp", PORTRAIT, 640),
    ("zar9.jpg", "trousers.webp", PORTRAIT, 640),
    ("uniq.jpeg", "striped-shirt.webp", PORTRAIT, 640),
    # Пүүз ба цүнх
    ("images (4).jpeg", "jordan-1.webp", PORTRAIT, 640),
    (
        "l3dtfpbtgkc-II9807-100_Nike_Air-Force-1-07-LV8_Off-White-Off-White-Summit-White_of-sm-1.webp",
        "air-force-1.webp",
        PORTRAIT,
        640,
    ),
    ("bag.jpg", "leather-bag.webp", PORTRAIT, 640),
    ("7a2d17a3c0f8160f646a4026c0b16a10.jpg", "burgundy-bag.webp", PORTRAIT, 640),
    # Гоо сайхан
    ("images.png", "inglot-lip-pencil.webp", PORTRAIT, 640),
    ("99ae0357-746a-4ebf-adf8-b33abdb27ec5.avif", "makeup-brushes.webp", PORTRAIT, 640),
    # Технологи
    ("images (3).jpeg", "macbook.webp", PORTRAIT, 640),
    ("e799d433e4534802ed5391d95d72f18c.jpg", "smart-tv.webp", PORTRAIT, 640),
    ("20._Marshall_Major_IV_-_Black_-_1.jpg", "marshall-major.webp", PORTRAIT, 640),
    ("images (2).jpeg", "logitech-superlight.webp", PORTRAIT, 640),
    # Дуудлага худалдаа
    ("ad6e54023e3252b2c85d981280f03ff6.jpg", "seiko-lm.webp", PORTRAIT, 640),
    ("43f3e157-0199-43f0-b02f-dd8bec6e4062.avif", "sunglasses.webp", PORTRAIT, 640),
    ("car.jpeg", "toyota-camry.webp", PORTRAIT, 640),
    ("images (1).jpeg", "atomic-habits.webp", PORTRAIT, 640),
]


def pad(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Бүтнээр нь багтаах: ард нь бүдгэрүүлсэн хуулбар дэвсгэр болно."""
    w, h = size
    back = ImageOps.fit(im, (w, h), Image.LANCZOS).filter(
        ImageFilter.GaussianBlur(radius=max(w, h) // 14)
    )
    front = im.copy()
    front.thumbnail((w, h), Image.LANCZOS)
    back.paste(front, ((w - front.width) // 2, (h - front.height) // 2))
    return back


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src, out, ratio, want_w in JOBS:
        path = SRC / src
        if not path.exists():
            print(f"!! олдсонгүй: {src}")
            continue

        im = Image.open(path).convert("RGB")
        w, h = im.size
        # Зөвхөн ЖИНХЭНЭ хэвтээ зураг (өргөн > өндөр) letterbox болно. Харьцаа
        # хооронд нь жишиж болохгүй: утасны дэлгэц 9:19.5 бөгөөд 2:3 босоо
        # эхээс тайрагдах ёстой — тэр нь "хэвтээ" гэж тооцогдох ёсгүй.
        wide = w > h

        if wide:
            # Тайрвал сэдэв нь алга болно — бүтнээр нь багтаана.
            target_w = min(want_w, w)
        else:
            target_w = min(want_w, int(min(w, h * ratio)))
        target_h = round(target_w / ratio)

        im = (
            pad(im, (target_w, target_h))
            if wide
            else ImageOps.fit(im, (target_w, target_h), Image.LANCZOS, centering=(0.5, 0.5))
        )
        im.save(OUT / out, "WEBP", quality=82, method=6)
        print(f"{out:26} {target_w}×{target_h}{'  (pad)' if wide else ''}")


if __name__ == "__main__":
    main()
