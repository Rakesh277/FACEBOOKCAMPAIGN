# Facebook Campaign Manager - Testing Guide

## Prerequisites
1. MongoDB running locally (or MongoDB Atlas connection string)
2. Node.js installed
3. OpenAI API key (optional for testing)

## Environment Setup

### Backend (.env file in BACKEND directory)
```
MONGO_URI=mongodb://localhost:27017/facebook-campaigns
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (.env file in FRONTEND directory)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing Steps

### 1. Start Backend Server
```bash
cd "C:\Users\user\OneDrive\Desktop\FACEBOOK CAMPAIGN\FACEBOOKCAMPAIGN\BACKEND"
npm run dev
```
Server should start on http://localhost:5000

### 2. Start Frontend Server
```bash
cd "C:\Users\user\OneDrive\Desktop\FACEBOOK CAMPAIGN\FACEBOOKCAMPAIGN\FRONTEND"
npm run dev
```
Frontend should start on http://localhost:3000

### 3. Test API Endpoints

#### Test Posts API
```bash
# Create a post
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"scheduledAt": "2024-12-31T12:00:00Z"}'

# Get all posts
curl http://localhost:5000/api/posts
```

#### Test Campaigns API
```bash
# Create a campaign
curl -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Campaign"}'

# Get all campaigns
curl http://localhost:5000/api/campaigns
```

#### Test Analytics API
```bash
curl http://localhost:5000/api/analytics
```

### 4. Test Frontend
1. Open http://localhost:3000 in browser
2. Navigate between pages:
   - Home (/)
   - Login (/login)
   - Campaigns (/campaigns)
3. Check browser console for any errors

### 5. Test Features
- Create new campaigns
- Generate AI posts
- Schedule posts
- View analytics

## Troubleshooting
- Check MongoDB connection
- Verify environment variables
- Check console logs for errors
- Ensure both servers are running
