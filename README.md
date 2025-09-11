# Iconflix - Icon Library Dashboard

A responsive icon library management system built with React and modern CSS architecture.

![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)

## Screenshots

<img width="350" height="350" alt="Macbook-Air-localhost (1)" src="https://github.com/user-attachments/assets/dd009cc9-17ab-4c59-af21-d06ed6eb7cfd" />
<img width="125" height="350" alt="iPhone-14-Plus-localhost" src="https://github.com/user-attachments/assets/5db30642-56ce-4e76-820c-74a5a04b1df5" />


## Features

- Real-time search and category filtering
- Responsive grid layout with CSS Grid and Flexbox
- Comprehensive error handling with ErrorBoundary
- Redux state management with separate slices
- Docker containerization for consistent deployments

## Live Demo

🚀 **[View Live Demo](https://icon-market.onrender.com/)**

Experience the application in action with full functionality including search, filtering, and responsive design.

## Tech Stack

- **React 19** - Modern component architecture with hooks
- **Redux Toolkit** - State management with slices for icons and error handling
- **Vite** - Fast build tool and development server
- **CSS Grid & Flexbox** - Responsive layout system
- **Docker** - Containerization for deployment

## Architecture

### State Management
Redux Toolkit implementation with separate slices:
- `iconsSlice` - Handles icon data, search, and filtering
- `errorSlice` - Centralized error handling with type categorization

### Error Handling Strategy
- **ErrorBoundary** - Catches JavaScript runtime errors
- **Redux Error State** - Application-level error management
- **Validation** - Data validation with user-friendly messages
- **Auto-dismiss** - Error notifications clear automatically

### Component Design
```
src/
├── components/
│   ├── Dashboard/          # Main layout with Redux integration
│   ├── IconList/          # Grid with error boundaries
│   ├── ErrorBoundary/     # JavaScript error catching
│   └── ErrorNotification/ # User error feedback
├── store/
│   ├── iconsSlice.js      # Icon state management
│   ├── errorSlice.js      # Error state management
│   └── store.js           # Redux store configuration
```

## Getting Started

### Local Development
```bash
npm install
npm run dev
```

### Docker Deployment
```bash
docker-compose up --build
```
Access at http://localhost:3000

## Key Implementation Details

### Redux Architecture
- **Separation of Concerns** - Icons and errors in separate slices
- **Type Safety** - Error categorization (validation, network, data)
- **Immutable Updates** - Using Redux Toolkit's Immer integration

### Component Interaction Pattern

**Unidirectional Data Flow:**

<img width="657" height="758" alt="data-flow-examle drawio (2)" src="https://github.com/user-attachments/assets/ad1697ae-72fd-4322-a3a0-4e2d33848830" />

```
User Input → Action Dispatch → Reducer → Selector → UI Update
```

**Concrete Example:**
1. User searches "home" in SearchBar
2. `dispatch(setSearchTerm("home"))`
3. iconsSlice reducer updates state + triggers filtering
4. `selectFilteredIcons` selector returns filtered results
5. IconList re-renders with new data

### Responsive Design
- **CSS Grid** - Auto-responsive icon grid with `repeat(auto-fill, minmax(140px, 1fr))`
- **Flexbox** - Component-level layout and alignment
- **Breakpoints** - Mobile-first approach with strategic media queries

### Error Handling Patterns
- **Component Level** - ErrorBoundary catches React component errors
- **Application Level** - Redux error slice manages user-facing errors
- **Data Validation** - Input validation with descriptive error messages

## Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code quality check
npm run test         # Run tests
npm run test:run     # Run tests once

# Utility scripts
node src/utils/svg2json.js                    # Convert SVG files to JSON
node src/utils/category-formatter.js format   # Clean category names
node src/utils/category-formatter.js preview  # Preview category changes
```

---

**Egecan Kahyaoglu**  
