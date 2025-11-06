# Math Tutor API Documentation

Base URL: `http://localhost:3000`

All endpoints require authentication via Clerk. Include the session cookie or Authorization header automatically.

---

## Session Management

### POST /api/session/start

**Purpose:** Start a new quiz session with 10 random non-repeating questions

**Request:**
```bash
curl -X POST http://localhost:3000/api/session/start \
  -H "Content-Type: application/json" \
  -d '{"lessonId": "lesson-1"}'
```

**Request Body:**
```json
{
  "lessonId": "lesson-1"
}
```

**Response (201 Created):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "lessonId": "lesson-1",
  "lessonTitle": "Make-10 Strategy",
  "totalQuestions": 10,
  "questions": [
    {
      "itemId": "item-1-1",
      "question": "8 + 5 = ?",
      "order": 1
    },
    {
      "itemId": "item-1-2",
      "question": "7 + 4 = ?",
      "order": 2
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Missing/invalid lessonId
- `404 Not Found` - Lesson not found

---

### POST /api/session/answer

**Purpose:** Submit an answer to a quiz question

**Request:**
```bash
curl -X POST http://localhost:3000/api/session/answer \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "itemId": "item-1-1",
    "userAnswer": 13
  }'
```

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "itemId": "item-1-1",
  "userAnswer": 13
}
```

**Response (200 OK):**
```json
{
  "itemId": "item-1-1",
  "correct": true,
  "correctAnswer": 13,
  "userAnswer": 13,
  "feedback": "Correct! Well done!",
  "tags": [],
  "questionsRemaining": 9,
  "sessionComplete": false
}
```

**Error Response (incorrect):**
```json
{
  "itemId": "item-1-1",
  "correct": false,
  "correctAnswer": 13,
  "userAnswer": 12,
  "feedback": "Great effort! Let's use the 'Make 10' strategy. Break it into 10 + more.",
  "tags": ["complement_miss"],
  "questionsRemaining": 9,
  "sessionComplete": false
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid request or no active session
- `500 Internal Server Error` - OpenAI API failure (fallback feedback used)

---

### POST /api/session/complete

**Purpose:** Finalize a quiz session and calculate mastery score

**Request:**
```bash
curl -X POST http://localhost:3000/api/session/complete \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "550e8400-e29b-41d4-a716-446655440000"}'
```

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200 OK - Passed):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "correctCount": 9,
  "totalCount": 10,
  "masteryScore": 90.0,
  "passed": true,
  "summary": {
    "topErrors": [],
    "suggestedSubLesson": null
  },
  "nextLessonUnlocked": {
    "id": "lesson-2",
    "title": "Doubles & Near-Doubles"
  }
}
```

**Response (200 OK - Failed):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "correctCount": 7,
  "totalCount": 10,
  "masteryScore": 70.0,
  "passed": false,
  "summary": {
    "topErrors": ["complement_miss", "near_double_confusion"],
    "suggestedSubLesson": {
      "id": "sub-1-1",
      "title": "Introduction to Make-10",
      "description": "Learn how to break numbers into 10 + more"
    }
  },
  "nextLessonUnlocked": null
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid request or no active session
- `404 Not Found` - User not found

---

## Progress Tracking

### GET /api/progress

**Purpose:** Fetch user's lesson progress and completion status

**Request:**
```bash
curl http://localhost:3000/api/progress
```

**Response (200 OK):**
```json
{
  "userId": "user_123abc",
  "progress": [
    {
      "lessonId": "lesson-1",
      "lessonTitle": "Make-10 Strategy",
      "completed": true,
      "masteryScore": 92.5,
      "lastAttempt": "2025-11-06T15:30:00Z",
      "currentSubLesson": null
    },
    {
      "lessonId": "lesson-2",
      "lessonTitle": "Doubles & Near-Doubles",
      "completed": false,
      "masteryScore": 0,
      "lastAttempt": null,
      "currentSubLesson": null
    },
    {
      "lessonId": "lesson-3",
      "lessonTitle": "Choosing Strategies",
      "completed": false,
      "masteryScore": 0,
      "lastAttempt": null,
      "currentSubLesson": null
    }
  ],
  "overallProgress": 33.3
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found

---

### POST /api/progress/update

**Purpose:** Update user progress (admin/debug endpoint)

**Request:**
```bash
curl -X POST http://localhost:3000/api/progress/update \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "lesson-1",
    "masteryScore": 85.0,
    "completed": false
  }'
```

**Request Body:**
```json
{
  "lessonId": "lesson-1",
  "masteryScore": 85.0,
  "completed": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "progress": {
    "id": "progress_123",
    "userId": "user_123",
    "lessonId": "lesson-1",
    "masteryScore": 85.0,
    "completed": false,
    "lastAttempt": "2025-11-06T16:00:00Z",
    "createdAt": "2025-11-06T14:00:00Z",
    "updatedAt": "2025-11-06T16:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid request
- `404 Not Found` - Lesson or user not found

---

## Mastery Thresholds

- **90-100%**: PASS - Advance to next lesson
- **70-89%**: PARTIAL - Suggest remediation sub-lesson
- **<70%**: FAIL - Retry current lesson

---

## Error Tagging System

When a student provides an incorrect answer, the system tags the error for feedback routing:

### Error Tags

| Tag | Meaning | Example |
|-----|---------|---------|
| `complement_miss` | Didn't use Make-10 strategy | 8 + 5 = 12 (should be 13) |
| `double_miss_low` | Double off by -1 | 5 + 5 = 9 (should be 10) |
| `double_miss_high` | Double off by +1 | 6 + 6 = 13 (should be 12) |
| `double_major_error` | Double significantly wrong | 7 + 7 = 10 (should be 14) |
| `near_double_wrong_base` | Near-double with wrong base | 6 + 7 = 12 (used 6+6) |
| `near_double_off` | Near-double off by 1 | 5 + 6 = 10 (should be 11) |
| `incomplete_addition` | Only added one number | 7 + 3 = 7 (should be 10) |
| `counting_error` | Counted incorrectly | 6 + 5 = 2 (should be 11) |
| `off_by_one` | Answer is off by 1 | 7 + 3 = 9 (should be 10) |

---

## Rate Limiting

No rate limiting is currently implemented. For production, consider adding:
- 10 requests per minute per user (per session)
- 100 requests per minute per IP

---

## Caching

OpenAI feedback is cached per question + error tag combination to reduce API costs.

Cache hit example:
1. User 1 answers "8 + 5" = 12 (complement_miss) → OpenAI called
2. User 2 answers "8 + 5" = 12 (complement_miss) → Cached response used

---

## Testing

### Postman Collection

Import this flow into Postman to test:

1. **Start Session**
   - POST /api/session/start
   - Body: `{"lessonId": "lesson-1"}`
   - Copy sessionId from response

2. **Submit Answers (10 times)**
   - POST /api/session/answer
   - Body: `{"sessionId": "...", "itemId": "...", "userAnswer": 12}`

3. **Complete Session**
   - POST /api/session/complete
   - Body: `{"sessionId": "..."}`

4. **Check Progress**
   - GET /api/progress
   - No body needed

---

## Future Enhancements

- [ ] WebSocket support for real-time feedback
- [ ] Image-based problems
- [ ] Audio/speech input for answers
- [ ] Multi-operation problems (mixed addition/subtraction)
- [ ] Difficulty scaling based on performance
- [ ] Timed sessions
- [ ] Leaderboards

