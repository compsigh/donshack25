import re
import json
import requests
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


def get_course_data(unique_session_id, synchronizer_token, cookie):
    """
    Fetches course data from the USFCA registration API using the provided
    tokens and cookie.

    Args:
        unique_session_id (str): The unique session ID.
        synchronizer_token (str): The X-Synchronizer-Token.
        cookie (str): The session cookie.

    Returns:
        dict: The JSON response from the API.
    """
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
        "pageOffset": "0",
        "uniqueSessionId": unique_session_id,
        "sortColumn": "subjectDescription",
        "sortDirection": "asc",
    }

    url = "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/searchResults/searchResults"

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
    return response.json()


if __name__ == "__main__":
    # Get tokens and cookie using Selenium
    unique_session_id, synchronizer_token, cookie = get_tokens_and_cookie()
    print("unique_session_id: " + unique_session_id)
    print("synchronizer_token: " + synchronizer_token)
    print("cookie: " + cookie)

    if unique_session_id and synchronizer_token and cookie:
        # Fetch course data using the tokens and cookie
        course_data = get_course_data(unique_session_id, synchronizer_token, cookie)

        # Save the JSON response to a file
        with open("course_data.json", "w", encoding="utf-8") as f:
            json.dump(course_data, f, indent=2)

        print("Course data saved to course_data.json")
    else:
        print("Failed to retrieve tokens and cookie.")

