# Features Implemented - Mess & Restaurant Rating System

## ✅ Completed Features

### Backend (Spring Boot)

#### Entities Created:
1. **Outlet** - Represents mess or restaurant
   - Fields: name, type (MESS/RESTAURANT), description, average rating, total ratings

2. **FoodItem** - Individual food items in each outlet
   - Fields: name, description, outlet, average rating, total ratings

3. **Rating** - User ratings for outlets and food items
   - Fields: user, stars (1-5), review text, isAnonymous, outlet/foodItem

#### Database Initialized With:
**Mess 1: Malviya Mess**
- Rajma Rasila
- Macroni Salad
- Paneer Lababdar
- Veg Kofta
- Madrasi Aloo

**Mess 2: Srinivasa Ramanujan Mess**
- Rajma Rasila
- Macroni Salad
- Paneer Lababdar
- Veg Kofta
- Madrasi Aloo

**Restaurant: Looters Truck**
- Chicken Pizza
- Chicken Popcorn
- Chicken Burger
- Cold Coffee
- Lemon Tea

#### API Endpoints:

**Outlets:**
- `GET /api/outlets` - Get all outlets
- `GET /api/outlets/{id}` - Get outlet by ID
- `GET /api/outlets/type/{type}` - Get outlets by type (MESS/RESTAURANT)
- `GET /api/outlets/{id}/food-items` - Get food items for an outlet

**Ratings:**
- `POST /api/ratings/outlet` - Rate an outlet (1-5 stars + optional review)
- `POST /api/ratings/food-item` - Rate a food item (1-5 stars + optional review)
- `GET /api/ratings/outlet/{id}` - Get all ratings for an outlet
- `GET /api/ratings/food-item/{id}` - Get all ratings for a food item
- `GET /api/ratings/outlet/{id}/reviews` - Get text reviews for an outlet
- `GET /api/ratings/food-item/{id}/reviews` - Get text reviews for a food item

### Frontend (React)

#### Pages Created:
1. **Outlets Page** (`/outlets`)
   - Lists all mess and restaurants
   - Filter by type (All, Mess Only, Restaurants Only)
   - Shows average rating and total ratings for each outlet
   - Click to view details

2. **Outlet Details Page** (`/outlets/{id}`)
   - Shows outlet information and overall rating
   - Lists all food items with individual ratings
   - Button to rate the outlet overall
   - Button to rate individual food items
   - Shows recent reviews

#### Components Created:
1. **StarRating** - Interactive star rating component
   - 1-5 star rating
   - Read-only mode for displaying ratings
   - Interactive mode for submitting ratings
   - Three sizes: small, medium, large

#### Features:
1. **Star Rating (1-5)**
   - ✅ Rate outlets (overall)
   - ✅ Rate individual food items
   - ✅ Visual star interface
   - ✅ Real-time average calculation

2. **Text Reviews**
   - ✅ Optional text review with rating
   - ✅ View all reviews on outlet page
   - ✅ Timestamps for reviews

3. **Anonymous vs Public Reviews**
   - ✅ Checkbox to post anonymously
   - ✅ If anonymous and no text: shows "Anonymous"
   - ✅ If text review added: shows user name (unless explicitly anonymous)

4. **Real-time Rating Updates**
   - ✅ Average rating recalculated on each new rating
   - ✅ Total ratings count updated
   - ✅ Applies to both outlets and food items

## How to Use

### 1. Start the Backend
```powershell
cd mess-review-backend
.\run-backend.bat
```

Wait for: `Started MessReviewApplication`

Backend at: http://localhost:8080

### 2. Frontend is Running
Frontend at: http://localhost:5174

### 3. Sign In
Visit: http://localhost:5174/signin
- Use any `@pilani.bits-pilani.ac.in` email
- Or create new account

### 4. Browse Outlets
- After login, you'll see all mess and restaurants
- Filter by type using buttons
- Click on any outlet to view details

### 5. Rate Outlets
- Click "Rate Mess/Restaurant" button for overall rating
- Or click "Rate Item" on individual food items
- Give 1-5 star rating
- Optionally add text review
- Choose anonymous or public

### 6. View Ratings
- See average ratings on outlet cards
- See individual food item ratings
- Read text reviews from other students

