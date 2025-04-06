import json
from bs4 import BeautifulSoup
import time

def load_json(filepath: str) -> list[dict]:
    """
    Load JSON document and return the data as a list of dictionaries.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath: str, data: list[dict]) -> None:
    """
    Save JSON data to a file.
    """
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def parse_course_catalog_details(html_content: str) -> dict:
    """
    Parse HTML content for course catalog details using BeautifulSoup with lxml.
    Returns a dictionary containing catalog details.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "catalog"})
    if section:
        return {
            "title": section.find(id="catalogTitle").get_text(strip=True) if section.find(id="catalogTitle") else None,
            "college": section.find(id="catalogCollege").get_text(strip=True) if section.find(id="catalogCollege") else None,
            "department": section.find(id="catalogDepartment").get_text(strip=True) if section.find(id="catalogDepartment") else None,
            "credit_hours": section.find(string="Credit Hours:").find_next(strip=True) if section.find(string="Credit Hours:") else None,
            "levels": [level.get_text(strip=True) for level in section.find_all(class_="catalogLevels")] if section.find_all(class_="catalogLevels") else [],
            "grading_modes": [mode.get_text(strip=True) for mode in section.find_all(class_="catalogGradingModes")] if section.find_all(class_="catalogGradingModes") else [],
            "schedule_types": [stype.get_text(strip=True) for stype in section.find_all(class_="catalogScheduleTypes")] if section.find_all(class_="catalogScheduleTypes") else [],
            "attributes": [attr.get_text(strip=True) for attr in section.find_all(class_="catalogAttributes")] if section.find_all(class_="catalogAttributes") else []
        }
    return {}

def parse_fees(html_content: str) -> str:
    """
    Parse HTML content for fees using BeautifulSoup with lxml.
    Returns a string containing fee information.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "fees"})
    if section:
        return section.get_text(strip=True)
    return "No fee information available."

def parse_course_description(html_content: str) -> str:
    """
    Parse HTML content for course description using BeautifulSoup with lxml.
    Returns the course description as a string.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "courseDescription"})
    if section:
        return section.get_text(strip=True)
    return ""

def parse_syllabus(html_content: str) -> str:
    """
    Parse HTML content for syllabus information using BeautifulSoup with lxml.
    Returns a string containing syllabus information.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "syllabus"})
    if section:
        return section.get_text(strip=True)
    return "No Syllabus Information Available"

def parse_course_attributes(html_content: str) -> list:
    """
    Parse HTML content for course attributes using BeautifulSoup with lxml.
    Returns a list of attributes.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "attributes"})
    if section:
        attributes = section.find_all("span", class_="attribute-text")
        return [attr.get_text(strip=True) for attr in attributes]
    return []

def parse_restrictions(html_content: str) -> dict:
    """
    Parse HTML content for restrictions using BeautifulSoup with lxml.
    Returns a dictionary containing restriction details.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "restrictions"})
    if section:
        restrictions = {}
        major_restrictions = section.find(string="Must be enrolled in one of the following Fields of Study (Major, Minor or Concentration):")
        if major_restrictions:
            restrictions["fields_of_study"] = [
                item.get_text(strip=True) for item in major_restrictions.find_next_siblings("span", class_="detail-popup-indentation")
            ]
        return restrictions
    return {}

def parse_corequisites(html_content: str) -> list[dict]:
    """
    Parse HTML content for corequisites using BeautifulSoup with lxml.
    Returns list of extracted table rows as dictionaries.
    """
    table_rows = []
    soup = BeautifulSoup(html_content, 'lxml')
    table = soup.find("table", class_="basePreqTable")
    if table:
        for row in table.find_all("tr")[1:]:
            cells = row.find_all("td")
            if len(cells) >= 3:
                table_rows.append({
                    "subject": cells[0].get_text(strip=True),
                    "course_number": cells[1].get_text(strip=True),
                    "title": cells[2].get_text(strip=True)
                })
    return table_rows

def parse_prerequisites(html_content: str) -> list[dict]:
    """
    Parse HTML content for prerequisites using BeautifulSoup with lxml.
    Returns list of extracted table rows as dictionaries.
    """
    table_rows = []
    soup = BeautifulSoup(html_content, 'lxml')
    table = soup.find("table", class_="basePreqTable")
    if table:
        for row in table.find_all("tr")[1:]:
            cells = row.find_all("td")
            if len(cells) >= 8:
                if cells[4].get_text(strip=True) and cells[5].get_text(strip=True):
                    table_rows.append({
                        "and_or": cells[0].get_text(strip=True),
                        # "test": cells[2].get_text(strip=True),
                        # "score": cells[3].get_text(strip=True),
                        "subject": cells[4].get_text(strip=True),
                        "course_number": cells[5].get_text(strip=True),
                        # "level": cells[6].get_text(strip=True),
                        # "grade": cells[7].get_text(strip=True)
                    })
    return table_rows

def parse_course_mutual_exclusions(html_content: str) -> str:
    """
    Parse HTML content for mutual exclusions using BeautifulSoup with lxml.
    Returns a string containing mutual exclusion information.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    section = soup.find("section", {"aria-labelledby": "mexc"})
    if section:
        return section.get_text(strip=True)
    return "No Mutual Exclusion information available."

