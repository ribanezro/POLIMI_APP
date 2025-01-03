import requests
import csv
import time

# Google API Key
API_KEY = "AIzaSyCBS71O03OLWTYZEtzgrUNQxipz2liHDsE"

# Base URL
SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText"

# Function to query Google Places API
def get_place_details(place_name, page_size=1):
    params = {
        "textQuery": place_name,
        "pageSize": page_size
    }
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "*" 
    }
    response = requests.post(SEARCH_TEXT_URL, json=params, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if "places" in data:
            places_data = []
            for place in data["places"]:
                address_components = place.get("addressComponents", [])
                
                # Extract city and country with fallback for city
                city = next(
                    (comp["longText"] for comp in address_components if "locality" in comp["types"]),
                    None,
                ) or next(
                    (comp["longText"] for comp in address_components if "administrative_area_level_1" in comp["types"]),
                    None,
                )
                country = next(
                    (comp["longText"] for comp in address_components if "country" in comp["types"]),
                    None,
                )
                
                # Build details dictionary
                details = {
                    "name": place.get("displayName", {}).get("text"),
                    "coordinates": f"{place['location']['latitude']},{place['location']['longitude']}" if "location" in place else "",
                    "image_url": f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={place['photos'][0]['name']}&key={API_KEY}" if place.get("photos") else "",
                    "category": place.get("primaryTypeDisplayName", {}).get("text"),
                    "rating": place.get("rating"),
                    "city": city,
                    "country": country,
                    "description": place.get("editorialSummary", {}).get("text", ""),
                    "website": place.get("websiteUri", ""),
                    "address": place.get("formattedAddress", ""),
                }
                places_data.append(details)
            return places_data
    else:
        print(f"Error fetching data: {response.status_code} - {response.text}")
    return []

# Function to save data to a CSV
def save_to_csv(places_data, filename="places_data1.csv"):
    keys = [
        "name", "description", "coordinates", "image_url",
        "category", "rating", "city", "country", "website", "address"
    ]
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=keys)
        writer.writeheader()
        writer.writerows(places_data)

# List of landmarks
landmarks = [
"Costa Brava, Spain",
"Monastery of Montserrat, Spain",
"Cíes Islands, Spain",
"Alcázar of Segovia, Spain",
"Doñana National Park, Spain",
"Roman Theatre of Mérida, Spain",
"Timanfaya National Park, Lanzarote, Spain",
"Las Médulas, Spain",
"Bardenas Reales, Spain",
"Val d’Orcia, Tuscany, Italy",
"Isola Bella, Lake Maggiore, Italy",
"Bologna Porticoes, Italy",
"Aeolian Islands, Italy",
"Castel del Monte, Italy",
"Dolomiti Bellunesi National Park, Italy",
"Parco Nazionale del Gran Paradiso, Italy",
]

# Process each landmark
all_places_data = []
for index, landmark in enumerate(landmarks):
    print(f"Processing {index + 1}/{len(landmarks)}: {landmark}")
    places_data = get_place_details(landmark, page_size=1)
    all_places_data.extend(places_data)
    time.sleep(1)  # Avoid hitting API rate limits

# Save results to CSV
save_to_csv(all_places_data)
print("Data saved to places_data.csv")