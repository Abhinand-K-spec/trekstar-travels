# Trekstar - Travel Planning Platform

A modern, Pickyourtrail-inspired travel planning website built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js). Create personalized, step-by-step travel itineraries with a conversational and interactive experience by **Trekstar Tours and Travels Private Limited**.

## Features

### User Experience
- 🎯 **Conversational Onboarding**: 4-step interactive form to capture travel preferences
- 🗺️ **Interactive Itinerary Builder**: Split layout with daily timeline and map view
- 💰 **Live Pricing Widget**: Real-time price breakdown for flights, hotels, and activities
- 🏨 **Flexible Customization**: Swap hotels, add/remove activities on the fly
- 💬 **Expert Assistance**: Chat with travel experts for personalized help
- 📱 **Mobile-First Design**: Responsive UI optimized for all devices

### Technical Features
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Design**: Teal/Emerald color palette, Inter/Poppins fonts, smooth animations
- **Architecture**: Clean MVC structure, RESTful API, type-safe implementations

## Project Structure

```
travels/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Request handlers
│   ├── routes/         # API routes
│   ├── services/       # Business logic (pricing)
│   ├── utils/          # Mock data generators
│   └── server.js       # Express server
│
└── frontend/            # Next.js application
    ├── src/
    │   ├── app/        # Pages (landing, onboarding, itinerary)
    │   ├── components/ # Reusable components
    │   ├── context/    # Global state management
    │   ├── lib/        # API client
    │   └── types/      # TypeScript definitions
    └── package.json
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

### MongoDB

Make sure MongoDB is running locally or update `backend/.env` with your MongoDB URI.

## Core User Flow

1. **Landing Page**: Hero section, trending destinations, testimonials
2. **Onboarding** (4 steps):
   - Destination, month, duration
   - Travel companion (Solo, Couple, Family, Friends)
   - Travel mood (Relaxed, Adventure, Culture, Foodie)
   - Budget range and departure city
3. **Itinerary Builder**:
   - Left panel: Vertical daily timeline with hotels and activities
   - Right panel: Interactive map with route markers
   - Bottom: Live pricing widget
   - Actions: Swap hotels, add/remove activities
4. **Customization**: Modify itinerary with real-time price updates

## API Endpoints

### Itineraries
- `POST /api/itineraries` - Create itinerary
- `GET /api/itineraries/:id` - Get itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `POST /api/itineraries/:id/swap-hotel` - Swap hotel
- `POST /api/itineraries/:id/add-activity` - Add activity
- `POST /api/itineraries/:id/remove-activity` - Remove activity
- `GET /api/itineraries/:id/pricing` - Get pricing

### Resources
- `GET /api/destinations/trending` - Trending destinations
- `GET /api/itineraries/hotels/available` - Available hotels
- `GET /api/itineraries/activities/available` - Available activities

## Design Philosophy

- **NOT a clone**: Unique, cleaner UI with modern aesthetics
- **Teal/Emerald palette**: Fresh, inviting color scheme
- **Large cards**: 16-20px border radius for modern feel
- **Smooth animations**: Hover lifts, fade-ins, scale effects
- **Mobile-first**: Optimized for smaller screens first

## Tech Stack Details

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Fonts**: Google Fonts (Inter, Poppins)
- **State**: React Context API
- **API Client**: Fetch with type-safe wrappers

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Services**: Centralized pricing service
- **Mock Data**: Pre-populated destinations, hotels, activities

## Development

Both servers support hot reload during development:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Production Build

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## Future Enhancements

- [ ] Real API integrations (Google Maps, flight/hotel APIs)
- [ ] User authentication and saved itineraries
- [ ] Payment integration for booking
- [ ] Email notifications
- [ ] PDF export of itineraries
- [ ] Social sharing features
- [ ] Multi-language support

## License

This project is for educational/demonstration purposes.

---

**Note**: This application uses mock data for demonstrations. In production, integrate with real flight, hotel, and activity APIs.
