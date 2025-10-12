# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Bus Tracker** mobile application built with React Native and Expo, featuring real-time bus tracking, route planning, and multi-language support (English and Hindi). The project consists of a React Native frontend and a FastAPI backend.

## Development Commands

### Frontend (React Native/Expo)
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or 
npx expo start

# Run on specific platforms
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device  
npm run web        # Run on web browser

# Lint code
npm run lint

# Reset project (moves starter code to app-example, creates blank app directory)
npm run reset-project
```

### Backend (FastAPI/Python)
```powershell
# Navigate to backend directory
cd backend

# Install dependencies (in virtual environment recommended)
pip install -r requirements.txt

# Start development server
uvicorn server:app --reload

# Run tests
pytest

# Code formatting and linting
black .
isort .
flake8 .
mypy .
```

### Running Full Stack
```powershell
# Terminal 1: Start backend
cd backend
uvicorn server:app --reload

# Terminal 2: Start frontend  
cd frontend
npx expo start
```

## Architecture Overview

### Frontend Architecture

**File-Based Routing (Expo Router)**
- Uses Expo Router for navigation with file-based routing structure
- Main app structure in `frontend/app/` directory
- Tabs-based navigation with screens: home, track, routes, settings

**State Management (Zustand)**
- Global state managed using Zustand store (`store/useAppStore.ts`)
- Handles bus positions, route planning, user preferences, and permissions
- Persistent storage using AsyncStorage for user preferences

**Key Components Structure:**
- `components/BusCard.tsx` - Reusable bus information display
- `components/MapPlaceholder.tsx` - Map view placeholder
- `data/mockData.ts` - Mock data for development/testing
- `utils/translations.ts` - Multi-language support utilities
- `types/index.ts` - TypeScript type definitions

**Real-time Features:**
- Bus position simulation and updates every 30 seconds
- Live tracking with ETA calculations
- Journey planning with transfer optimization

### Backend Architecture

**FastAPI REST API**
- Single `server.py` file with FastAPI application
- MongoDB integration using Motor (async MongoDB driver)
- CORS enabled for cross-origin requests
- Basic status tracking endpoints

**Current Endpoints:**
- `GET /api/` - Root endpoint
- `POST /api/status` - Create status check
- `GET /api/status` - Retrieve status checks

### Data Models

**Core Types (TypeScript):**
- `Bus` - Bus entity with position, capacity, status
- `BusRoute` - Route with stops and metadata
- `BusStop` - Stop with coordinates and amenities
- `JourneyPlan` - Route planning results with multiple options
- `UserPreferences` - User settings, favorites, and language

**Multi-language Support:**
- Built-in English and Hindi translations
- Bilingual stop names and route descriptions
- Translation utility function for dynamic text

## Development Guidelines

### Code Organization
- Follow existing file structure and naming conventions
- Use TypeScript strictly - all components have proper type definitions
- Maintain separation between mock data and real API integration
- Keep translation keys consistent between English and Hindi

### State Management Patterns
- Use Zustand store for all global state
- Persist user preferences to AsyncStorage
- Update bus positions through scheduled intervals
- Handle offline scenarios gracefully

### UI/UX Considerations
- Support both English and Hindi languages throughout
- Maintain accessibility features (wheelchair accessible indicators)
- Use Material Design icons consistently
- Implement proper loading states and error handling

### Backend Development
- Use async/await patterns with FastAPI
- Validate input with Pydantic models
- Follow RESTful API conventions
- Include proper error handling and logging

## Testing Framework

The project uses a specialized testing protocol defined in `test_result.md`. When making changes:

1. Update test results in YAML format in `test_result.md`
2. Set `needs_retesting: true` for modified components
3. Track stuck tasks and implementation status
4. Use the testing agent for verification when available

## Environment Configuration

**Frontend Environment Variables** (`.env`):
- API endpoints and configuration
- Development vs production settings

**Backend Environment Variables** (`.env`):
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name
- Other service configurations

## Common Development Tasks

### Adding New Bus Routes
1. Update `mockData.ts` with new route and stop data
2. Ensure bilingual names are provided
3. Test route planning algorithm with new routes

### Implementing Real API Integration
1. Replace mock data calls in `useAppStore.ts`
2. Update backend endpoints in `server.py`
3. Add proper error handling for API failures
4. Implement data caching strategies

### Adding New Languages
1. Extend `translations.ts` with new language object
2. Update type definitions for language codes
3. Add new language option in settings screen

### Debugging Common Issues
- **Build failures**: Check Expo CLI version and dependencies
- **State not persisting**: Verify AsyncStorage operations
- **Translation missing**: Check translation keys exist in both languages
- **Backend connection**: Verify CORS settings and endpoint URLs

## Platform-Specific Notes

### Windows Development
- Use PowerShell for running commands
- Ensure proper path handling with Windows backslashes
- Android development requires Android Studio setup

### Dependencies Management
- Frontend uses Yarn as package manager (specified in package.json)
- Backend uses pip with requirements.txt
- Keep dependency versions locked for consistency

## Performance Considerations

- Bus position updates are throttled to 30-second intervals
- Route calculations are optimized for direct routes first, then transfers
- Mock data simulation includes realistic movement patterns
- Implement proper cleanup for intervals and subscriptions