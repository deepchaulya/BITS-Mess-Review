# BITS Pilani Mess Review System

A comprehensive web application for BITS Pilani students to review and rate mess food items and eateries around campus. Built with React + Tailwind CSS frontend and Spring Boot backend with OAuth2 authentication.

## Project Overview

This system allows BITS Pilani students to:
- Sign up and sign in using their BITS email (@pilani.bits-pilani.ac.in)
- Rate and review mess outlets and individual food items
- Submit anonymous ratings or public reviews
- View average ratings for food items and outlets
- Real-time rating updates as more students participate

Admin features:
- Separate admin login
- Delete inappropriate reviews
- Moderate content

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Security**: Spring Security with JWT & OAuth2
- **Database**: H2 (development) / PostgreSQL (production)
- **Authentication**: JWT + Google OAuth2

## Project Structure

```
.
├── mess-review-app/          # React Frontend
│   ├── src/
│   │   ├── pages/           # SignUp, SignIn pages
│   │   └── components/      # Reusable components
│   └── package.json
│
└── mess-review-backend/      # Spring Boot Backend
    ├── src/main/java/com/bits/messreview/
    │   ├── config/          # Security & CORS config
    │   ├── controller/      # REST controllers
    │   ├── dto/             # Request/Response DTOs
    │   ├── entity/          # JPA entities
    │   ├── repository/      # Data repositories
    │   ├── security/        # JWT & OAuth2 handlers
    │   └── service/         # Business logic
    └── pom.xml
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 17+
- Maven 3.6+

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd mess-review-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at: **http://localhost:5174**

### Backend Setup

1. Navigate to backend directory:
```bash
cd mess-review-backend
```

2. Install dependencies:
```bash
mvn clean install
```

3. (Optional) Configure Google OAuth2:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Update `src/main/resources/application.properties`

4. Run the application:
```bash
mvn spring-boot:run
```

Backend will be available at: **http://localhost:8080**

## Features Implemented

### ✅ Phase 1: Authentication (Current)

#### Frontend:
- Sign Up page with BITS email validation
- Sign In page with error handling
- Form validation (client-side)
- Responsive UI with Tailwind CSS
- Navigation between pages

#### Backend:
- User registration with BITS email validation (@pilani.bits-pilani.ac.in)
- Local authentication (email + password)
- Google OAuth2 authentication (BITS email only)
- JWT token generation and validation
- Role-based access (STUDENT, ADMIN)
- CORS configuration for frontend
- H2 database with User entity

### 🔜 Phase 2: Upcoming Features
- Mess and outlet management
- Food item catalog
- Rating system (1-5 stars)
- Anonymous vs public reviews
- Real-time rating aggregation
- Admin dashboard for moderation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /oauth2/authorization/google` - Google OAuth2 login

See [Backend README](./mess-review-backend/README.md) for detailed API documentation.

## Security Features

1. **Email Domain Restriction**: Only @pilani.bits-pilani.ac.in emails allowed
2. **JWT Authentication**: Stateless, secure token-based auth
3. **OAuth2 Integration**: Google Sign-In for BITS students
4. **Password Encryption**: BCrypt hashing
5. **CORS Protection**: Configured allowed origins
6. **Role-Based Access Control**: STUDENT and ADMIN roles

## Testing

### Test Accounts (After running backend)

You can create test accounts using the API:

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@pilani.bits-pilani.ac.in",
    "password": "password123"
  }'
```

## Current Status

**Frontend**: ✅ Sign Up and Sign In pages complete and functional
**Backend**: ✅ Authentication system complete with JWT and OAuth2
**Integration**: ✅ Complete - Frontend connected to backend with full authentication flow
**Dashboard**: ✅ Protected dashboard page with user info and logout

## Next Steps

1. ~~**Connect Frontend to Backend**~~ ✅ **COMPLETED**
   - ~~Add Axios for HTTP requests~~ ✅
   - ~~Update SignUp/SignIn to call backend APIs~~ ✅
   - ~~Store JWT token in localStorage~~ ✅
   - ~~Add protected routes~~ ✅

2. **Implement Mess/Outlet Features**
   - Create outlet entity and repository
   - Add outlet listing page
   - Implement outlet selection

3. **Build Rating System**
   - Food item entity
   - Rating entity (anonymous/public)
   - Real-time average calculation
   - Review submission form

4. **Admin Features**
   - Admin login page
   - Review moderation dashboard
   - Delete inappropriate content

## Development Workflow

For active development, run both servers simultaneously:

**Terminal 1 - Frontend:**
```bash
cd mess-review-app
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd mess-review-backend
mvn spring-boot:run
```

Then visit http://localhost:5174 in your browser.

## Testing

See [TESTING.md](./TESTING.md) for a comprehensive testing guide including:
- Authentication flow testing
- Email validation tests
- Protected routes verification
- API testing with cURL
- Troubleshooting common issues

**Quick Test**:
1. Start backend: `cd mess-review-backend && mvn spring-boot:run`
2. Frontend is already running at http://localhost:5174
3. Sign up with: `test@pilani.bits-pilani.ac.in`
4. Should redirect to dashboard after successful registration

## Contributing

This project follows a micro-step development approach:
1. ✅ Frontend authentication pages
2. ✅ Backend authentication system
3. ✅ Frontend-Backend integration
4. ⏳ Outlet and food item management
5. ⏳ Rating and review system
6. ⏳ Admin features

## License

This project is developed for BITS Pilani students.

## Support

For issues or questions:
- Check the [Frontend README](./mess-review-app/README.md)
- Check the [Backend README](./mess-review-backend/README.md)
- Review API documentation in backend README
