# BITS Mess Review Backend

Spring Boot backend for the BITS Pilani Mess Review System with OAuth2 authentication.

## Features

- JWT-based authentication
- OAuth2 Google Sign-In with BITS email validation
- Email domain restriction (@pilani.bits-pilani.ac.in only)
- Role-based access control (STUDENT, ADMIN)
- H2 in-memory database (development)
- RESTful API endpoints

## Prerequisites

- Java 17 or higher ✅ (You have Java 21)
- Maven NOT required - Maven Wrapper included!

## Quick Start (Windows)

### Easiest Method - Double-click to Run!
Simply double-click `run-backend.bat` in File Explorer

OR

### Using Command Line

**PowerShell/CMD:**
```powershell
cd mess-review-backend
.\run-backend.bat
```

**Using Maven Wrapper directly:**
```powershell
.\mvnw.cmd spring-boot:run
```

**First run**: Maven Wrapper will automatically download Maven and dependencies (2-5 minutes)

The backend will start at: **http://localhost:8080**

## Setup Instructions (Alternative Methods)

### Option 1: Maven Wrapper (Recommended - No Maven Installation)

The project includes Maven Wrapper (mvnw.cmd), so you don't need to install Maven!

**Windows:**
```powershell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Option 2: Install Maven

If you prefer to install Maven: https://maven.apache.org/download.cgi

Then run:
```bash
mvn clean install
mvn spring-boot:run
```

### 2. Configure OAuth2 (Optional)

To enable Google OAuth2 login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Copy Client ID and Client Secret
7. Update `src/main/resources/application.properties`:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
   ```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The backend will start at: http://localhost:8080

### 4. Access H2 Console

Visit: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:messreviewdb`
- Username: `sa`
- Password: (leave empty)

## API Endpoints

### Authentication Endpoints

#### Sign Up (Local)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@pilani.bits-pilani.ac.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@pilani.bits-pilani.ac.in",
  "role": "STUDENT"
}
```

#### Sign In (Local)
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john.doe@pilani.bits-pilani.ac.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@pilani.bits-pilani.ac.in",
  "role": "STUDENT"
}
```

#### Google OAuth2 Login
Visit: `http://localhost:8080/oauth2/authorization/google`

This will redirect to Google login and only allow BITS email addresses.

## Email Validation

The backend strictly validates that only emails with the domain `@pilani.bits-pilani.ac.in` can register or sign in.

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173
- http://localhost:5174
- http://localhost:3000

## Database Schema

### User Entity
- `id` (Long, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `role` (Enum: STUDENT, ADMIN)
- `email_verified` (Boolean)
- `provider` (String: local, google)
- `provider_id` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `is_active` (Boolean)

## Security Features

1. **JWT Authentication**: Stateless authentication using JWT tokens
2. **OAuth2 Integration**: Google Sign-In with email domain validation
3. **Password Encryption**: BCrypt password hashing
4. **CORS Protection**: Configured allowed origins
5. **Role-Based Access**: STUDENT and ADMIN roles

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@pilani.bits-pilani.ac.in",
    "password": "password123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@pilani.bits-pilani.ac.in",
    "password": "password123"
  }'
```

## Development Notes

- The application uses H2 in-memory database (data is lost on restart)
- For production, switch to PostgreSQL in `application.properties`
- JWT secret key should be changed in production
- OAuth2 credentials must be configured for Google login to work

## Next Steps

1. Configure Google OAuth2 credentials
2. Test local sign up/sign in endpoints
3. Integrate with React frontend
4. Implement mess and food item rating features
5. Add admin endpoints for review moderation

## Project Structure

```
src/main/java/com/bits/messreview/
├── config/          # Security and CORS configuration
├── controller/      # REST controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # Data repositories
├── security/        # Security components (JWT, OAuth2)
└── service/         # Business logic
```