def update_details(data: list[dict]) -> list[dict]:
    """
    Parse relevant fields in the provided data and return the updated data.
    """
    for item in data:
        # # Parse course catalog details
        # html_catalog_details = item.get('getCourseCatalogDetails', '')
        # if html_catalog_details:
        #     parsed_catalog_details = parse_course_catalog_details(html_catalog_details)
        #     item['getCourseCatalogDetails'] = parsed_catalog_details

        # # Parse fees
        # html_fees = item.get('getFees', '')
        # if html_fees:
        #     parsed_fees = parse_fees(html_fees)
        #     item['getFees'] = parsed_fees

        # # Parse course description
        # html_description_content = item.get('getCourseDescription', '')
        # if html_description_content:
        #     parsed_description = parse_course_description(html_description_content)
        #     item['getCourseDescription'] = parsed_description

        # # Parse syllabus
        # html_syllabus = item.get('getSyllabus', '')
        # if html_syllabus:
        #     parsed_syllabus = parse_syllabus(html_syllabus)
        #     item['getSyllabus'] = parsed_syllabus

        # # Parse course attributes
        # html_attributes = item.get('getCourseAttributes', '')
        # if html_attributes:
        #     parsed_attributes = parse_course_attributes(html_attributes)
        #     item['getCourseAttributes'] = parsed_attributes

        # # Parse restrictions
        # html_restrictions = item.get('getRestrictions', '')
        # if html_restrictions:
        #     parsed_restrictions = parse_restrictions(html_restrictions)
        #     item['getRestrictions'] = parsed_restrictions

        # Parse corequisites
        html_coreq_content = item.get('getCorequisites', '')
        if html_coreq_content:
            parsed_coreq_data = parse_corequisites(html_coreq_content)
            item['getCorequisites'] = parsed_coreq_data

        # Parse prerequisites
        html_prereq_content = item.get('getPrerequisites', '')
        if html_prereq_content:
            parsed_prereq_data = parse_prerequisites(html_prereq_content)
            item['getPrerequisites'] = parsed_prereq_data

        # # Parse mutual exclusions
        # html_mutual_exclusions = item.get('getCourseMutuallyExclusions', '')
        # if html_mutual_exclusions:
        #     parsed_mutual_exclusions = parse_course_mutual_exclusions(html_mutual_exclusions)
        #     item['getCourseMutuallyExclusions'] = parsed_mutual_exclusions

    return data

# Example usage
if __name__ == "__main__":
    # Load JSON data
    input_filepath = 'detailed_course_data.json'
    # Load data from JSON file
    data = load_json(input_filepath)

    # Update details
    updated_data = update_details(data)

    output_filepath = 'detailed_course_data_parsed.json'
    # Save updated data
    save_json(output_filepath, updated_data)