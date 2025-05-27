
# JLT Jain Sangh Dubai - Community Wall

A dynamic, interactive community wall application built for JLT Jain Sangh Dubai and Jain Allied Science DMCC. This application allows community members to add their names to a beautiful, animated brick wall display.

## 🌟 Features

- **Dynamic Brick Wall**: Interactive wall with animated brick creation
- **Real-time Updates**: Smooth animations when new contributors are added
- **Responsive Design**: Optimized for all screen sizes, especially large LED displays
- **Professional Branding**: JLT logo integration throughout the interface
- **Persistent Storage**: Data persistence using localStorage for GitHub Pages deployment
- **Fullscreen Mode**: Dedicated fullscreen view for display purposes
- **LED Screen Optimized**: High contrast colors and visibility for big screens

## 🚀 Live Demo

Visit the live application: [https://jltjains.github.io](https://jltjains.github.io)

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite
- **UI Components**: Radix UI
- **Animations**: Framer Motion + Custom CSS animations
- **State Management**: TanStack Query
- **Deployment**: GitHub Pages

## 🏗️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jltjains/jltjains.github.io.git
cd jltjains.github.io
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Production Build

### For GitHub Pages Deployment

```bash
npm run build:gh-pages
```

### For Local Preview

```bash
npm run preview
```

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

- Push to the `main` branch triggers automatic deployment
- GitHub Actions builds and deploys the application
- Live site updates within minutes

### Manual Deployment

```bash
npm run deploy:gh-pages
```

## 🎨 Features Overview

### Community Wall

- **Animated Brick Creation**: Smooth flying animation when new names are added
- **Dynamic Layout**: Responsive grid that adapts to screen size
- **Logo Background**: JLT logos scattered throughout empty spaces
- **Shining Text Effects**: Names have subtle golden glow animations
- **Color Themes**: LED-optimized color palette for maximum visibility

### User Interface

- **Clean Form Design**: Minimal input form with motivational messaging
- **Progress Tracking**: Real-time contributor count display
- **Fullscreen Mode**: Dedicated view for large screen displays
- **Toast Notifications**: Personalized thank you messages

### Technical Features

- **Production Ready**: Optimized build with code splitting
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance**: Optimized animations and rendering
- **Accessibility**: ARIA labels and keyboard navigation support

## 🎯 Usage

1. **Adding Contributors**: Enter a name in the input field and click "Add to Wall"
2. **Viewing Wall**: Watch as new bricks fly in with smooth animations
3. **Fullscreen Mode**: Click "Open in New Tab" for dedicated display view
4. **LED Display**: Perfect for corporate displays and large screens

## 🔧 Configuration

### Environment Variables

- `VITE_APP_TITLE`: Application title (default: "JLT Jain Sangh Dubai")
- `VITE_APP_SUBTITLE`: Application subtitle (default: "Jain Allied Science DMCC")

### Customization

- **Colors**: Modify `client/src/components/brick-wall.tsx` for color themes
- **Animations**: Update `client/src/index.css` for animation timings
- **Layout**: Adjust grid settings in the brick wall component

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About

Created for **JLT Jain Sangh Dubai** and **Jain Allied Science DMCC** to build and showcase their growing community through an interactive digital wall experience.

---

**Enlarging Jain Community while serving the same roots** 🙏
