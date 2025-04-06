import os
import re
import json
import requests
import time  # Import the time module
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def get_tokens_and_cookie():
    """
    Uses Selenium to navigate the USFCA registration site, extracts
    X-Synchronizer-Token, uniqueSessionId and cookie from network logs.

    Returns:
        tuple: A tuple containing the uniqueSessionId, synchronizer_token, and
               cookie as strings.
    """
    start_time = time.time()  # Start timing
    chrome_options = Options()
    chrome_options.set_capability("goog:loggingPrefs", {"performance": "ALL"})
    chrome_options.add_argument("--headless")  # Run in headless mode
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Go to the term selection page
        driver.get(
            "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=search"
        )

        # Click "Select a term..."
        term_select_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "select2-chosen-1"))
        )
        term_select_element.click()

        # Click "Fall 2025"
        fall_2025_element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    '//li[@role="presentation" and contains(@class, "select2-result-selectable")]//div[text()="Fall 2025"]',
                )
            )
        )
        fall_2025_element.click()

        # Click "Continue"
        continue_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "term-go"))
        )
        continue_button.click()

        # Click the search button on the next page
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "search-go"))
        )
        search_button.click()

        logs_raw = driver.get_log("performance")
        logs = [json.loads(lr["message"])["message"] for lr in logs_raw]

        # Filter for the specific Network.requestWillBeSent event
        target_log = logs[-2]
        headers = target_log["params"]["headers"]

        # Extract X-Synchronizer-Token from headers
        synchronizer_token = headers.get("x-synchronizer-token")

        # Extract uniqueSessionId from URL
        path = headers.get(":path")
        match = re.search(r"uniqueSessionId=([a-zA-Z0-9]+)", path)

        unique_session_id = None

        if match:
            unique_session_id = match.group(1)
        else:
            print("Unique ID not found")

        # Get cookies
        cookie = headers.get("cookie")

        return unique_session_id, synchronizer_token, cookie

    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None, None

    finally:
        driver.quit()
        end_time = time.time()  # End timing
        print(f"get_tokens_and_cookie took {end_time - start_time:.2f} seconds")


def get_course_data(unique_session_id, synchronizer_token, cookie, page_offset=0, page_max_size=500):
    """
    Fetches course data from the USFCA registration API using the provided
    tokens, cookie, and pagination parameters.

    Args:
        unique_session_id (str): The unique session ID.
        synchronizer_token (str): The X-Synchronizer-Token.
        cookie (str): The session cookie.
        page_offset (int): The offset for pagination.
        page_max_size (int): The maximum number of results per page.

    Returns:
        dict: The JSON response from the API.
    """
    start_time = time.time()  # Start timing
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

    params = {
        "txt_term": "202540",  # Changed term to Fall 2025
        "startDatepicker": "",
        "endDatepicker": "",
        "pageOffset": str(page_offset),
        "pageMaxSize": str(page_max_size),
        "uniqueSessionId": unique_session_id,
        "sortColumn": "subjectDescription",
        "sortDirection": "asc",
    }

    url = "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/searchResults/searchResults"

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
    end_time = time.time()  # End timing
    print(f"get_course_data (offset={page_offset}, max={page_max_size}) took {end_time - start_time:.2f} seconds")
    return response.json()


def get_all_course_data(unique_session_id, synchronizer_token, cookie):
    """
    Fetches all course data by iterating through paginated results.

    Args:
        unique_session_id (str): The unique session ID.
        synchronizer_token (str): The X-Synchronizer-Token.
        cookie (str): The session cookie.

    Returns:
        list: A list of all course data entries.
    """
    start_time = time.time()  # Start timing
    # Fetch the first page with a max size of 1 to determine total entries
    initial_response = get_course_data(unique_session_id, synchronizer_token, cookie, page_offset=0, page_max_size=1)
    total_entries = initial_response.get("totalCount", 0)
    print(f"Total entries found: {total_entries}")

    # Start with the data from the initial response
    all_courses = initial_response.get("data", [])
    page_max_size = 500

    # Iterate through the remaining pages
    for offset in range(1, total_entries, page_max_size):
        print(f"Fetching courses with offset {offset}...")
        response = get_course_data(unique_session_id, synchronizer_token, cookie, page_offset=offset, page_max_size=page_max_size)
        all_courses.extend(response.get("data", []))

    end_time = time.time()  # End timing
    print(f"get_all_course_data took {end_time - start_time:.2f} seconds")
    return all_courses


if __name__ == "__main__":
    start_time = time.time()  # Start timing the main program
    # Get tokens and cookie using Selenium
    unique_session_id, synchronizer_token, cookie = get_tokens_and_cookie()
    print("unique_session_id: " + unique_session_id)
    print("synchronizer_token: " + synchronizer_token)
    print("cookie: " + cookie)

    if unique_session_id and synchronizer_token and cookie:
        # Fetch all course data using the tokens and cookie
        all_course_data = get_all_course_data(unique_session_id, synchronizer_token, cookie)
        print(f"Total number of courses retrieved: {len(all_course_data)}")

        # Save the JSON response to a file
        with open("all_course_data.json", "w", encoding="utf-8") as f:
            json.dump(all_course_data, f, indent=2)

        # Calculate the size of the saved file in MB
        file_size = os.path.getsize("all_course_data.json") / (1024 * 1024)
        print(f"File size: {file_size:.2f} MB")

        print("All course data saved to all_course_data.json")
    else:
        print("Failed to retrieve tokens and cookie.")

    end_time = time.time()  # End timing the main program
    print(f"Program execution took {end_time - start_time:.2f} seconds")