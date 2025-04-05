import requests
import json

# Load external headers and cookies
with open("uniqueSessionId.txt") as f:
    unique_session_id = f.read().strip()

with open("X-Synchronizer-Token.txt") as f:
    synchronizer_token = f.read().strip()

with open("cookie.txt") as f:
    cookie = f.read().strip()

# Build headers
headers = {
    "Host": "reg-prod.ec.usfca.edu",
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Synchronizer-Token": synchronizer_token,
    "X-Requested-With": "XMLHttpRequest",
    "DNT": "1",
    "Sec-GPC": "1",
    "Connection": "keep-alive",
    "Referer": "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
    "Cookie": cookie,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Priority": "u=0",
    "TE": "trailers",
}

# Query parameters
params = {
    "txt_term": "202510",
    "startDatepicker": "",
    "endDatepicker": "",
    "pageOffset": "0",
    "uniqueSessionId": unique_session_id,
    "sortColumn": "subjectDescription",
    "sortDirection": "asc",
}

url = "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/searchResults/searchResults"

# Make the request
response = requests.get(url, headers=headers, params=params)
response.raise_for_status()

# Save as raw json
raw_data = response.json()
with open("raw_response.json", "w", encoding="utf-8") as f:
    json.dump(raw_data, f, indent=2)

print("JSON data saved to raw_response.json")

