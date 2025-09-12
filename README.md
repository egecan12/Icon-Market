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

I have deployed it to Render.com. As it is on the free tier, it may take some time to wake the server up.

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

### Docker Setup

#### Prerequisites
- Docker installed
- Docker Compose installed

#### Running with Docker
```bash
# Start the project
docker-compose up --build
```

The application will be available at **http://localhost:3000**

#### Basic Docker Commands
```bash
# Start application
docker-compose up

# Run in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs
```

## Key Implementation Details

### Redux Architecture
- **Separation of Concerns** - Icons and errors in separate slices
- **Type Safety** - Error categorization (validation, network, data)
- **Immutable Updates** - Using Redux Toolkit's Immer integration

### Component Interaction Pattern

**Unidirectional Data Flow: Example of 'Search' Action**

<img width="657" height="758" alt="data-flow-examle drawio (2)" src="https://github.com/user-attachments/assets/ad1697ae-72fd-4322-a3a0-4e2d33848830" />


## Technical Decisions & Trade-offs

### Search Implementation
- **Case-Insensitive Search** - Implemented for better UX, as requirements didn't specify case sensitivity
- **Real-time Filtering** - Chosen over debounced search for immediate feedback
- **Client-side Search** - Selected for faster response times with current dataset size

### Data Structure Considerations
- **Current**: Flat array structure for simplicity and quick implementation
- **Trade-off**: Some memory duplication with repeated category strings across icons
- **Performance Impact**: Minimal with current dataset (~118 icons), but scalability concerns noted

### Validation Strategy
- **Basic Type Checking** - Implemented array validation and null checks
- **Missing Specifications**: 
  - Icon name character restrictions not defined
  - Category naming conventions unclear
  - SVG content validation criteria unspecified

## Future Improvements

### Performance Optimizations
```javascript
// Current: Flat array (simplified)
[
  { name: "home", category: "interface", svg: "..." },
  { name: "user", category: "interface", svg: "..." }
]

// Proposed: Nested object structure (memory efficient)
{
  "interface": [
    { name: "home", svg: "..." },
    { name: "user", svg: "..." }
  ],
  "arrows": [...]
}
```

### Enhanced Validation
- **Icon Name Validation** - Define allowed characters and length limits
- **SVG Content Validation** - Implement proper SVG syntax and security checks
- **Category Standards** - Establish naming conventions and validation rules
- **Runtime Schema Validation** - Add Zod or similar for comprehensive data validation

### Scalability Improvements
- **Virtual Scrolling** - For handling 1000+ icons efficiently
- **Search Debouncing** - Reduce unnecessary filtering operations
- **Lazy Loading** - Load SVG content on demand
- **Caching Strategy** - Implement proper browser and server-side caching

### Questions for Product Team
1. **Search Behavior**: Should search be case-sensitive? Current implementation is case-insensitive
2. **Icon Naming**: What character restrictions should apply to icon names?
3. **Category Structure**: Are nested categories planned? For better optimization.
4. **Validation Criteria**: What is a valid SVG? Security considerations?
5. **Performance Requirements**: Expected dataset size and search performance targets?

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
