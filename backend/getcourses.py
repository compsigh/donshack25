import re
import json
import asyncio
import aiohttp
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



async def fetch_course_data(session, unique_session_id, synchronizer_token, cookie, offset, page_max_size):
    """
    Asynchronously fetch course data for a specific offset.
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
        "txt_term": "202540",  # Term for Fall 2025
        "startDatepicker": "",
        "endDatepicker": "",
        "pageOffset": str(offset),
        "pageMaxSize": str(page_max_size),
        "uniqueSessionId": unique_session_id,
        "sortColumn": "subjectDescription",
        "sortDirection": "asc",
    }

    url = "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/courseSearchResults/courseSearchResults"
    async with session.get(url, headers=headers, params=params) as response:
        response.raise_for_status()
        return await response.json()

async def get_all_course_data_async(unique_session_id, synchronizer_token, cookie):
    """
    Asynchronously fetch all course data by sending concurrent requests.
    """
    async with aiohttp.ClientSession() as session:
        # Fetch the first page to determine total entries
        initial_response = await fetch_course_data(session, unique_session_id, synchronizer_token, cookie, 0, 1)
        total_entries = initial_response.get("totalCount", 0)
        print(f"Total entries found: {total_entries}")

        # Start with the data from the initial response
        all_courses = initial_response.get("data", [])
        page_max_size = 500

        # Create tasks for remaining pages
        tasks = [
            fetch_course_data(session, unique_session_id, synchronizer_token, cookie, offset, page_max_size)
            for offset in range(1, total_entries, page_max_size)
        ]

        # Gather all results
        responses = await asyncio.gather(*tasks)
        for response in responses:
            all_courses.extend(response.get("data", []))

        return all_courses
    
async def fetch_course_detail(session, synchronizer_token, cookie, term, subject_code, course_number, detail):
    """
    Asynchronously fetch detailed information about a specific course using subject code and course number.
    """
    url = f"https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/searchResults/{detail}"
    headers = {
        "accept": "text/html, */*; q=0.01",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "content-length": "51",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "origin": "https://reg-prod.ec.usfca.edu",
        "priority": "u=1, i",
        "referer": "https://reg-prod.ec.usfca.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
        "sec-ch-ua": '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        "x-synchronizer-token": synchronizer_token,
        "cookie": cookie,
    }
    data = {
        "term": term,
        "subjectCode": subject_code,
        "courseNumber": course_number,
        "first": "first",
    }

    async with session.post(url, headers=headers, data=data) as response:
        response.raise_for_status()
        return await response.text()

async def fetch_all_course_details_async(synchronizer_token, cookie, term, all_courses):
    """
    Asynchronously fetch all course details for each course using updated endpoints.
    """
    async with aiohttp.ClientSession() as session:
        endpoints = [
            "getCourseCatalogDetails",
            "getFees",
            "getCourseDescription",
            "getSyllabus",
            "getCourseAttributes",
            "getRestrictions",
            "getCorequisites",
            "getPrerequisites",
            "getCourseMutuallyExclusions",
        ]

        tasks = []
        for course in all_courses:
            subject_code = course.get("subject")
            course_number = course.get("courseNumber")
            if not subject_code or not course_number:
                continue  # Skip if subject code or course number is missing

            for endpoint in endpoints:
                tasks.append(
                    fetch_course_detail(
                        session,
                        synchronizer_token,
                        cookie,
                        term,
                        subject_code,
                        course_number,
                        endpoint,
                    )
                )

        # Gather all results
        responses = await asyncio.gather(*tasks, return_exceptions=True)

        # Debugging: Print the lengths of responses and tasks
        print(f"Total tasks created: {len(tasks)}")
        print(f"Total responses received: {len(responses)}")

        # Map responses back to courses
        task_index = 0
        for course in all_courses:
            subject_code = course.get("subject")
            course_number = course.get("courseNumber")
            if not subject_code or not course_number:
                continue

            for endpoint in endpoints:
                if task_index >= len(responses):
                    print(f"Index {task_index} is out of bounds for responses of length {len(responses)}")
                    continue  # Skip if index is out of bounds

                response = responses[task_index]
                task_index += 1

                if isinstance(response, Exception):
                    # Log the error and set the field to None
                    print(f"Failed to fetch {endpoint} for {subject_code} {course_number}: {response}")
                    course[endpoint] = None
                else:
                    # Add the successful response to the course
                    course[endpoint] = response
                    
if __name__ == "__main__":
    start_time = time.time()  # Start timing the main program
    unique_session_id, synchronizer_token, cookie = get_tokens_and_cookie()

    if unique_session_id and synchronizer_token and cookie:
        # Fetch all course data asynchronously
        # all_course_data = asyncio.run(get_all_course_data_async(unique_session_id, synchronizer_token, cookie))
        with open("all_course_data_from_catalog.json", "r", encoding="utf-8") as f:
            all_course_data = json.load(f)

        # Fetch all course details asynchronously
        asyncio.run(fetch_all_course_details_async(synchronizer_token, cookie, "202540", all_course_data))

        # Save the JSON response to a file
        with open("all_course_data_from_catalog.json", "w", encoding="utf-8") as f:
            json.dump(all_course_data, f, indent=2)

        print("All course data saved to all_course_data.json")
    else:
        print("Failed to retrieve tokens and cookie.")

    end_time = time.time()  # End timing the main program
    print(f"Program execution took {end_time - start_time:.2f} seconds")