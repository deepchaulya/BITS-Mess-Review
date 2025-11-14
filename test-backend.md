# Backend Testing Guide

## Check if Backend is Running

### 1. Test Backend Health
Open your browser and visit:
```
http://localhost:8080/h2-console
```

If you see the H2 console login page, the backend is running!

### 2. Check if Data is Initialized

After logging into H2 console:
- JDBC URL: `jdbc:h2:mem:messreviewdb`
- Username: `sa`
- Password: (empty)

Run this query:
```sql
SELECT * FROM OUTLETS;
```

**Expected Result**: You should see 3 outlets:
1. Malviya Mess
2. Srinivasa Ramanujan Mess
3. Looters Truck

If you see 0 rows, the data wasn't initialized!

### 3. Test API Directly (with auth)

First, get your JWT token:
1. Open browser DevTools (F12)
2. Go to Application tab > Local Storage > http://localhost:5174
3. Copy the value of `token`

Then test in PowerShell:
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/outlets" -Headers $headers
```

This should return the list of outlets!

## Common Issues & Fixes

### Issue 1: Backend Not Running
**Symptom**: Can't access http://localhost:8080/h2-console
**Fix**:
```powershell
cd C:\A_Cool_Calm_Attempt\mess-review-backend
.\run-backend.bat
```

### Issue 2: Data Not Initialized
**Symptom**: H2 console shows empty OUTLETS table
**Fix**: Restart the backend - DataInitializer runs on startup
```powershell
# Stop backend (Ctrl+C)
# Then restart:
.\run-backend.bat
```

Look for this message in the console:
```
Database initialized with outlets and food items!
```

### Issue 3: JWT Token Invalid/Missing
**Symptom**: 401 Unauthorized errors in browser console
**Fix**:
1. Logout
2. Sign in again
3. New token will be generated

### Issue 4: CORS Errors
**Symptom**: CORS policy errors in browser console
**Fix**: Check that CorsConfig includes your frontend URL (http://localhost:5174)

## Quick Diagnosis

**Open browser console (F12) and look for:**

1. **Network errors** (red in Console tab)
   - Click on the failed request
   - Check the Response tab
   - This will tell you exactly what went wrong

2. **401 Unauthorized**
   - Your JWT token expired or is invalid
   - Solution: Logout and sign in again

3. **404 Not Found**
   - Backend endpoint doesn't exist or backend is not running
   - Solution: Restart backend

4. **500 Internal Server Error**
   - Backend error (check backend console logs)
   - Usually means data isn't initialized

## Manual API Test (Without Auth)

The outlets endpoint requires authentication, but you can test auth endpoints:

```powershell
# Test signup endpoint
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/signup" `
  -ContentType "application/json" `
  -Body '{"name":"Test","email":"test@pilani.bits-pilani.ac.in","password":"test123"}'
```

If this works, backend is running!

## Checklist

- [ ] Backend is running (http://localhost:8080/h2-console accessible)
- [ ] Data is initialized (OUTLETS table has 3 rows)
- [ ] JWT token exists in localStorage
- [ ] Frontend is running (http://localhost:5174)
- [ ] No CORS errors in browser console
- [ ] Can successfully sign in
- [ ] After sign in, redirected to /outlets page

## Next Steps

Once you verify the above, try:
1. Clear browser cache
2. Logout and login again
3. Check browser console for specific error
4. Share the error message so I can help fix it!
