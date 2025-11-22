# Study Buddy AI - Theme Guide

## Color Palette

Based on your app design, the following colors are used:

### Primary Colors
- **Primary Blue**: `#2B7FE6` - Used for primary buttons and CTAs
- **Teal**: `#6DBAAE` - Course card backgrounds
- **Sage Green**: `#A8C5B0` - Course card backgrounds
- **Orange/Brown**: `#D4A574` - Course card backgrounds

### Neutral Colors
- **Background**: `#fafafa` - Main app background
- **White**: `#ffffff` - Card backgrounds
- **Gray Scale**:
  - Gray 50: `#fafafa`
  - Gray 100: `#f5f5f5`
  - Gray 200: `#e5e5e5`
  - Gray 300: `#d4d4d4`
  - Gray 600: `#737373`
  - Gray 900: `#1a1a1a` - Text color

## Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.)
- **Headings**: Bold weight
  - H1: 2xl (24px)
  - H2: 3xl (30px) for greetings
  - H3: xl (20px) for section titles
  - H4: lg (18px)
- **Body**: Regular weight, 16px base

## Components

### Buttons

#### Primary Button (`.btn-primary`)
- Background: `#2B7FE6`
- Text: White
- Padding: `0.875rem 1.5rem`
- Border Radius: `0.75rem`
- Font Weight: 500

#### Secondary Button (`.btn-secondary`)
- Background: `#f5f5f5`
- Text: `#1a1a1a`
- Padding: `0.875rem 1.5rem`
- Border Radius: `0.75rem`
- Font Weight: 500

#### Outline Button (`.btn-outline`)
- Background: Transparent
- Border: `1.5px solid #e5e5e5`
- Text: `#1a1a1a`
- Padding: `0.875rem 1.5rem`
- Border Radius: `0.75rem`

### Cards (`.card`)
- Background: White
- Border Radius: `1rem`
- Padding: `1rem`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.05)`
- Border: `1px solid #f5f5f5`

### Inputs (`.input`)
- Background: White
- Border: `1.5px solid #e5e5e5`
- Border Radius: `0.75rem`
- Padding: `0.875rem 1rem`
- Focus: Blue border with subtle shadow

## Layout

### Mobile Container (`.mobile-container`)
- Max Width: `480px`
- Centered with `margin: 0 auto`
- Padding: `1.5rem 1rem`

### Bottom Navigation
- Fixed at bottom
- White background
- 3 main tabs: Home, Courses, Settings
- Active state: Blue color
- Height: Approximately 60px with padding

## Design Principles

1. **Mobile-First**: All screens optimized for mobile (max 480px width)
2. **Clean & Minimal**: Generous white space, simple layouts
3. **Soft Shadows**: Subtle shadows for depth
4. **Rounded Corners**: Consistent `0.75rem` to `1rem` border radius
5. **Muted Colors**: Soft, pastel-like colors for course cards
6. **Clear Hierarchy**: Bold headings, clear section divisions

## Page-Specific Notes

### Home Page
- Greeting with emoji
- Next session card with colored background
- Two action buttons (Start Session, Chat)
- Upcoming tasks list with icons

### Courses/Study Plans Page
- Back button in header
- Study plan cards with:
  - Title and subtitle on left
  - Colored card preview on right (teal, sage, orange)
  - "View Details" button
- "Add New Course" button at bottom

### Settings Page
- Profile section at top
- Grouped settings sections
- Toggle switches for preferences
- Clean list layout

## Usage

All custom classes are defined in `src/index.css`:
- `.mobile-container`
- `.btn-primary`
- `.btn-secondary`
- `.btn-outline`
- `.card`
- `.input`

Tailwind utility classes are used for spacing, layout, and responsive design.
