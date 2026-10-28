# LMS Cloud Sai — RESTful API Reference

The LMS Cloud Sai backend exposes a stateless RESTful API rooted at `/api`. All protected endpoints require a valid JSON Web Token transmitted in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. System Endpoints

### 1.1 Health Check
- **Route:** `GET /api/health`
- **Access:** Public (Unthrottled by rate limiter)
- **Description:** Verifies backend responsiveness, server uptime, and performs live ping to MongoDB Atlas cluster.
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "uptime": 1983.10,
    "database": "connected",
    "dbLatency": "233ms",
    "timestamp": "2026-10-28T19:49:39.128Z"
  }
  ```

---

## 2. Authentication & User Profile (`/api/auth`)

### 2.1 Register New User
- **Route:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "password": "securePassword123",
    "role": "student",
    "bio": "Aspiring full-stack developer",
    "educationalBackground": "B.Tech Computer Science",
    "skills": ["JavaScript", "React", "Node.js"],
    "hobbies": ["Open Source", "Chess"],
    "socialLinks": {
      "github": "https://github.com/janedev",
      "hackerrank": "https://hackerrank.com/janedev",
      "linkedin": "https://linkedin.com/in/janedev"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "662a5b6c...",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### 2.2 User Login
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "_id": "662a5b6c...",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "student",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "bio": "Aspiring full-stack developer",
    "educationalBackground": "B.Tech Computer Science",
    "skills": ["JavaScript", "React", "Node.js"],
    "hobbies": ["Open Source", "Chess"],
    "socialLinks": {
      "github": "https://github.com/janedev",
      "hackerrank": "https://hackerrank.com/janedev",
      "linkedin": "https://linkedin.com/in/janedev"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### 2.3 Get Current User Profile
- **Route:** `GET /api/auth/me`
- **Access:** Private (`protect`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Full user profile JSON without password.

### 2.4 Update Current User Profile
- **Route:** `PUT /api/auth/me`
- **Access:** Private (`protect`)
- **Content-Type:** `multipart/form-data` (or `application/json` if no avatar file)
- **Form Fields:** `name`, `email`, `password` (optional), `bio`, `educationalBackground`, `skills`, `hobbies`, `socialLinks`, `avatar` (file).
- **Response (200 OK):** Updated user profile payload with refreshed token.

### 2.5 Get All Registered Students (Admin Only)
- **Route:** `GET /api/auth/students`
- **Access:** Private (`protect`, `admin`)
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Retrieves list of all registered student accounts with their profile metadata for the admin moderation dashboard.
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "662a5b6c...",
      "name": "Rahul Sharma",
      "email": "student@example.com",
      "role": "student",
      "avatar": "https://res.cloudinary.com/...",
      "createdAt": "2026-10-28T18:00:00.000Z"
    }
  ]
  ```

### 2.6 Delete Student Account (Admin Only)
- **Route:** `DELETE /api/auth/students/:id`
- **Access:** Private (`protect`, `admin`)
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Permanently deletes a student account by ObjectId.
- **Response (200 OK):**
  ```json
  {
    "message": "Student account removed successfully"
  }
  ```

---

## 3. Courses (`/api/courses`)

### 3.1 Get All Courses (Paginated & Searchable)
- **Route:** `GET /api/courses`
- **Access:** Public
- **Query Parameters:**
  - `pageNumber` (number, default: 1)
  - `keyword` (string, case-insensitive regex search on title)
- **Response (200 OK):**
  ```json
  {
    "courses": [
      {
        "_id": "662a60f...",
        "title": "Full-Stack Web Development",
        "description": "Comprehensive guide to MERN stack",
        "category": "Web Development",
        "thumbnail": "https://res.cloudinary.com/.../course.jpg",
        "modules": [
          {
            "_id": "662a610...",
            "title": "Module 1: React Fundamentals",
            "content": "# React Basics\nComponents, props, state...",
            "order": 0
          }
        ],
        "createdAt": "2026-04-20T10:00:00.000Z"
      }
    ],
    "page": 1,
    "pages": 3
  }
  ```

