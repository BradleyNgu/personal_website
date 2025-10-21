# Bradley Nguyen - Windows XP Portfolio

A personal portfolio website with an authentic Windows XP experience, featuring:

- 🖥️ Windows XP-style login screen with animated password entry
- 🪟 Draggable, resizable, and minimizable windows
- 📂 Three main applications: Projects, Experiences, and Autobiography
- ✏️ Fully editable content for all sections
- 🎨 Authentic Windows XP styling and animations
- ⚡ Built with React, TypeScript, and Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd personal_website
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Features

### Login Screen
- Authentic Windows XP login animation
- Automatic password typing animation
- Smooth transition to desktop

### Desktop
- Classic Windows XP wallpaper
- Desktop icons with double-click functionality
- Taskbar with Start menu
- System tray with clock

### Windows
- Fully draggable windows
- Minimize, maximize, and close buttons
- Resizable windows with drag handles
- Z-index management (click to bring to front)

### Applications

#### Projects
- Add, edit, and delete project entries
- Include title, description, technologies, and links
- Tech tags with visual styling

#### Experiences
- Add, edit, and delete work experience entries
- Include company, position, period, and responsibilities
- Timeline-style layout

#### Autobiography
- Add, edit, and delete about sections
- Rich text content with line breaks
- Customizable section titles

## Customization

To personalize the website:

1. **Profile Information**: Update the user name in `WelcomeScreen.tsx` and `Desktop.tsx`
2. **Profile Image**: Replace the avatar URL in the components
3. **Content**: Use the edit buttons in each application to update your information
4. **Icons**: Replace icons in `/public/assets/icons/`
5. **Wallpaper**: Replace `/public/assets/wallpaper.jpg`

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with Windows XP-inspired design

## Credits

Created by Bradley Nguyen

Inspired by Windows XP design © Microsoft Corporation
