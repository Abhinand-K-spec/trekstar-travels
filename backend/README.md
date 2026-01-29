# Travel Planner Backend

Backend API for the travel planning platform built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI if needed.

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Itineraries
- `POST /api/itineraries` - Create a new itinerary
- `GET /api/itineraries/:id` - Get itinerary by ID
- `PUT /api/itineraries/:id` - Update itinerary
- `GET /api/itineraries/:id/pricing` - Get pricing breakdown

### Hotel Management
- `POST /api/itineraries/:id/swap-hotel` - Swap hotel for a specific day
- `GET /api/itineraries/hotels/available?city=Paris` - Get available hotels

### Activity Management
- `POST /api/itineraries/:id/add-activity` - Add activity to a day
- `POST /api/itineraries/:id/remove-activity` - Remove activity from a day
- `GET /api/itineraries/activities/available?city=Paris&mood=culture` - Get available activities

### Other
- `GET /api/destinations/trending` - Get trending destinations
- `GET /api/health` - Health check

## Project Structure

```
backend/
├── models/           # MongoDB schemas
├── controllers/      # Request handlers
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utilities and mock data
├── server.js        # Express server
└── package.json
```