### 3.2 Get Course by ID
- **Route:** `GET /api/courses/:id`
- **Access:** Public
- **Response (200 OK):** Single course object with all module contents.

### 3.3 Create New Course
- **Route:** `POST /api/courses`
- **Access:** Private/Admin (`protect`, `admin`)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `title`, `description`, `category`, `modules` (JSON array or stringified JSON), `thumbnail` (file attachment).
- **Response (201 Created):** Created course object.

### 3.4 Update Course
- **Route:** `PUT /api/courses/:id`
- **Access:** Private/Admin (`protect`, `admin`)
- **Content-Type:** `multipart/form-data`
- **Response (200 OK):** Updated course object.

### 3.5 Delete Course
- **Route:** `DELETE /api/courses/:id`
- **Access:** Private/Admin (`protect`, `admin`)
- **Response (200 OK):** `{ "message": "Course removed" }`

---

## 4. Video Tutorials (`/api/tutorials`)

### 4.1 Get All Tutorials
- **Route:** `GET /api/tutorials`
- **Access:** Public
- **Query Parameters:**
  - `pageNumber` (number, default: 1)
  - `keyword` (string, regex search on title)
  - `category` (string, exact category filter)
- **Response (200 OK):** `{ "tutorials": [...], "page": 1, "pages": 1 }`

### 4.2 Get Tutorial by ID
- **Route:** `GET /api/tutorials/:id`
- **Access:** Public
- **Response (200 OK):** Tutorial object including `videoUrl` and markdown `content`.

### 4.3 Create Tutorial
- **Route:** `POST /api/tutorials`
- **Access:** Private/Admin (`protect`, `admin`)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `title`, `description`, `category`, `content`, `tags` (JSON string or array), `thumbnail` (image file), `video` (video file).
- **Response (201 Created):** Created tutorial object.

### 4.4 Update Tutorial
- **Route:** `PUT /api/tutorials/:id`
- **Access:** Private/Admin (`protect`, `admin`)
- **Content-Type:** `multipart/form-data`
- **Response (200 OK):** Updated tutorial object.

### 4.5 Delete Tutorial
- **Route:** `DELETE /api/tutorials/:id`
- **Access:** Private/Admin (`protect`, `admin`)
- **Response (200 OK):** `{ "message": "Tutorial removed" }`

---

## 5. Study Materials (`/api/materials`)

### 5.1 Get All Study Materials
- **Route:** `GET /api/materials`
- **Access:** Public
- **Query Parameters:**
  - `pageNumber` (number, default: 1)
  - `keyword` (string, regex match on title)
  - `type` (enum: `pdf` | `link` | `notes`)
- **Response (200 OK):** `{ "materials": [...], "page": 1, "pages": 1 }`

### 5.2 Create Study Material
- **Route:** `POST /api/materials`
- **Access:** Private/Admin (`protect`, `admin`)
- **Request Body (JSON):**
  ```json
  {
    "title": "System Design Cheat Sheet",
    "description": "Essential architectural principles and trade-offs",
    "category": "Architecture",
    "fileUrl": "https://example.com/system-design.pdf",
    "type": "pdf"
  }
  ```
- **Response (201 Created):** Created study material object.

### 5.3 Update / Delete Material
- **Routes:** `PUT /api/materials/:id` & `DELETE /api/materials/:id`
- **Access:** Private/Admin (`protect`, `admin`)

---

## 6. Mock Tests & Assessments (`/api/mocktests`)

### 6.1 Get All Mock Tests
- **Route:** `GET /api/mocktests`
- **Access:** Public
- **Security Note:** Omits `questions.correctAnswer` from payload to prevent client-side answer exposure.
- **Response (200 OK):**
  ```json
  {
    "tests": [
      {
        "_id": "662a71...",
        "title": "Data Structures & Algorithms Quiz",
        "description": "Test your time complexity knowledge",
        "category": "Computer Science",
        "duration": 15,
        "questions": [
          {
            "questionText": "What is the worst-case time complexity of QuickSort?",
            "options": ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"]
          }
        ]
      }
    ],
    "page": 1,
    "pages": 1
  }
  ```

