# Icon Library Dashboard

A responsive icon library management system built with React and modern CSS architecture.

![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)

## Screenshots

<img width="350" height="350" alt="Macbook-Air-localhost (1)" src="https://github.com/user-attachments/assets/dd009cc9-17ab-4c59-af21-d06ed6eb7cfd" />
<img width="125" height="350" alt="iPhone-14-Plus-localhost" src="https://github.com/user-attachments/assets/5db30642-56ce-4e76-820c-74a5a04b1df5" />


## Features

- Real-time search with live filtering
- Category-based filtering
- Responsive design for all devices
- Icon download and SVG code copying
- Clean dark theme interface

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Dashboard/          # Main dashboard container
│   ├── SearchBar/          # Search functionality
│   ├── CategoryFilter/     # Category selection
│   ├── IconList/          # Grid display of icons
│   ├── IconItem/          # Individual icon component
│   └── IconDetail/        # Icon preview and actions
├── styles/
│   └── globals.css        # Global styles and CSS variables
└── data/
    └── icon-index.json    # Icon data source
```

### CSS Architecture
- Component-scoped styling with individual CSS files
- CSS custom properties for consistent theming
- Responsive design with mobile-first approach

## Tech Stack

- React 18 with Hooks
- Vite build tool
- Modern CSS with custom properties
- SVG icons with DOMPurify sanitization
- ESLint for code quality

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd icon-library-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technical Implementation

### Component Architecture
- Folder-by-feature structure with each component in its own directory
- Index.js exports for clean imports
- Separation of concerns between logic, styling, and markup

### State Management
- React Hooks for local state management
- Controlled components for form inputs
- Simple prop passing for data flow

### Performance
- Component isolation to prevent unnecessary re-renders
- Optimized search and filtering algorithms
- Scoped CSS to prevent style conflicts

### File Organization
```
interview-project-icon-market/
├── src/
│   ├── components/
│   │   └── [ComponentName]/
│   │       ├── ComponentName.jsx
│   │       ├── ComponentName.css
│   │       └── index.js
│   ├── styles/
│   │   └── globals.css
│   ├── data/
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```


---

**Egecan Kahyaoglu**  
