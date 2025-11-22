# Study Buddy AI 🎓

An AI-powered study companion application built with React, TypeScript, and TailwindCSS. Study Buddy AI helps students learn smarter, track their progress, and achieve their academic goals with a beautiful mobile-first interface.

## ✨ Features

- **Onboarding Flow**: Smooth 3-step introduction to the app
- **Authentication**: Secure login/signup with social auth options
- **Personalized Setup**: Customize your learning experience based on education level, goals, and time commitment
- **Dashboard**: Track study streaks, hours, courses, and achievements
- **Course Management**: Browse, enroll, and track progress across multiple courses
- **Settings**: Manage profile, preferences, and app settings
- **Mobile-First Design**: Optimized for mobile devices with a clean, modern UI

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **Lucide React** - Beautiful icon library
- **pnpm** - Fast, disk space efficient package manager

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📱 Pages

- `/onboarding` - Welcome and feature introduction
- `/auth` - Login and signup
- `/info` - User preferences setup
- `/home` - Main dashboard
- `/courses` - Course catalog and management
- `/settings` - User settings and preferences

## 📖 Documentation

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed information about the project architecture, components, and design system.

## 🎨 Design System

The app follows a mobile-first approach with:
- Maximum width of 480px for all screens
- Consistent color palette (Primary: Blue, Secondary: Purple)
- Custom utility classes for buttons, cards, and inputs
- Bottom navigation for main app sections
- Smooth transitions and animations

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
