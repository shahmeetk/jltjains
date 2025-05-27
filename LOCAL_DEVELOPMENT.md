# Local Development Guide

## JLT Jain Sangh Dubai Community Wall

This guide will help you set up and run the Community Wall application locally on your machine.

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CommunityBrickBuilder
   ```

2. **Install dependencies**
   ```bash
   npm run local:setup
   ```

3. **Start development server**
   ```bash
   npm run local:dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## Available Scripts

### Development
- `npm run local:dev` - Start development server with hot reload
- `npm run local:setup` - Install dependencies and run type checking

### Production
- `npm run local:build` - Build the application for production
- `npm run local:start` - Start production server (requires build first)

### Utilities
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema (if using database)

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Page components
│   └── public/             # Static assets
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite development setup
├── shared/                # Shared types and schemas
├── data/                  # Local CSV data storage
└── dist/                  # Built application (after build)
```

## Data Storage

The application uses **CSV files** for local development:
- Data is stored in `data/contributors.csv`
- Automatically created on first run
- Persistent across restarts

## Features

- **Dynamic Brick Wall**: Contributors' names appear as animated bricks in JLT logo shape
- **Real-time Updates**: Instant updates when new contributors are added
- **Admin Controls**: Edit and delete contributor names (double-click to edit)
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Professional animations using Framer Motion

## Customization

### Brick Colors
Edit `client/src/components/brick-wall.tsx` and modify the `brickColors` array.

### Maximum Contributors
Change the `maxContributors` value in the brick wall component.

### Company Branding
Update logos and text in the component files to match your organization.

## Troubleshooting

### Port Already in Use
If port 5000 is busy, the application will show an error. Stop other applications using port 5000 or modify the port in `server/index.ts`.

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
npm run check
```

## Development Tips

1. **Hot Reload**: Changes to React components update automatically
2. **API Changes**: Server restarts automatically when backend files change
3. **Type Safety**: TypeScript provides compile-time error checking
4. **Data Persistence**: CSV data persists between development sessions

## Production Deployment

1. Build the application:
   ```bash
   npm run local:build
   ```

2. Start production server:
   ```bash
   npm run local:start
   ```

The built application will be served from the `dist/` directory.

## Support

For issues or questions about local development, check:
1. Node.js and npm versions
2. Port availability (5000)
3. File permissions for data directory
4. TypeScript compilation errors

## Next Steps

- Add your organization's branding
- Customize brick colors and animations
- Deploy to your preferred hosting platform
- Set up database for production use
