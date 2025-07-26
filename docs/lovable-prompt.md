# Task Master UI - Interface Development Prompt

## Project Overview
Create a React web application that serves as a visual interface for Task Master projects. This is a **UI-only implementation** focused on design, layout, and visual presentation - no business logic, file system access, or data validation should be implemented.

## Technical Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Build Tool**: Vite
- **UI Library**: Shadcn UI for consistent component design

## Design Requirements

### Theme & Visual Style
- **Dark mode only** - no light theme needed
- **Color Palette**:
  - Background: Shades of gray (#1a1a1a, #2a2a2a, #3a3a3a)
  - Text: Light gray (#e5e5e5, #f5f5f5)
  - Accents: Yellow tones (#fbbf24, #f59e0b, #d97706)
  - Status colors: Green (done), Blue (in-progress), Yellow (pending), Red (blocked)
- **Typography**: Clean, modern fonts with good hierarchy
- **Layout**: Responsive design that works on desktop, tablet, and mobile

### Component Structure Needed

#### 1. Project Loader Screen
- Large, prominent "Select Project" button (non-functional for this UI demo)
- Clean, minimal layout with Task Master branding
- Loading states and validation feedback areas (visual only)
- Error message display area

#### 2. Main Task Viewer Interface
- **Header**: Project information, navigation breadcrumbs
- **Main Content**: Grid/list layout for displaying tasks
- **Sidebar** (optional): Context information panel

#### 3. Task Cards
- **Individual task display** with the following information:
  - Task ID and title (prominent)
  - Description text
  - Status indicator with color coding
  - Priority badge (high/medium/low)
  - Dependencies list
  - Details section (collapsible or expandable)
  - Test strategy section
- **Subtask display**: Nested cards or indented list items for subtasks
- **Visual hierarchy**: Clear parent-child relationships

## Sample Data Structure (for UI demonstration)

Use this mock data to populate the interface:

```json
{
  "master": {
    "tasks": [
      {
        "id": 1,
        "title": "Set up project infrastructure",
        "description": "Initialize the Laravel project with Inertia.js and React, configure database connections, and set up the development environment using Herd.",
        "status": "done",
        "dependencies": [],
        "priority": "high",
        "details": "Create a new Laravel project using the official starter kit with Inertia.js and React. Configure PostgreSQL database connection in the .env file. Set up Herd for local development. Install required dependencies: Tailwind CSS, Shadcn UI, and other necessary packages.",
        "testStrategy": "Verify that the application boots correctly. Check that database connections are working. Ensure that React components render properly through Inertia.js.",
        "subtasks": [
          {
            "id": 1,
            "title": "Create base ApplicationException class",
            "description": "Implement a base ApplicationException class that extends Laravel's Exception class to serve as the foundation for all custom exceptions.",
            "dependencies": [],
            "details": "Create a new directory App\\Exceptions\\Custom to house all custom exceptions. Implement proper PHPDoc documentation.",
            "status": "done",
            "parentTaskId": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Implement custom exception handling system",
        "description": "Create a robust exception handling system with custom exception classes and centralized error handling.",
        "status": "in-progress",
        "dependencies": [1],
        "priority": "medium",
        "details": "Create a base ApplicationException class extending Laravel's Exception. Implement specific exception classes and configure the Laravel exception handler.",
        "testStrategy": "Write unit tests for each custom exception class. Create feature tests that trigger exceptions and verify the correct response format."
      },
      {
        "id": 3,
        "title": "Database schema design",
        "description": "Design and implement the database schema for the application.",
        "status": "pending",
        "dependencies": [1],
        "priority": "low",
        "details": "Create migrations for users, courses, subscriptions, and payment tables. Ensure proper relationships and constraints.",
        "testStrategy": "Test migrations can run successfully. Verify foreign key constraints work correctly."
      }
    ]
  }
}
```

## UI Components to Implement

### 1. App Layout
```tsx
// Main application shell with:
- Header with project name and navigation
- Main content area
- Responsive sidebar (collapsible on mobile)
```

### 2. ProjectLoader Component
```tsx
// Landing screen component with:
- Centered layout
- Large "Select Project" button (visual only)
- Status feedback areas
- Clean, minimal design
```

### 3. TaskGrid Component
```tsx
// Main task display component with:
- Responsive grid/list layout
- Task cards arranged hierarchically
- Filter/sort controls (visual only)
```

### 4. TaskCard Component
```tsx
// Individual task display with:
- Header: ID, title, status badge, priority badge
- Body: description, details (expandable)
- Footer: dependencies, test strategy
- Hover effects and micro-animations
```

### 5. SubtaskCard Component
```tsx
// Nested subtask display with:
- Simplified version of TaskCard
- Visual indication of nesting
- Parent task relationship indicator
```

## Status and Priority Indicators

### Status Colors & Icons
- **done**: Green background, checkmark icon
- **in-progress**: Blue background, clock/spinner icon
- **pending**: Yellow background, clock icon
- **blocked**: Red background, warning icon

### Priority Badges
- **high**: Red/orange badge with "HIGH" text
- **medium**: Yellow badge with "MEDIUM" text
- **low**: Gray badge with "LOW" text

## Layout Specifications

### Desktop (1024px+)
- 3-4 column grid for task cards
- Full sidebar visible
- Expanded task details visible

### Tablet (768px - 1023px)
- 2-3 column grid
- Collapsible sidebar
- Condensed task cards

### Mobile (320px - 767px)
- Single column list
- Hidden sidebar (hamburger menu)
- Stackable task information

## Interactive Elements (Visual Only)

Since this is UI-only, these elements should be visually present but non-functional:

- **Buttons**: Styled with hover states, but no click handlers
- **Expandable sections**: Show both collapsed and expanded states
- **Navigation**: Breadcrumbs and menu items styled appropriately
- **Search/Filter**: Input fields and dropdown menus (visual only)
- **Dependencies**: Show dependency relationships visually with lines or arrows

## Animation & Micro-interactions

- **Card hover effects**: Subtle elevation and shadow changes
- **Status transitions**: Smooth color changes
- **Expand/collapse**: Smooth height transitions for details sections
- **Loading states**: Skeleton screens and shimmer effects

## Accessibility Requirements

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader compatibility

## What NOT to Implement

- File system access or file reading functionality
- Data validation or Zod schemas
- Business logic or data processing
- API calls or external data fetching
- Local storage or state persistence
- Actual project loading functionality

## Deliverables Expected

1. **Complete React application** with all UI components
2. **Responsive design** that works across all device sizes
3. **Dark theme implementation** with yellow accents
4. **Component library** using Shadcn UI
5. **Mock data integration** showing realistic task information
6. **Clean, professional interface** ready for demo purposes

## Success Criteria

- ✅ Visually appealing dark theme interface
- ✅ All task information displayed clearly and hierarchically
- ✅ Responsive design works on all screen sizes
- ✅ Status and priority indicators are clearly visible
- ✅ Subtasks are properly nested and visually distinct
- ✅ Professional, polished appearance suitable for presentation
- ✅ Smooth interactions and micro-animations
- ✅ Accessibility standards met

Focus on creating a beautiful, functional-looking interface that demonstrates how the Task Master data would be presented to users, without implementing any of the underlying data processing or file system functionality.