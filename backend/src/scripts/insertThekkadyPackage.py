import os
import json
from datetime import datetime, timezone
from dotenv import dotenv_values
from pymongo import MongoClient

env = dotenv_values("backend/.env")
mongo_uri = env.get("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI not found in backend/.env")

client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
db = client.get_default_database()

slug = "thekkady-tour-package-from-varkala-1-night-2-days"

# Rule 9: Check whether slug already exists before inserting
existing = db["packageitems"].find_one({"slug": slug})
if existing:
    print(f"⚠️ Package with slug '{slug}' already exists with ID: {existing['_id']}. Not duplicating.")
    client.close()
    exit(0)

# Load uploaded R2 images
with open("backend/src/scripts/thekkady_uploaded_images.json") as f:
    images_map = json.load(f)

cover_url = images_map["villa-lemon/packages/thekkady_periyar_lake_cover.jpg"]["url"]
about_url = images_map["villa-lemon/packages/thekkady_lake_landscape_about.jpg"]["url"]

# Gallery URLs in proper logical order
gallery_keys = [
    "villa-lemon/gallery/thekkady_periyar_lake_boating.jpg",
    "villa-lemon/gallery/thekkady_connemara_tea_factory.jpg",
    "villa-lemon/gallery/thekkady_vandiperiyar_tea_plantation.jpg",
    "villa-lemon/gallery/thekkady_kuttikkanam_tea_hills.jpg",
    "villa-lemon/gallery/thekkady_abrahams_spice_garden_cardamom.jpg",
    "villa-lemon/gallery/thekkady_spice_plantation_flora.jpg",
    "villa-lemon/gallery/thekkady_periyar_sanctuary_boat_view.jpg",
    "villa-lemon/gallery/thekkady_wild_elephants_periyar.jpg"
]
gallery_urls = [images_map[k]["url"] for k in gallery_keys if k in images_map]

def local(en_text, de_text="", fr_text="", ru_text=""):
    return {
        "en": en_text,
        "de": de_text if de_text else en_text,
        "fr": fr_text if fr_text else en_text,
        "ru": ru_text if ru_text else en_text
    }

def local_opt(en_text, de_text="", fr_text="", ru_text=""):
    return {
        "en": en_text,
        "de": de_text,
        "fr": fr_text,
        "ru": ru_text
    }

