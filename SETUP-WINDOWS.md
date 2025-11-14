# Windows Setup Guide - BITS Mess Review System

This guide will help you set up and run the BITS Mess Review System on Windows.

## Prerequisites Check

### 1. Check Java Installation
Open PowerShell or Command Prompt and run:
```powershell
java -version
```

**Expected Output**: Java version 17 or higher
```
java version "21.0.9" 2025-10-21 LTS
```

✅ **You have Java 21 installed** - Perfect!

If Java is not installed, download from: https://www.oracle.com/java/technologies/downloads/

### 2. Check Node.js Installation
```powershell
node --version
npm --version
```

**Expected**: Node.js 16+ and npm

## Running the Application

### Method 1: Using the Provided Scripts (Easiest)

#### Start Backend (Terminal 1)
1. Navigate to backend folder:
```powershell
cd mess-review-backend
```

2. Run the backend script:
```powershell
.\run-backend.bat
```

Or simply double-click `run-backend.bat` in File Explorer!

**First run**: The Maven Wrapper will automatically download Maven and all dependencies. This may take 2-5 minutes.

**Expected Output**:
```
Started MessReviewApplication in X seconds
```

Backend will be available at: **http://localhost:8080**

#### Frontend (Terminal 2)
The frontend is already running at: **http://localhost:5174**

If you need to restart it:
```powershell
cd mess-review-app
npm run dev
```

### Method 2: Using PowerShell Commands

#### Backend
```powershell
cd mess-review-backend
.\mvnw.cmd spring-boot:run
```

#### Frontend
```powershell
cd mess-review-app
npm run dev
```

## Testing the Application

### Quick Test
1. **Open browser**: http://localhost:5174/signup

2. **Sign up with**:
   - Name: `Test Student`
   - Email: `test@pilani.bits-pilani.ac.in`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Expected**: Redirected to dashboard showing your name

### API Test (Optional)
Test backend directly with PowerShell:
```powershell
$body = @{
    name = "Test User"
    email = "test@pilani.bits-pilani.ac.in"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/signup" `
    -ContentType "application/json" -Body $body
```

## Accessing H2 Database Console

While backend is running:
1. Visit: http://localhost:8080/h2-console
2. Enter these details:
   - JDBC URL: `jdbc:h2:mem:messreviewdb`
   - Username: `sa`
   - Password: (leave empty)
3. Click "Connect"
4. Run SQL: `SELECT * FROM USERS`

## Troubleshooting

### Issue: "mvnw.cmd: command not found"
**Solution**: Make sure you're in the `mess-review-backend` directory:
```powershell
cd C:\A_Cool_Calm_Attempt\mess-review-backend
```

### Issue: "JAVA_HOME not found"
**Solution**: Set JAVA_HOME environment variable:
1. Find Java installation path (usually `C:\Program Files\Java\jdk-21`)
2. Set environment variable:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
```

Or set permanently:
1. Search Windows for "Environment Variables"
2. Add new System Variable:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-21`

### Issue: Port 8080 already in use
**Solution**: Stop other applications using port 8080 or change the port:
1. Open `mess-review-backend\src\main\resources\application.properties`
2. Change: `server.port=8081`
3. Update frontend API URL in `mess-review-app\src\services\api.js`

### Issue: "Cannot find module 'axios'"
**Solution**: Install frontend dependencies:
```powershell
cd mess-review-app
npm install
```

### Issue: CORS errors in browser console
**Solution**: Make sure:
1. Backend is running on port 8080
2. Frontend is on port 5174
3. Check `CorsConfig.java` includes your frontend URL

## File Structure

```
C:\A_Cool_Calm_Attempt\
├── mess-review-app\          (Frontend - Port 5174)
│   ├── src\
│   ├── package.json
│   └── ...
│
├── mess-review-backend\       (Backend - Port 8080)
│   ├── src\
│   ├── pom.xml
│   ├── mvnw.cmd              (Maven Wrapper for Windows)
│   ├── run-backend.bat       (Quick start script)
│   └── .mvn\
│
├── README.md
├── TESTING.md
└── SETUP-WINDOWS.md          (This file)
```

## First Time Setup Checklist

- [✅] Java 21 installed and working
- [✅] Node.js and npm installed
- [✅] Frontend dependencies installed (`npm install`)
- [✅] Maven Wrapper configured (mvnw.cmd)
- [ ] Backend started successfully
- [ ] Frontend running
- [ ] Test sign up completed
- [ ] Dashboard accessible

## Next Steps

Once both servers are running:
1. Test the authentication flow (see TESTING.md)
2. Explore the dashboard
3. Check H2 database console
4. Start building mess/outlet features!

## Getting Help

- **CORS Issues**: Check backend console for errors
- **Database Issues**: Access H2 console to inspect data
- **Frontend Issues**: Check browser DevTools console (F12)
- **Backend Issues**: Check terminal where backend is running

## Stopping the Servers

### Backend
Press `Ctrl+C` in the terminal running the backend

### Frontend
Press `Ctrl+C` in the terminal running the frontend

Both will stop gracefully.

## Quick Start Summary

```powershell
# Terminal 1 - Backend
cd mess-review-backend
.\run-backend.bat

# Terminal 2 - Frontend (if needed)
cd mess-review-app
npm run dev

# Browser
# Visit: http://localhost:5174
```

That's it! You're ready to develop the BITS Mess Review System!
