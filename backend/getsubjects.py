import json

# Global variable with a raw string
RAW_STRING = """[
  {
    "code": "AEM",
    "name": "Academic English Multi Student"
  },
  {
    "code": "ASP",
    "name": "Academic Support Services"
  },
  {
    "code": "MSAS",
    "name": "Accounting"
  },
  {
    "code": "ADVT",
    "name": "Advertising"
  },
  {
    "code": "AAS",
    "name": "African American Studies"
  },
  {
    "code": "ASL",
    "name": "American Sign Language"
  },
  {
    "code": "ANTH",
    "name": "Anthropology"
  },
  {
    "code": "ARAB",
    "name": "Arabic"
  },
  {
    "code": "ARCH",
    "name": "Architecture"
  },
  {
    "code": "ARUP",
    "name": "Arrupe Justice Immersion"
  },
  {
    "code": "ART",
    "name": "Art"
  },
  {
    "code": "ELAA",
    "name": "Art Appreciation"
  },
  {
    "code": "ELAC",
    "name": "Arts &amp; Crafts"
  },
  {
    "code": "APS",
    "name": "Asia Pacific Studies"
  },
  {
    "code": "ANST",
    "name": "Asian Studies"
  },
  {
    "code": "BH",
    "name": "Behavioral Health"
  },
  {
    "code": "PSYD",
    "name": "Behavioral Health (PSYD)"
  },
  {
    "code": "BIOL",
    "name": "Biology"
  },
  {
    "code": "BTEC",
    "name": "Biotechnology"
  },
  {
    "code": "BUS",
    "name": "Business Administration"
  },
  {
    "code": "CBMN",
    "name": "Casa Bayanihan in Manila"
  },
  {
    "code": "CEL",
    "name": "Catholic Educational Leadershi"
  },
  {
    "code": "CHEM",
    "name": "Chemistry"
  },
  {
    "code": "CLS",
    "name": "Chicanx &amp; Latinx Studies"
  },
  {
    "code": "CHIN",
    "name": "Chinese"
  },
  {
    "code": "CLAS",
    "name": "Classical Studies"
  },
  {
    "code": "MCA",
    "name": "Collegiate Athletics"
  },
  {
    "code": "ELCO",
    "name": "Communication Arts"
  },
  {
    "code": "COMS",
    "name": "Communication Studies"
  },
  {
    "code": "CMPL",
    "name": "Comparative Literature &amp; Cultu"
  },
  {
    "code": "CS",
    "name": "Computer Science"
  },
  {
    "code": "ELCS",
    "name": "Computer Science"
  },
  {
    "code": "ELCF",
    "name": "Consumer &amp; Family Science"
  },
  {
    "code": "CPSY",
    "name": "Counseling Psychology"
  },
  {
    "code": "CDS",
    "name": "Critical Diversity Studies"
  },
  {
    "code": "DANC",
    "name": "Dance"
  },
  {
    "code": "BSDS",
    "name": "Data Science (BS)"
  },
  {
    "code": "MSDS",
    "name": "Data Science (MS)"
  },
  {
    "code": "DTTL",
    "name": "Digital Tech Teach Learning"
  },
  {
    "code": "ECON",
    "name": "Economics"
  },
  {
    "code": "ELED",
    "name": "Education"
  },
  {
    "code": "ETK",
    "name": "Educational Technology"
  },
  {
    "code": "ENGY",
    "name": "Energy Systems Management"
  },
  {
    "code": "ENGR",
    "name": "Engineering"
  },
  {
    "code": "ELRC",
    "name": "English"
  },
  {
    "code": "ENGL",
    "name": "English"
  },
  {
    "code": "ENVM",
    "name": "Environmental Management"
  },
  {
    "code": "ENVS",
    "name": "Environmental Science"
  },
  {
    "code": "ENVA",
    "name": "Environmental Studies"
  },
  {
    "code": "EURO",
    "name": "European Studies"
  },
  {
    "code": "EMBA",
    "name": "Executive MBA"
  },
  {
    "code": "FILI",
    "name": "Filipino"
  },
  {
    "code": "ELFI",
    "name": "Finance &amp; Investment"
  },
  {
    "code": "MSFA",
    "name": "Financial Analysis"
  },
  {
    "code": "FREN",
    "name": "French"
  },
  {
    "code": "GEDU",
    "name": "General Education"
  },
  {
    "code": "GERM",
    "name": "German"
  },
  {
    "code": "GSMA",
    "name": "Global Studies"
  },
  {
    "code": "GREK",
    "name": "Greek"
  },
  {
    "code": "HS",
    "name": "Health Services"
  },
  {
    "code": "HEBR",
    "name": "Hebrew"
  },
  {
    "code": "HIST",
    "name": "History"
  },
  {
    "code": "HONC",
    "name": "Honors College"
  },
  {
    "code": "HON",
    "name": "Honors/Humanities"
  },
  {
    "code": "ELHS",
    "name": "Human Services"
  },
  {
    "code": "MSIS",
    "name": "Information Systems-Master"
  },
  {
    "code": "IEP",
    "name": "Intensive English Program"
  },
  {
    "code": "INTD",
    "name": "Interdisciplinary Studies"
  },
  {
    "code": "IME",
    "name": "International and Multicultura"
  },
  {
    "code": "BAIS",
    "name": "International Studies"
  },
  {
    "code": "MAIS",
    "name": "International Studies (Grad)"
  },
  {
    "code": "ITAL",
    "name": "Italian"
  },
  {
    "code": "JAPN",
    "name": "Japanese"
  },
  {
    "code": "JSSJ",
    "name": "Jewish Studies /Social Justice"
  },
  {
    "code": "KIN",
    "name": "Kinesiology"
  },
  {
    "code": "LATN",
    "name": "Latin"
  },
  {
    "code": "LAS",
    "name": "Latin American Studies"
  },
  {
    "code": "LAW",
    "name": "Law"
  },
  {
    "code": "L&I",
    "name": "Learning and Instruction"
  },
  {
    "code": "BSM",
    "name": "Management"
  },
  {
    "code": "BAM",
    "name": "Management"
  },
  {
    "code": "MSMI",
    "name": "Marketing Intelligence"
  },
  {
    "code": "MIM",
    "name": "Master in Management"
  },
  {
    "code": "MBA",
    "name": "Master of Business Administrat"
  },
  {
    "code": "MFA",
    "name": "Master of Fine Arts in Writing"
  },
  {
    "code": "MATH",
    "name": "Mathematics"
  },
  {
    "code": "MS",
    "name": "Media Studies"
  },
  {
    "code": "MIMS",
    "name": "Migration Studies"
  },
  {
    "code": "ELMI",
    "name": "Military Science"
  },
  {
    "code": "MILS",
    "name": "Military Science"
  },
  {
    "code": "MSEI",
    "name": "MS Entrepreneurship Innovation"
  },
  {
    "code": "MUSE",
    "name": "Museum Studies"
  },
  {
    "code": "MUS",
    "name": "Music"
  },
  {
    "code": "ELMU",
    "name": "Music"
  },
  {
    "code": "NEUR",
    "name": "Neuroscience"
  },
  {
    "code": "NPA",
    "name": "Nonprofit Administration"
  },
  {
    "code": "NURS",
    "name": "Nursing"
  },
  {
    "code": "NHP",
    "name": "Nursing and Health Professions"
  },
  {
    "code": "O&L",
    "name": "Organization and Leadership"
  },
  {
    "code": "OD",
    "name": "Organization Development"
  },
  {
    "code": "PASJ",
    "name": "Performing Arts &amp; Social Justi"
  },
  {
    "code": "ELHR",
    "name": "Personnel"
  },
  {
    "code": "PHIL",
    "name": "Philosophy"
  },
  {
    "code": "ELPH",
    "name": "Photography"
  },
  {
    "code": "PHYS",
    "name": "Physics"
  },
  {
    "code": "ELPO",
    "name": "Politics"
  },
  {
    "code": "POLS",
    "name": "Politics"
  },
  {
    "code": "PORT",
    "name": "Portuguese"
  },
  {
    "code": "PC",
    "name": "Professional Communication"
  },
  {
    "code": "PSHI",
    "name": "PS History"
  },
  {
    "code": "ELPS",
    "name": "Psychology"
  },
  {
    "code": "PSYC",
    "name": "Psychology"
  },
  {
    "code": "PA",
    "name": "Public Administration"
  },
  {
    "code": "BSPH",
    "name": "Public Health (BS)"
  },
  {
    "code": "MPH",
    "name": "Public Health (MPH)"
  },
  {
    "code": "MPL",
    "name": "Public Leadership"
  },
  {
    "code": "ELRS",
    "name": "Religion"
  },
  {
    "code": "RHET",
    "name": "Rhetoric and Composition"
  },
  {
    "code": "RUSS",
    "name": "Russian"
  },
  {
    "code": "SII",
    "name": "Saint Ignatius Institute"
  },
  {
    "code": "SOC",
    "name": "Sociology"
  },
  {
    "code": "SPAN",
    "name": "Spanish"
  },
  {
    "code": "SPED",
    "name": "Special Programs"
  },
  {
    "code": "SM",
    "name": "Sport Management"
  },
  {
    "code": "STU",
    "name": "Study Abroad"
  },
  {
    "code": "TEC",
    "name": "Teacher Education"
  },
  {
    "code": "THTR",
    "name": "Theater"
  },
  {
    "code": "THRS",
    "name": "Theology and Religious Studies"
  },
  {
    "code": "ELHI",
    "name": "U. S. History &amp; Culture"
  },
  {
    "code": "USF",
    "name": "University of San Francisco"
  },
  {
    "code": "UPA",
    "name": "Urban and Public Affairs"
  },
  {
    "code": "URBS",
    "name": "Urban Studies"
  },
  {
    "code": "UXUI",
    "name": "UXUI-User Experience/Interface"
  },
  {
    "code": "ELWS",
    "name": "Women&#39;s Studies"
  },
  {
    "code": "YPSP",
    "name": "Yuchengco Philippine Studies P"
  }
]"""

def string_to_json(input_string):
    try:
        json_data = json.loads(input_string)
        return json_data
    except json.JSONDecodeError as e:
        return {"error": "Invalid JSON string", "details": str(e)}

def get_subjects():
    """
    This function retrieves the subjects from the global variable RAW_STRING.
    It returns a list of dictionaries containing the subjects' codes and names.
    """
    return string_to_json(RAW_STRING)

def get_subject_dict():
    """
    This function retrieves the subjects from the global variable RAW_STRING.
    It returns a dictionary where the keys are subject codes and the values are subject names.
    """
    subjects = get_subjects()
    if isinstance(subjects, list):
        return {subject['name']: subject['code'] for subject in subjects}
    else:
        return {"error": "Failed to retrieve subjects", "details": subjects.get("details", "Unknown error")}

# Example usage
if __name__ == "__main__":
    for subject in subject_generator():
        print(subject)