thekkady_package = {
    # 1. Classification & Relationship
    "packageCategory": ["varkalaPackages"],
    "slug": slug,
    "title": local("Thekkady Tour Package from Varkala – 1 Night / 2 Days"),
    
    # 2. Pricing & Publication Status
    "price": 0,
    "hideRate": True,
    "pricePeriod": local("/ stay"),
    "badgeText": local_opt("Nature & Wildlife", "Natur & Tierwelt", "Nature & Faune", "Природа и дикая природа"),
    
    # 3. Media
    "image": cover_url,
    "images": [cover_url],
    "imagePublicId": "villa-lemon/packages/thekkady_periyar_lake_cover",
    "imagePublicIds": ["villa-lemon/packages/thekkady_periyar_lake_cover"],
    "aboutImage": about_url,
    "aboutImages": [about_url],
    "aboutImagePublicId": "villa-lemon/packages/thekkady_lake_landscape_about",
    "aboutImagePublicIds": ["villa-lemon/packages/thekkady_lake_landscape_about"],
    "gallery": gallery_urls,
    "galleryPublicIds": [k.replace(".jpg", "") for k in gallery_keys],
    "video": "",
    "ogImage": cover_url,
    "ogImagePublicId": "villa-lemon/packages/thekkady_periyar_lake_cover",

    # 4. Content & Descriptions
    "duration": local("1 Night / 2 Days"),
    "tagline": local("Discover Kerala's Tea Plantations, Spice Gardens and Periyar Lake"),
    "shortDescription": local(
        "Explore Thekkady from Varkala on a 1 Night / 2 Days private tour featuring Connemara Tea Factory, Abraham's Spice Garden, Elephant Junction and scenic Periyar Lake boating. Private transportation and hotel options are available on request."
    ),
    "aboutText": local(
        "Experience the natural beauty of Kerala with our Thekkady Tour Package from Varkala. This 1 Night / 2 Days getaway begins at Villa Lemon, Varkala, and takes you towards the green hills of Idukki and the famous Periyar region.\n\n"
        "Discover the tea-growing heritage of Vandiperiyar with a visit to Connemara Tea Factory, subject to factory access and operating arrangements. Explore Abraham's Spice Garden to learn about Kerala's aromatic spices, including cardamom, pepper, cinnamon and cloves. Add an optional visit to Elephant Junction for activities offered by the operator on your travel date.\n\n"
        "On the second day, experience the scenic beauty of Periyar Lake with a scheduled boat ride, subject to ticket availability and applicable entry arrangements.\n\n"
        "Private transportation is available with vehicle options suited to different group sizes, including small cars, big cars, 17-seater vehicles and 26-seater vehicles. Optional accommodation can be arranged in Thekkady or Kumily, subject to availability.\n\n"
        "This tour is suitable for couples, families and groups looking for a short Kerala getaway combining tea plantations, spice gardens, local experiences and beautiful hill landscapes.\n\n"
        "Accommodation, meals, boating tickets, entry fees and optional activities are included only when explicitly listed in the confirmed quotation."
    ),
    "tourOverview": local(
        "Explore Thekkady from Varkala on a 1 Night / 2 Days private tour featuring Connemara Tea Factory, Abraham's Spice Garden, Elephant Junction and scenic Periyar Lake boating. Private transportation and hotel options are available on request."
    ),

    # 5. General Info
    "travelTime": local(
        "Approximately 5–6.5 hours each way, depending on traffic, route and sightseeing stops. Treat this as an estimate, not a guaranteed travel time."
    ),
    "entryFee": local(
        "Entry fees and activity charges vary by attraction and selected activity. These charges are excluded unless explicitly included in the confirmed package quotation."
    ),
    "optionalCharges": local(
        "Meals, hotel upgrades, tea factory visit charges, spice garden entry or guide fees, Periyar boating tickets, applicable reserve entry or transport charges, Elephant Junction activities, cultural shows and any additional sightseeing not included in the final quotation."
    ),
    "difficulty": local("Easy"),
    "groupSize": local(
        "Suitable for couples, families and groups. Vehicle selection and comfortable passenger capacity depend on luggage requirements."
    ),
    "location": local("Thekkady, Kumily and Vandiperiyar, Idukki, Kerala, India"),
    "bestTime": local(
        "October to March is generally comfortable for sightseeing in Thekkady. The region can also be visited during the monsoon, when the landscape is lush and green, although rain may affect outdoor activities and road conditions."
    ),
    "dressCode": local(
        "Wear comfortable clothing and walking shoes. Carry a light jacket for cooler hill weather and an umbrella or raincoat during the monsoon. Follow the instructions of plantation guides and activity operators."
    ),
    "cta": local("Enquire Now"),

    # 6. Highlights
    "highlights": [
        {"icon": "compass", "label": local("Connemara Tea Factory – Explore the region's tea heritage, subject to factory access.")},
        {"icon": "compass", "label": local("Abraham's Spice Garden – Discover Kerala's aromatic spice plantations.")},
        {"icon": "compass", "label": local("Elephant Junction – Optional experience subject to operator availability.")},
        {"icon": "compass", "label": local("Periyar Lake – Scenic boating subject to ticket availability.")},
        {"icon": "compass", "label": local("Private Transportation – Vehicle options for different group sizes.")},
        {"icon": "compass", "label": local("Thekkady/Kumily Stay – Optional accommodation for one night.")},
        {"icon": "compass", "label": local("Kerala Cultural Experience – Optional Kathakali or Kalaripayattu performance.")}
    ],

    # 7. Why Guests Love Us
    "whyGuestsLoveUs": [
        {
            "icon": "star",
            "title": local("Curated Hill & Wildlife Escape"),
            "desc": local("Combines tea heritage, aromatic spices, and serene Periyar Lake boating into one seamless 2-day journey from Varkala.")
        },
        {
            "icon": "star",
            "title": local("Private & Flexible Transportation"),
            "desc": local("Dedicated private car and experienced driver tailored to your party size, with convenient pickup and return at Villa Lemon.")
        }
    ],

    # 8. Quick Facts
    "quickFacts": [
        {"key": local("Duration"), "value": local("1 Night / 2 Days")},
        {"key": local("Destination"), "value": local("Thekkady, Kumily and Vandiperiyar")},
        {"key": local("State"), "value": local("Kerala")},
        {"key": local("Starting point"), "value": local("Villa Lemon, Varkala")},
        {"key": local("Ending point"), "value": local("Villa Lemon, Varkala")},
        {"key": local("Accommodation"), "value": local("1 night, subject to confirmation")},
        {"key": local("Transportation"), "value": local("Private vehicle (Small/Big car, 17/26-seater)")},
        {"key": local("Suitable for"), "value": local("Couples, families and groups")},
        {"key": local("Booking type"), "value": local("Enquiry-based")}
    ],

    # 9. Itinerary
    "itinerary": [
        {
            "timeOrDay": local("Day 1 - 05:30 AM"),
            "activity": local("Departure from Villa Lemon, Varkala"),
            "desc": local("Begin the journey with pickup from Villa Lemon, Varkala, in the selected private vehicle. Travel towards Thekkady through Kerala's scenic countryside, with a breakfast stop en route.")
        },
        {
            "timeOrDay": local("Day 1 - 11:30 AM"),
            "activity": local("Connemara Tea Factory, Vandiperiyar"),
            "desc": local("Discover the tea-growing heritage of the region and learn about tea processing. Factory access, guided tours and demonstrations are subject to the factory's operating arrangements and prior confirmation.")
        },
        {
            "timeOrDay": local("Day 1 - 01:30 PM"),
            "activity": local("Lunch & Hotel Check-in"),
            "desc": local("Proceed towards Thekkady/Kumily for lunch and check-in at the selected hotel, subject to the property's check-in time and availability.")
        },
        {
            "timeOrDay": local("Day 1 - 03:30 PM"),
            "activity": local("Abraham's Spice Garden"),
            "desc": local("Explore a spice garden with an introduction to Kerala's spices, including cardamom, black pepper, cinnamon and cloves. Entry charges and guided-tour fees are additional unless included in the quotation.")
        },
        {
            "timeOrDay": local("Day 1 - 05:00 PM"),
            "activity": local("Elephant Junction (Optional)"),
            "desc": local("Offer this as an optional visit. Activities, availability and charges depend on the operator's current offerings. Do not guarantee a specific elephant interaction or activity.")
        },
        {
            "timeOrDay": local("Day 1 - 06:30 PM"),
            "activity": local("Optional Cultural Performance"),
            "desc": local("Guests may choose a Kathakali performance or Kalaripayattu martial arts show if a suitable performance is available. Tickets are additional unless included.")
        },
        {
            "timeOrDay": local("Day 1 - Night"),
            "activity": local("Overnight Stay in Thekkady/Kumily"),
            "desc": local("Stay at the selected hotel or resort in Thekkady/Kumily. Hotel name, room type and meal plan must be confirmed separately.")
        },
        {
            "timeOrDay": local("Day 2 - 07:30 AM"),
            "activity": local("Breakfast & Hotel Check-out"),
            "desc": local("Enjoy breakfast and check out of the hotel.")
        },
        {
            "timeOrDay": local("Day 2 - 09:00 AM"),
            "activity": local("Periyar Lake Boating Safari"),
            "desc": local("Enjoy a scheduled boat ride on Periyar Lake, surrounded by forested hills within the Periyar wildlife tourism region. Wildlife sightings are not guaranteed. Boat tickets, entry charges and applicable reserve transport charges are extra unless included.")
        },
        {
            "timeOrDay": local("Day 2 - 12:00 PM"),
            "activity": local("Return Journey towards Varkala"),
            "desc": local("Begin the return journey to Villa Lemon, Varkala, with suitable breaks for lunch and refreshments.")
        },
        {
            "timeOrDay": local("Day 2 - 06:00 PM"),
            "activity": local("Drop-off at Villa Lemon"),
            "desc": local("Return to Villa Lemon. Actual arrival time depends on traffic, boating schedules, weather and the duration of stops.")
        }
    ],
    "itineraryEvening": [],

    # 10. Inclusions & Exclusions
    "inclusions": [
        local("Private vehicle transportation from Villa Lemon, Varkala to Thekkady and return"),
        local("Dedicated driver, fuel, toll taxes, and parking fees for the scheduled route"),
        local("Sightseeing coordination as outlined in the agreed itinerary"),
        local("1 Night accommodation in Thekkady/Kumily (when confirmed in quotation)")
    ],
    "exclusions": [
        local("Meals, snacks, and beverages unless explicitly included in quotation"),
        local("Entry fees for Connemara Tea Factory and Abraham's Spice Garden"),
        local("Periyar Lake boating tickets and Periyar Tiger Reserve entrance charges"),
        local("Elephant Junction optional activities and guide charges"),
        local("Kathakali or Kalaripayattu cultural performance tickets"),
        local("Personal expenses, gratuities, and shopping")
    ],

    # 11. Things to Bring & Attractions
    "thingsToBring": [
        local("Valid government-issued photo ID for reserve entry and hotel check-in"),
        local("Comfortable walking shoes and casual breathable clothing"),
        local("Light jacket or sweater for cooler morning/evening hill climate"),
        local("Umbrella or raincoat during the monsoon season"),
        local("Sunscreen, hat, sunglasses, and personal toiletries")
    ],
    "nearbyAttractions": [
        {"name": local("Connemara Tea Factory"), "distance": local("Vandiperiyar (15 km)")},
        {"name": local("Abraham's Spice Garden"), "distance": local("Spring Valley (4 km)")},
        {"name": local("Periyar Tiger Reserve Boat Landing"), "distance": local("Thekkady (3 km)")},
        {"name": local("Elephant Junction"), "distance": local("Kumily (4 km)")}
    ],
    "relatedPackages": [
        "varkala-2-nights-3-days-experience",
        "Varkala 1 Night 2 Days Package with Stay & Sightseeing"
    ],
    "faqs": [
        {
            "question": local("How long does the drive from Varkala to Thekkady take?"),
            "answer": local("The drive typically takes 5 to 6.5 hours each way depending on traffic, road conditions, and scenic breaks along the route.")
        },
        {
            "question": local("Are Periyar boating tickets guaranteed in advance?"),
            "answer": local("Periyar Lake boating tickets are subject to forest department availability and slot booking on your travel date. We assist with booking slots in advance whenever available.")
        },
        {
            "question": local("Can we customize the hotel stay in Thekkady?"),
            "answer": local("Yes, accommodation options ranging from boutique homestays to luxury forest resorts can be arranged based on your preferences.")
        }
    ],

    # 12. SEO Settings
    "metaTitle": local_opt("Thekkady Tour Package from Varkala | Varkala Holidays"),
    "metaDescription": local_opt(
        "Book a Thekkady tour package from Varkala for 1 night and 2 days. Visit Connemara Tea Factory, Abraham's Spice Garden, Elephant Junction and Periyar Lake with private transport and hotel options."
    ),
    "keywords": local_opt(
        "Thekkady tour package from Varkala, Thekkady tour package, Varkala to Thekkady trip, Thekkady 1 night 2 days package, Thekkady sightseeing tour, Connemara Tea Factory tour, Abraham's Spice Garden, Elephant Junction Thekkady, Periyar Lake boating, Thekkady package with hotel, Kerala hill station tour, private taxi to Thekkady, Varkala Holidays"
    ),
    "canonicalUrl": f"https://villalemon.in/en/packages/varkala-packages/{slug}",

    # 13. Booking Policies
    "cancellation": local(
        "Cancellations must be requested in advance. Vehicle and hotel cancellation charges depend on the timing of cancellation relative to the scheduled departure."
    ),
    "refund": local(
        "Refunds for advance bookings are processed in accordance with our standard cancellation policy and supplier terms."
    ),
    "pickup": local("Pickup from Villa Lemon, Varkala at 5:30–6:00 AM on Day 1."),
    "drop": local("Drop-off at Villa Lemon, Varkala on Day 2 evening."),
    "notes": local_opt(
        "Photo ID is required for Periyar reserve entry and hotel check-in.\n"
        "• Boating tickets and elephant activities are subject to on-the-day availability.\n"
        "• Travel time may vary depending on traffic and route conditions.\n"
        "• All activities and accommodations are confirmed upon quotation."
    ),
    "displayOrder": 3,
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc)
}

result = db["packageitems"].insert_one(thekkady_package)
print(f"✅ Successfully inserted Thekkady package into database with _id: {result.inserted_id}")
client.close()
