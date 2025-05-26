
# Jain Allied Science DMCC - Community Wall Application

## Project Overview
A dynamic community wall application built for Jain Allied Science DMCC, allowing team members to add their names to create a visual representation of the company's community. The application features a brick wall design with professional corporate styling.

## Features
- **Dynamic Brick Wall**: Contributors' names appear as animated bricks
- **Real-time Progress Tracking**: Shows completion percentage and remaining spots
- **Professional Design**: Corporate blue theme matching Jain Allied Science DMCC branding
- **Admin Controls**: Edit and delete contributor names
- **Responsive Layout**: Works on desktop and mobile devices
- **Animated Interactions**: Smooth animations using Framer Motion

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Backend**: Express.js + TypeScript
- **Database**: SQLite with Drizzle ORM
- **Build Tool**: Vite

## Development History & Instructions

### Initial Setup Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Key User Instructions Given:

1. **Branding Update**: Changed from "JAS" to "Jain Allied Science" throughout the application
2. **Dynamic Wall Filling**: Implemented progressive brick filling with animation effects
3. **Professional Corporate Design**: 
   - Blue color scheme matching company branding
   - Professional animations and effects
   - Corporate logo background patterns
4. **Interactive Features**:
   - Click bricks for sparkle effects
   - Double-click to edit names (admin mode)
   - Admin controls for managing contributors

### Specific Prompts and Features Implemented:

#### 1. Initial Brick Wall Concept
- Created animated brick wall layout using CSS Grid
- Implemented professional corporate colors
- Added gradient backgrounds and shadow effects

#### 2. Progress Tracking System
- Real-time contributor count display
- Progress bar showing completion percentage
- Motivational messaging cards
- Statistics sidebar with key metrics

#### 3. Animation and Interactivity
- Framer Motion animations for brick placement
- Sparkle effects on brick interaction
- Smooth hover and transition effects
- Flying-in animations for new contributors

#### 4. Admin Features
- Toggle admin mode with settings button
- Edit contributor names inline
- Delete contributors with confirmation
- Adjustable maximum contributor limits

#### 5. Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Professional card-based design system
- Consistent spacing and typography

#### 6. Brand Integration
- "Jain Allied Science DMCC" branding throughout
- Corporate blue color scheme (#2563EB)
- Professional typography and spacing
- Company logo background patterns

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── add-name-form.tsx   # Form for adding contributors
│   │   ├── brick-wall.tsx      # Main brick wall component
│   │   └── progress-sidebar.tsx # Progress tracking sidebar
│   ├── pages/
│   │   ├── home.tsx           # Main application page
│   │   └── not-found.tsx      # 404 page
│   ├── lib/
│   │   ├── queryClient.ts     # TanStack Query configuration
│   │   └── utils.ts           # Utility functions
│   └── App.tsx                # Main application component
server/
├── db.ts                      # Database schema
├── routes.ts                  # API routes
├── storage.ts                 # Data persistence
└── index.ts                   # Express server setup
```

## API Endpoints
- `GET /api/contributors` - Fetch all contributors
- `POST /api/contributors` - Add new contributor
- `PATCH /api/contributors/:id` - Update contributor name
- `DELETE /api/contributors/:id` - Remove contributor
- `GET /api/contributors/count` - Get contributor count

## Current Issues Fixed
1. ✅ Syntax error in progress-sidebar.tsx (JSX structure)
2. ✅ Updated branding from "JAS" to "Jain Allied Science"
3. ✅ Fixed missing imports for motion and other dependencies
4. ✅ Implemented dynamic wall filling
5. ✅ Added professional corporate styling

## Running the Application
1. Ensure all dependencies are installed: `npm install`
2. Start the development server: `npm run dev`
3. Access the application at the provided URL
4. Add contributor names using the form
5. Watch the wall fill dynamically with animated bricks

## Customization Options
- Adjust `MAX_CONTRIBUTORS` in progress-sidebar.tsx
- Modify brick colors in the `brickColors` array
- Update company branding in header and footer
- Customize animation timing and effects

## Deployment
The application is configured for Replit deployment with automatic port forwarding on port 5000.

## Future Enhancements
- Export contributor list functionality
- Bulk import capabilities
- Custom brick themes
- Advanced admin dashboard
- Email notifications for new contributors
