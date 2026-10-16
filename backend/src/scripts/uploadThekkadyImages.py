import os
import io
import json
import requests
from dotenv import dotenv_values
from PIL import Image
import boto3

env = dotenv_values("backend/.env")
acc_id = env.get("R2_ACCOUNT_ID")
s3 = boto3.client(
    "s3",
    endpoint_url=f"https://{acc_id}.r2.cloudflarestorage.com",
    aws_access_key_id=env.get("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=env.get("R2_SECRET_ACCESS_KEY"),
    region_name="auto"
)
bucket = env.get("R2_BUCKET_NAME")
public_url = env.get("R2_PUBLIC_URL").rstrip("/")

images_to_process = [
    {
        "role": "cover",
        "title": "File:Thekkady, Periyar Lake.JPG",
        "r2_key": "villa-lemon/packages/thekkady_periyar_lake_cover.jpg",
        "alt": "Periyar Lake and surrounding forest scenery in Thekkady, Kerala"
    },
    {
        "role": "about",
        "title": "File:Thekkady Lake.jpg",
        "r2_key": "villa-lemon/packages/thekkady_lake_landscape_about.jpg",
        "alt": "Scenic view of Thekkady Lake and Periyar Tiger Reserve landscape"
    },
    {
        "role": "gallery",
        "title": "File:Periyar National Park boat.JPG",
        "r2_key": "villa-lemon/gallery/thekkady_periyar_lake_boating.jpg",
        "alt": "Periyar Lake boating safari in Thekkady, Kerala"
    },
    {
        "role": "gallery",
        "title": "File:Connemara Tea Factory.jpg",
        "r2_key": "villa-lemon/gallery/thekkady_connemara_tea_factory.jpg",
        "alt": "Connemara Tea Factory in Vandiperiyar, Thekkady"
    },
    {
        "role": "gallery",
        "title": "File:Tea Plantation near Vandiperiyar.JPG",
        "r2_key": "villa-lemon/gallery/thekkady_vandiperiyar_tea_plantation.jpg",
        "alt": "Lush green tea plantation near Vandiperiyar and Thekkady"
    },
    {
        "role": "gallery",
        "title": "File:Tea Plantations at Kuttikkanam, near Thekkady.jpg",
        "r2_key": "villa-lemon/gallery/thekkady_kuttikkanam_tea_hills.jpg",
        "alt": "Rolling tea plantation hills near Thekkady, Idukki"
    },
    {
        "role": "gallery",
        "title": "File:Thekkady, Cardomom Abrahams Spice Garden (2267500654).jpg",
        "r2_key": "villa-lemon/gallery/thekkady_abrahams_spice_garden_cardamom.jpg",
        "alt": "Cardamom plant at Abraham's Spice Garden in Thekkady, Kerala"
    },
    {
        "role": "gallery",
        "title": "File:In a Spice Garden in Thekkady, India (39903078671).jpg",
        "r2_key": "villa-lemon/gallery/thekkady_spice_plantation_flora.jpg",
        "alt": "Aromatic spice plantation in Thekkady, Kerala"
    },
    {
        "role": "gallery",
        "title": "File:A view of Periyar Wildlife Sanctuary from boat.jpg",
        "r2_key": "villa-lemon/gallery/thekkady_periyar_sanctuary_boat_view.jpg",
        "alt": "View of Periyar Wildlife Sanctuary shoreline from boat ride"
    },
    {
        "role": "gallery",
        "title": "File:Wild Elephants at Thekkady (periyar wild life sanctuary).jpg",
        "r2_key": "villa-lemon/gallery/thekkady_wild_elephants_periyar.jpg",
        "alt": "Wild elephants in Periyar Wildlife Sanctuary near Thekkady"
    }
]

headers = {"User-Agent": "VillaLemonPackageScript/1.0 (contact@villalemon.in)"}
uploaded_results = {}

for item in images_to_process:
    title = item["title"]
    r2_key = item["r2_key"]
    role = item["role"]
    alt = item["alt"]
    
    # Query direct URL from Wikimedia API
    api_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url",
        "format": "json"
    }
    r = requests.get(api_url, params=params, headers=headers)
    page = list(r.json().get("query", {}).get("pages", {}).values())[0]
    direct_url = page.get("imageinfo", [{}])[0].get("url")
    if not direct_url:
        print(f"FAILED to get URL for {title}")
        continue
        
    print(f"Downloading {title} from {direct_url}...")
    img_resp = requests.get(direct_url, headers=headers, timeout=20)
    img = Image.open(io.BytesIO(img_resp.content)).convert("RGB")
    
    # Optimize to max 1920x1920
    img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85, optimize=True)
    buf.seek(0)
    
    print(f"Uploading to R2: {r2_key} ({len(buf.getvalue())} bytes)...")
    s3.put_object(
        Bucket=bucket,
        Key=r2_key,
        Body=buf.getvalue(),
        ContentType="image/jpeg",
        CacheControl="public, max-age=31536000, immutable"
    )
    
    final_url = f"{public_url}/{r2_key}"
    print(f"  -> SUCCESS: {final_url}")
    uploaded_results[r2_key] = {
        "role": role,
        "url": final_url,
        "alt": alt,
        "source": title
    }

with open("backend/src/scripts/thekkady_uploaded_images.json", "w") as f:
    json.dump(uploaded_results, f, indent=2)

print("\nAll images processed and saved to thekkady_uploaded_images.json!")
