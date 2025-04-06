from dataclasses import dataclass
from typing import List

@dataclass
class Subject:
    name: str
    code: str

@dataclass
class Professor:
    name: str
    email: str

@dataclass
class Course:
    name: str
    description: str
    credits: int
    subjectId: int
    professorId: int
    prerequisiteIds: List[int]
    prerequisiteForIds: List[int]
