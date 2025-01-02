import requests
import csv
import time

# Google API Key
API_KEY = "AIzaSyBPAYnZHmlJnpMf-LfO8WEvsC2b7p_l_Z8"

# Base URL for Google Places Text Search
PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"

# Function to query Google Places API
def get_place_details(place_name):
    params = {
        "query": f"{place_name} landmark",
        "key": API_KEY
    }
    response = requests.get(PLACES_API_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        if "results" in data and len(data["results"]) > 0:
            place = data["results"][0]  # Take the first result
            address_parts = place.get("formatted_address", "").split(",")  # Split the address
            details = {
                "name": place.get("name"),
                "description": place.get("business_status", ""),
                "coordinates": f"{place['geometry']['location']['lat']},{place['geometry']['location']['lng']}",
                "image_url": f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={place.get('photos', [{}])[0].get('photo_reference', '')}&key={API_KEY}" if place.get('photos') else "",
                "category": ", ".join(place.get("types", [])),
                "country": address_parts[-1].strip() if len(address_parts) > 0 else "",  # Safely get the last part
                "city": address_parts[-3].strip() if len(address_parts) > 2 else "",  # Safely get the third-to-last part
                "address": place.get("formatted_address", ""),
                "rating": place.get("rating"),
            }
            return details
    return None

# Function to process a list of landmarks
def process_landmarks(landmarks):
    places_data = []
    for index, landmark in enumerate(landmarks):
        print(f"Processing {index + 1}/{len(landmarks)}: {landmark}")
        details = get_place_details(landmark)
        if details:
            places_data.append(details)
        else:
            print(f"Could not fetch details for: {landmark}")
        time.sleep(0.5)  # To avoid exceeding API rate limits
    return places_data

# Save data to CSV
def save_to_csv(places_data, filename="landmarks4.csv"):
    keys = [
        "name", "description", "coordinates", "image_url",
        "category", "country", "city", "address",
        "rating"
    ]
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=keys)
        writer.writeheader()
        writer.writerows(places_data)

