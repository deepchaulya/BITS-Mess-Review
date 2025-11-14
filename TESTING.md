# Testing Guide - Frontend-Backend Integration

This guide will help you test the complete authentication flow between the React frontend and Spring Boot backend.

## Prerequisites

Make sure you have both servers running:
- **Frontend**: http://localhost:5174 (React + Vite)
- **Backend**: http://localhost:8080 (Spring Boot)

## Starting the Servers

### Terminal 1 - Backend
```bash
cd mess-review-backend
mvn spring-boot:run
```

Wait for the message: `Started MessReviewApplication in X seconds`

### Terminal 2 - Frontend
```bash
cd mess-review-app
npm run dev
```

The frontend is already running at: http://localhost:5174

## Testing the Authentication Flow

### Test 1: Sign Up (New User Registration)

1. **Open Browser**: Navigate to http://localhost:5174/signup

2. **Fill the form**:
   - Name: `Test Student`
   - Email: `test@pilani.bits-pilani.ac.in`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Expected Result**:
   - If backend is running: You'll be redirected to `/dashboard` and see a welcome message
   - If backend is NOT running: You'll see an error message about connection

4. **Verify in Backend**:
   - Check H2 console: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:messreviewdb`
   - Username: `sa`
   - Password: (leave empty)
   - Query: `SELECT * FROM USERS`
   - You should see your newly created user

### Test 2: Email Validation

Try signing up with these emails to test validation:

**Invalid Emails (Should show error)**:
- `test@gmail.com` - Wrong domain
- `test@bits-pilani.ac.in` - Missing 'pilani' subdomain
- `test@pilani.bits.ac.in` - Wrong structure
- `test.com` - Not an email

**Valid Email (Should work)**:
- `student@pilani.bits-pilani.ac.in`

### Test 3: Sign In (Existing User)

1. **Navigate to**: http://localhost:5174/signin

2. **Use credentials from Test 1**:
   - Email: `test@pilani.bits-pilani.ac.in`
   - Password: `password123`

3. **Expected Result**:
   - Successful login
   - Redirected to `/dashboard`
   - Your name displayed in the navigation bar

4. **Check localStorage** (Browser DevTools):
   - Open DevTools (F12)
   - Go to Application > Local Storage > http://localhost:5174
   - You should see:
     - `token`: JWT token string
     - `user`: JSON object with your user data

### Test 4: Wrong Credentials

Try signing in with wrong password:
- Email: `test@pilani.bits-pilani.ac.in`
- Password: `wrongpassword`

**Expected**: Error message showing "Invalid email or password"

### Test 5: Protected Routes

1. **While logged out**, try to access: http://localhost:5174/dashboard

**Expected**: Automatically redirected to `/signin`

2. **After logging in**, access: http://localhost:5174/dashboard

**Expected**: Dashboard page loads successfully

### Test 6: Logout

1. **On Dashboard**, click the "Logout" button

**Expected**:
- Redirected to `/signin`
- localStorage cleared
- Cannot access `/dashboard` without logging in again

### Test 7: Token Persistence

1. **Login** to your account
2. **Refresh the page** (F5)

**Expected**: You remain logged in (token persists)

3. **Close the browser tab**
4. **Open a new tab** and go to http://localhost:5174

**Expected**: You're still logged in (token persists across sessions)

### Test 8: Multiple Users

Create multiple users with different BITS emails:
- `student1@pilani.bits-pilani.ac.in`
- `student2@pilani.bits-pilani.ac.in`
- `admin@pilani.bits-pilani.ac.in`

**Expected**: Each user can sign up and sign in independently

## API Testing with cURL

### Sign Up API
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@pilani.bits-pilani.ac.in",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "name": "API Test User",
  "email": "apitest@pilani.bits-pilani.ac.in",
  "role": "STUDENT"
}
```

### Sign In API
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@pilani.bits-pilani.ac.in",
    "password": "password123"
  }'
```

## Common Issues and Troubleshooting

### Issue 1: "Network Error" or "Failed to fetch"
**Cause**: Backend is not running
**Solution**: Start the Spring Boot backend (`mvn spring-boot:run`)

### Issue 2: CORS Error in Console
**Cause**: Backend CORS not configured properly
**Solution**: Check that backend `CorsConfig.java` includes `http://localhost:5174`

### Issue 3: "Email already registered"
**Cause**: User with that email already exists
**Solution**: Use a different email or check H2 database

### Issue 4: 401 Unauthorized after login
**Cause**: JWT token invalid or expired
**Solution**: Clear localStorage and login again

### Issue 5: Backend won't start (Maven error)
**Cause**: Maven not installed or Java version mismatch
**Solution**:
- Install Maven: https://maven.apache.org/download.cgi
- Ensure Java 17+ is installed: `java -version`

## Monitoring

### Frontend Console
- Open DevTools (F12) > Console
- Watch for API calls and responses
- Check for any JavaScript errors

### Backend Logs
- Watch the terminal where Spring Boot is running
- Look for SQL queries (JPA logging enabled)
- Check for authentication errors

### Network Tab
- Open DevTools > Network
- Filter by XHR
- Inspect request/response headers and payloads
- Verify JWT token is sent in Authorization header

## Success Criteria

✅ **Authentication Complete** when:
1. User can sign up with BITS email
2. User can sign in with credentials
3. Dashboard shows after successful login
4. User info displays correctly
5. Logout works and clears session
6. Protected routes redirect unauthorized users
7. Token persists across page refreshes
8. Email validation works (only BITS emails)

## Next Steps After Testing

Once authentication is working:
1. Create mess and outlet entities
2. Add food item management
3. Implement rating system
4. Add admin features
5. Deploy to production

## Database Quick Reference

### View All Users
```sql
SELECT * FROM USERS;
```

### Delete a User
```sql
DELETE FROM USERS WHERE EMAIL = 'test@pilani.bits-pilani.ac.in';
```

### Reset Database
Simply restart the Spring Boot application (H2 in-memory resets on restart)
