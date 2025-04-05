# Course Management API Documentation

This API provides endpoints to manage courses, professors, and subjects in an academic system.

## Endpoints

### Subjects

#### Create a Subject
```bash
curl -X POST http://localhost:3000/api/subject \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS101"
  }'
```

#### Get All Subjects
```bash
curl http://localhost:3000/api/subject
```

### Professors

#### Create a Professor
```bash
curl -X POST http://localhost:3000/api/professor \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu"
  }'
```

#### Get All Professors
```bash
curl http://localhost:3000/api/professor
```

### Courses

#### Create a Course
```bash
curl -X POST http://localhost:3000/api/course \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Programming",
    "description": "Learn basic programming concepts",
    "credits": 3,
    "subjectId": 1,
    "professorId": 1,
    "prerequisiteIds": [2, 3]
  }'
```

#### Get All Courses
```bash
curl http://localhost:3000/api/course
```

## Response Formats

### Subject Response
```json
{
  "id": 1,
  "name": "Computer Science",
  "code": "CS101",
  "courses": [],
  "createdAt": "2024-04-04T10:00:00.000Z",
  "updatedAt": "2024-04-04T10:00:00.000Z"
}
```

### Professor Response
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "courses": [],
  "createdAt": "2024-04-04T10:00:00.000Z",
  "updatedAt": "2024-04-04T10:00:00.000Z"
}
```

### Course Response
```json
{
  "id": 1,
  "name": "Introduction to Programming",
  "description": "Learn basic programming concepts",
  "credits": 3,
  "subjectId": 1,
  "professorId": 1,
  "subject": {},
  "professor": {},
  "prerequisites": [],
  "isPrerequisiteFor": [],
  "createdAt": "2024-04-04T10:00:00.000Z",
  "updatedAt": "2024-04-04T10:00:00.000Z"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 409: Conflict (duplicate entry)
- 500: Server Error

## Testing with JavaScript

### Using Fetch API
```javascript
// Create a new subject
const createSubject = async () => {
  const response = await fetch('http://localhost:3000/api/subject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Computer Science',
      code: 'CS101'
    })
  });
  const data = await response.json();
  console.log(data);
};

// Get all professors
const getProfessors = async () => {
  const response = await fetch('http://localhost:3000/api/professor');
  const data = await response.json();
  console.log(data);
};

// Create a new course
const createCourse = async () => {
  const response = await fetch('http://localhost:3000/api/course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Advanced Programming',
      description: 'Deep dive into programming concepts',
      credits: 3,
      subjectId: 1,
      professorId: 1,
      prerequisiteIds: [1]
    })
  });
  const data = await response.json();
  console.log(data);
};
```