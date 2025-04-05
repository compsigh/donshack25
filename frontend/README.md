# Course Management API Documentation

This API provides endpoints to manage courses, professors, and subjects in an academic system.

**Note:** If you are not running the next server locallly, then replace `http://localhost:3000` with `https://donshack25.vercel.app`

## Endpoints

### Subjects

#### Create a Subject
```bash
curl -X POST http://localhost:3000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS101"
  }'
```

#### Get All Subjects
```bash
curl http://localhost:3000/api/subjects
```

### Professors

#### Create a Professor
```bash
curl -X POST http://localhost:3000/api/professors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu"
  }'
```

#### Get All Professors
```bash
curl http://localhost:3000/api/professors
```

### Courses

#### Create a Course
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Programming",
    "description": "Learn basic programming concepts",
    "credits": 3,
    "subjectId": 1,
    "professorId": 1,
    "courseAIds": [],
    "courseBIds": []
  }'
```

#### Update a Course
```bash
curl -X PATCH http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Advanced Programming",
    "credits": 4,
    "courseAIds": [2, 3],
    "courseBIds": []
  }'
```

#### Get All Courses
```bash
curl http://localhost:3000/api/courses
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
  "createdAt": "2024-04-04T10:00:00.000Z",
  "updatedAt": "2024-04-04T10:00:00.000Z",
  "Course_A": [],
  "Course_B": []
}
```