## Rating Logic

### Star Ratings:
- Range: 1-5 stars
- Validation: enforced at backend
- Average: calculated automatically
- Real-time: updates on each submission

### Review Text:
- Optional: can rate without text
- Anonymous option: checkbox in modal
- Name display rules:
  - Anonymous + no text = "Anonymous"
  - Anonymous + text = "Anonymous" (if checkbox checked)
  - Not anonymous + text = User's real name

### One Rating Per User:
- Each user can rate an outlet once
- Each user can rate a food item once
- Subsequent ratings UPDATE the previous rating
- Prevents spam/multiple ratings

## Testing

### Test Flow:
1. Sign in with: `test1@pilani.bits-pilani.ac.in`
2. Browse to Malviya Mess
3. Rate overall mess: 4 stars + "Good food quality"
4. Rate "Rajma Rasila": 5 stars + "Excellent taste!"
5. Sign in with different user: `test2@pilani.bits-pilani.ac.in`
6. Rate same items differently
7. See average ratings update

### Expected Behavior:
- Average of 4 and 3 = 3.5 stars
- Both reviews visible
- Total ratings count = 2
- Real-time updates work

## Database

### View Data:
Visit: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:messreviewdb`
- Username: `sa`
- Password: (empty)

### Queries:
```sql
-- View all outlets
SELECT * FROM OUTLETS;

-- View all food items
SELECT * FROM FOOD_ITEMS;

-- View all ratings
SELECT * FROM RATINGS;

-- View ratings with user names
SELECT r.*, u.name, u.email
FROM RATINGS r
JOIN USERS u ON r.user_id = u.id;
```

## API Testing

### Rate Outlet (curl):
```bash
curl -X POST http://localhost:8080/api/ratings/outlet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "outletId": 1,
    "stars": 5,
    "reviewText": "Excellent food!",
    "isAnonymous": false
  }'
```

### Rate Food Item:
```bash
curl -X POST http://localhost:8080/api/ratings/food-item \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodItemId": 1,
    "stars": 4,
    "reviewText": "Very tasty!",
    "isAnonymous": true
  }'
```

## File Structure

### Backend:
```
src/main/java/com/bits/messreview/
├── entity/
│   ├── Outlet.java
│   ├── FoodItem.java
│   ├── Rating.java
│   └── OutletType.java
├── repository/
│   ├── OutletRepository.java
│   ├── FoodItemRepository.java
│   └── RatingRepository.java
├── service/
│   ├── OutletService.java
│   └── RatingService.java
├── controller/
│   ├── OutletController.java
│   └── RatingController.java
└── config/
    └── DataInitializer.java
```

### Frontend:
```
src/
├── components/
│   └── StarRating.jsx
├── pages/
│   ├── Outlets.jsx
│   └── OutletDetails.jsx
└── services/
    └── outletService.js
```

## Next Steps (Future Enhancements)

1. **Admin Features:**
   - Admin can delete inappropriate reviews
   - Moderate content
   - View analytics

2. **Advanced Features:**
   - Sort food items by rating
   - Filter by rating range
   - Search food items
   - Upload food images
   - Meal timing information

3. **Social Features:**
   - Like/helpful votes on reviews
   - Report inappropriate content
   - Follow other reviewers

4. **Analytics:**
   - Most popular items
   - Trending food
   - Rating distribution charts
   - Time-based ratings

## Troubleshooting

### Backend won't start:
```powershell
cd mess-review-backend
.\mvnw.cmd clean install
.\run-backend.bat
```

### Frontend errors:
Check browser console (F12) for errors

### Ratings not saving:
- Ensure you're logged in
- Check JWT token in localStorage
- Check backend logs

### Can't see outlets:
- Restart backend (data initializer runs on startup)
- Check H2 console to verify data exists

## Success Criteria

✅ Two mess added (Malviya, Ramanujan)
✅ One restaurant added (Looters Truck)
✅ 5 food items per outlet
✅ Star rating (1-5) for outlets
✅ Star rating (1-5) for food items
✅ Text reviews optional
✅ Anonymous rating option
✅ Real-time average calculation
✅ Reviews display with names/anonymous

**Everything is working! 🎉**
