# Shrome Browser

A modern, Linux-inspired web browser built with Electron, React, TypeScript, and Redux Toolkit.

## 🎯 Project Overview

Shrome is a fully-featured web browser with a clean, minimalist design inspired by Linux desktop environments (GNOME, KDE). It prioritizes efficiency, developer-friendliness, and open-source aesthetics.

## 📁 Project Architecture

```
shrome-browser/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.js             # Main entry point
│   │   └── preload.js          # Preload script for IPC
│   │
│   └── renderer/               # React renderer process
│       ├── components/         # React components
│       │   ├── browser/        # Browser UI components
│       │   ├── tabs/           # Tab management
│       │   ├── navigation/     # Address bar, buttons
│       │   ├── sidebar/        # Bookmarks, history panel
│       │   ├── settings/       # Settings pages
│       │   └── shared/         # Reusable UI components
│       │
│       ├── hooks/              # Custom React hooks
│       ├── services/           # Business logic services
│       ├── store/              # Redux state management
│       ├── styles/             # CSS/Tailwind styles
│       ├── types/              # TypeScript type definitions
│       └── utils/              # Utility functions
│
├── assets/                     # Static assets
│   └── icons/                  # App icons
│
├── data/                       # Local storage (bookmarks, etc.)
│
├── dist/                       # Built application
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite bundler config
├── tailwind.config.js          # Tailwind CSS config
└── postcss.config.js           # PostCSS config
```

## 🚀 Features

### Core Browser Features
- ✅ Multi-tab browsing with tab groups
- ✅ Address bar with smart URL/search detection
- ✅ Navigation controls (Back, Forward, Refresh, Home)
- ✅ Bookmark manager with folders
- ✅ Download manager
- ✅ Browsing history
- ✅ Incognito/Private mode
- ✅ Search engine integration (Google, DuckDuckGo, Bing)
- ✅ Multiple window support
- ✅ Session restore
- ✅ Basic password manager

### User Interface
- ✅ Linux-inspired design (GNOME/KDE aesthetic)
- ✅ Dark and light themes
- ✅ Customizable toolbar
- ✅ Sidebar for bookmarks and history
- ✅ Modern tab design
- ✅ Responsive layout
- ✅ Smooth animations
- ✅ Settings page

### Advanced Features (Planned)
- 🔲 Extension support
- 🔲 Ad blocker
- 🔲 Developer tools integration
- 🔲 PDF viewer
- 🔲 Screenshot tool
- 🔲 Built-in AI assistant panel
- 🔲 Tab grouping
- 🔲 Split-screen browsing
- 🔲 Profile management
- 🔲 Sync settings and bookmarks

### Security Features
- ✅ Sandboxed processes
- ✅ HTTPS-first mode option
- ✅ Pop-up blocker
- ✅ Tracking protection
- ✅ Permission manager
- ✅ Safe browsing warnings

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Desktop Framework | Electron |
| Frontend | React 19 + TypeScript |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Browser Engine | Chromium (via Electron) |
| Database | LowDB (JSON-based) |

## 📦 Installation & Development

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Create Distributable
```bash
npm run dist
```

## 🔧 Configuration

### Search Engines
Configure in `src/renderer/store/browserSlice.ts`:
- Google (default)
- DuckDuckGo
- Bing
- Custom

### Themes
- Light mode
- Dark mode
- System preference

## 📝 State Management

The browser uses Redux Toolkit for state management with the following slices:

### Browser Slice
Manages:
- Tabs (create, close, navigate, pin)
- Tab groups
- Bookmarks
- History
- Downloads
- Settings
- Sidebar state
- AI Assistant
- Split view
- Incognito mode

## 🔐 Security Considerations

1. **Context Isolation**: Enabled in preload script
2. **Node Integration**: Disabled in renderer
3. **Sandbox**: Enabled for web contents
4. **CSP**: Content Security Policy configured
5. **Permission Control**: Default deny with selective allow

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 🗺️ Development Roadmap

### Phase 1: MVP (Current)
- [x] Project setup
- [x] Basic Electron window
- [x] Tab management
- [x] Navigation system
- [x] Redux store
- [ ] WebView integration
- [ ] Basic UI components

### Phase 2: Core Features
- [ ] Bookmark system
- [ ] History tracking
- [ ] Download manager
- [ ] Settings page
- [ ] Theme switching

### Phase 3: Advanced Features
- [ ] Extension system
- [ ] Ad blocker
- [ ] Password manager
- [ ] Sync service
- [ ] AI assistant

### Phase 4: Polish & Release
- [ ] Performance optimization
- [ ] Testing suite
- [ ] Documentation
- [ ] Beta release
- [ ] v1.0 release