### 6.2 Get Mock Test by ID
- **Route:** `GET /api/mocktests/:id`
- **Access:** Public
- **Response (200 OK):** Complete test details with all question objects.

### 6.3 Create Mock Test
- **Route:** `POST /api/mocktests`
- **Access:** Private/Admin (`protect`, `admin`)
- **Request Body (JSON):**
  ```json
  {
    "title": "JavaScript Mastery Test",
    "description": "Closures, Event Loop & Promises",
    "category": "Web Development",
    "duration": 20,
    "questions": [
      {
        "questionText": "Which statement about microtasks is true?",
        "options": [
          "They run after macrotasks",
          "Promise callbacks are microtasks",
          "setTimeout executes before Promise.then",
          "They are handled by Node OS threads"
        ],
        "correctAnswer": "Promise callbacks are microtasks",
        "explanation": "Promise callbacks queue on the microtask queue."
      }
    ]
  }
  ```
- **Response (201 Created):** Created mock test object.

### 6.4 Update / Delete Mock Test
- **Routes:** `PUT /api/mocktests/:id` & `DELETE /api/mocktests/:id`
- **Access:** Private/Admin (`protect`, `admin`)

---

## 7. Results & Leaderboard (`/api/results`)

### 7.1 Submit Mock Test Result
- **Route:** `POST /api/results`
- **Access:** Private (`protect`)
- **Request Body:**
  ```json
  {
    "mockTestId": "662a71...",
    "answers": [
      {
        "questionIndex": 0,
        "selectedOption": "Promise callbacks are microtasks"
      }
    ],
    "timeTaken": 145
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "662a80...",
    "student": "662a5b...",
    "mockTest": "662a71...",
    "score": 100,
    "totalQuestions": 1,
    "correctAnswers": 1,
    "timeTaken": 145,
    "answers": [
      {
        "questionIndex": 0,
        "selectedOption": "Promise callbacks are microtasks",
        "isCorrect": true
      }
    ]
  }
  ```

### 7.2 Get Student Test History
- **Route:** `GET /api/results/me`
- **Access:** Private (`protect`)
- **Response (200 OK):** Array of logged-in student's past results populated with test title and category.

### 7.3 Get Global Leaderboard
- **Route:** `GET /api/results/leaderboard`
- **Access:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "662a5b...",
      "avgScore": 95,
      "testsTaken": 6,
      "studentInfo": {
        "name": "Alex Rivera",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
      }
    }
  ]
  ```

### 7.4 Get Single Result by ID
- **Route:** `GET /api/results/:id`
- **Access:** Private (`protect`)
- **Response (200 OK):** Detailed result breakdown with question details.

---

## 8. Platform Announcements (`/api/announcements`)

### 8.1 Get All Announcements
- **Route:** `GET /api/announcements`
- **Access:** Public
- **Response (200 OK):** Array of announcements sorted by `createdAt` descending.

### 8.2 Create Announcement
- **Route:** `POST /api/announcements`
- **Access:** Private/Admin (`protect`, `admin`)
- **Request Body (JSON):**
  ```json
  {
    "title": "Hackathon 2026 Announcement",
    "message": "Registration is now open for our annual 48-hour coding hackathon!"
  }
  ```
- **Response (201 Created):** Created announcement object.

### 8.3 Delete Announcement
- **Route:** `DELETE /api/announcements/:id`
- **Access:** Private/Admin (`protect`, `admin`)
- **Response (200 OK):** `{ "message": "Announcement removed" }`

---

## 9. Admin Statistics (`/api/admin`)

### 9.1 Get System Overview Stats
- **Route:** `GET /api/admin/stats`
- **Access:** Private/Admin (`protect`, `admin`)
- **Response (200 OK):**
  ```json
  {
    "students": 42,
    "courses": 8,
    "tutorials": 15,
    "testResults": 110,
    "announcements": 3
  }
  ```