# List of landmarks (shortened here for demonstration; replace with your full list)
landmarks = [
"Table Mountain, South Africa",
"Atacama Desert, Chile",
"Kinkaku-ji (Golden Pavilion), Kyoto, Japan",
"Bora Bora, French Polynesia",
"Lake Titicaca, Peru/Bolivia",
"Erawan Falls, Thailand",
"Hwange National Park, Zimbabwe",
"Carlsbad Caverns National Park, USA",
"Ang Thong National Marine Park, Thailand",
"K2 (Mount Godwin-Austen), Pakistan",
"Pamirs Mountains, Tajikistan",
"Acadia National Park, USA",
"Mont Blanc, France/Italy",
"Tasman Glacier, New Zealand",
"Sequoia National Park, California, USA",
"Royal Gorge Bridge, Colorado, USA",
"Chamonix Valley, France",
"Gokyo Lakes, Nepal",
"Haleakalā Crater, Hawaii, USA",
"Parthenon, Greece",
"Tower of Hercules, Spain",
"La Rambla, Barcelona, Spain",
"Devil’s Pool, Victoria Falls, Zambia",
"Ngong Ping 360, Hong Kong",
"Sossusvlei Dunes, Namibia",
"Ha Long Bay, Vietnam",
"Waitomo Caves, New Zealand",
"Emei Shan, China",
"Badlands of Alberta, Canada",
"Al-Hijr Archaeological Site, Saudi Arabia",
"Masada, Israel",
"Phong Nha-Ke Bang National Park, Vietnam",
"Mount Elbrus, Russia",
"Etosha National Park, Namibia",
"Lake Nakuru, Kenya",
"Akshardham Temple, Delhi, India",
"Phuket Big Buddha, Thailand",
"Blue Hole, Belize",
"Dome of the Chain, Jerusalem",
"Santorini Caldera, Greece",
"Lake Plitvice, Croatia",
"The Fairy Pools, Isle of Skye, Scotland",
"Snaefellsnes Peninsula, Iceland",
"Mount Sinai, Egypt",
"Yading Nature Reserve, China",
"Manaslu Circuit, Nepal",
"Cotswolds, England",
"Sigiriya Rock Fortress, Sri Lanka",
"Sheikh Lotfollah Mosque, Isfahan, Iran",
"Blyde River Canyon, South Africa",
"Mount Fitz Roy, Argentina",
"Timbavati Game Reserve, South Africa",
"Mount Hood, Oregon, USA",
"Angel Falls, Venezuela",
"Eilean Donan Castle, Scotland",
"Shenandoah National Park, Virginia, USA",
"Montserrat Abbey, Spain",
"Lofoten Islands, Norway",
"Dhaulagiri Mountain, Nepal",
"Salzkammergut, Austria",
"Canterbury Plains, New Zealand",
"Batu Caves Temple, Malaysia",
"Mount Athos, Greece",
"Samburu National Reserve, Kenya",
"Rann of Kutch, India",
"Cape Horn, Chile",
"Dead Sea, Jordan/Israel",
"Bungle Bungle Range, Australia",
"Tierra del Fuego National Park, Argentina",
"Mount St. Helens, USA",
"Plaza Mayor, Madrid, Spain",
"Avila Walls, Spain",
"Bryggen Wharf, Bergen, Norway",
"Valle de la Luna, Chile",
"Douro Valley, Portugal",
"Chichen Itza Observatory, Mexico",
"Horsetail Fall, Yosemite National Park, USA",
"Moeraki Boulders, New Zealand",
"Alhambra Gardens, Spain",
"Leaning Tower of Zaragoza, Spain",
"Dambulla Cave Temple, Sri Lanka",
"Monte Fitz Roy, Patagonia",
"Zion Narrows, Utah, USA",
"Kaikoura Peninsula, New Zealand",
"Yosemite Tunnel View, USA",
"Great Rift Valley, Kenya",
"Pancake Rocks, New Zealand",
"Magdalen Islands, Canada",
"Valley of the Kings, Egypt",
"Great Zimbabwe Ruins, Zimbabwe",
"Bromo Tengger Semeru National Park, Indonesia",
"Kings Canyon National Park, Australia",
"Tsingy de Bemaraha National Park, Madagascar",
"Mount Washington, New Hampshire, USA",
"Matterhorn Glacier, Switzerland",
"Temple Mount, Jerusalem",
"Laguna Colorada, Bolivia",
"Stanley Park, Vancouver, Canada",
"Cape Reinga, New Zealand",
"Mount Shasta, California, USA",
"Pyramids of Caral, Peru",
"Namib Desert, Namibia",
"Torres del Paine, Chile",
"Sahara Desert, Africa",
"Marble Caves, Chile",
"Mount Roraima, Venezuela",
"Galata Tower, Istanbul",
"Mount Whitney, California, USA",
"St. Moritz, Switzerland",
"Huangguoshu Waterfall, China",
"Lake Geneva, Switzerland",
"Carcassonne, France",
"Silfra Fissure, Iceland",
"Great Mosque of Djenne, Mali",
"Sea of Stars, Maldives",
"The Wave, Arizona, USA",
"Mendenhall Ice Caves, Alaska",
"Bavarian Forest, Germany",
"Isle of Staffa, Scotland",
"Stirling Castle, Scotland",
"Mount Meru, Tanzania",
"Aletsch Glacier, Switzerland",
"Catacombs of Paris, France",
"San Juan de Gaztelugatxe, Spain",
"Wulingyuan Scenic Area, China",
"Helsingør (Elsinore), Denmark",
"Highlands of Scotland",
"Chittorgarh Fort, India",
"Royal Mile, Edinburgh",
"Pingvellir National Park, Iceland",
"Mount Washington Hotel, USA",
"Historic Cairo, Egypt",
"Tajik National Park, Tajikistan",
"The Black Hills, South Dakota, USA",
"Sagano Bamboo Forest, Japan",
"Uluru-Kata Tjuta National Park, Australia",
"Hallstatt, Austria",
"Whitehaven Beach, Australia",
"Ambohimanga, Madagascar",
"Daintree Rainforest, Australia",
"Mont Saint-Michel Bay, France",
"Yehliu Geopark, Taiwan",
"Cathedral Rock, Arizona, USA",
"Mount Cook National Park, New Zealand",
"Hells Canyon, USA",
"The Pinnacles, Western Australia",
"K2 Base Camp, Pakistan",
"Victoria Memorial, India",
"Rock Islands, Palau",
"Puy de Dôme, France",
"Drina River House, Serbia",
"Tatev Monastery, Armenia",
"Jokulsarlon Glacier Lagoon, Iceland",
"White Sands National Park, USA",
"Kauai Cliffs, Hawaii",
"Jotunheimen National Park, Norway",
"The Burren, Ireland",
"Santa Maddalena, Italy",
"Lalibela, Ethiopia",
"Split Old Town, Croatia",
"Mount Nebo, Jordan",
"Puente Nuevo, Ronda, Spain",
"Cades Cove, Great Smoky Mountains, USA",
"Rialto Beach, Washington, USA",
"Parque Nacional Natural Tayrona, Colombia",
"Shoshone Falls, Idaho, USA",
"Mount Taranaki, New Zealand",
"Napa Valley Vineyards, USA",
"Lake Maggiore, Italy",
"Cueva de las Manos, Argentina",
"Komodo National Park, Indonesia",
"Tsingy Rouge, Madagascar",
"Mount Kinabalu, Malaysia",
"Lofoten Viking Museum, Norway",
"Emerald Lake, Canada",
"Kiyomizu-dera Pagoda, Japan",
"Pico Cão Grande, São Tomé",
"Trakai Island Castle, Lithuania",
"Ganga Talao, Mauritius",
"Vallée de Mai, Seychelles",
"Cabo San Lucas Arch, Mexico",
"Ross Island, Antarctica",
"Kakslauttanen Arctic Resort, Finland",
"Mount Olympus, Greece",
"Bromo Crater, Indonesia",
"Bojnice Castle, Slovakia",
"Mount Thielsen, Oregon, USA",
"Petrohue Falls, Chile",
"Karakoram Highway, Pakistan/China",
"Burning Mountain, Australia",
"Madain Saleh, Saudi Arabia",
"Lofoten Trollfjord, Norway",
"Ordesa Valley, Spain",
"Fjordland National Park, New Zealand",
"Shiretoko Peninsula, Japan",
"Luray Caverns, Virginia, USA",
"Cape Farewell, Greenland",
"Clifton Suspension Bridge, England",
"Mount Pelée, Martinique",
"Lake Louise, Canada",
"Dunrobin Castle, Scotland",
]

# Process and save data
places_data = process_landmarks(landmarks)
save_to_csv(places_data)
print("Landmark data saved to landmarks.csv")