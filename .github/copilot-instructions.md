# CineHub Cinema Booking - AI Coding Agent Instructions

## Project Overview
CineHub is a cinema booking application with a **React + Vite frontend** and a **separate backend** (Admin/User directories). The frontend uses React Router v7 for routing, Tailwind CSS for styling, and follows a component-based architecture with context providers.

## Architecture

### Frontend Structure (`Frontend/`)
- **Entry Point**: `Main.jsx` → `App.jsx` → `PublicRouter.jsx`
- **Layout System**: `MainLayout` (Header + Outlet + Footer) wraps all pages
- **Context Providers**: Wrap in order: `AuthProvider` → `ToastProvider` → `RouterProvider`
- **Routing**: Uses `createBrowserRouter` from react-router-dom v7 (not the older `BrowserRouter` pattern)

### Key Directories
- `components/`: Reusable UI components (`Banner`, `MovieCard`, `layout/`, `ui/`)
- `pages/`: Route-level pages (`HomePage`, `LoginPage`, `Admin/`, `User/`, `Staff/`, `Manage/`)
- `contexts/`: React Context providers (currently `AuthContext` is a placeholder)
- `routers/`: `PublicRouter.jsx` defines the main route structure; `PrivateRouter.jsx` is empty
- `services/Model/`: Service layer for API communication (currently empty - needs implementation)
- `validation/`: Form validation logic (placeholder)

### Backend Structure (`Backend/`)
- **Admin/**: Admin-specific backend logic
- **User/**: User-specific backend logic
- Minimal structure - likely needs expansion

## Development Workflow

### Running the Project
```bash
cd Frontend
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

### Tech Stack
- **React 18.2** with modern hooks (`useState`, `useEffect`, `useRef`)
- **React Router DOM 7.12** (use `createBrowserRouter`, not legacy patterns)
- **Vite 5.0** as build tool
- **Tailwind CSS 3.4.7** for styling
- **PostCSS + Autoprefixer** for CSS processing

## Coding Conventions

### File Naming & Imports
- **Components**: PascalCase (e.g., `MainLayout.jsx`, `MovieCard.jsx`)
- **Utilities/Services**: camelCase (e.g., `LoginController.js`)
- **Import Paths**: Use relative imports (`./`, `../`) - no absolute path aliases configured

### React Patterns
- **Functional Components**: Export default function components
- **Hooks**: Standard React hooks; custom hooks go in `hooks/` (currently placeholder)
- **Styling**: Inline Tailwind classes (e.g., `className="flex flex-col min-h-screen bg-[#020617]"`)
- **Layout Colors**: Base dark background is `bg-[#020617]` (deep slate)

### Router Pattern (React Router v7)
```jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);

export default routes;
```

### Context Provider Pattern
```jsx
// App.jsx structure
<AuthProvider>
  <ToastProvider>
    <RouterProvider router={routes} />
  </ToastProvider>
</AuthProvider>
```

### Tailwind Configuration
- **Content Paths**: Scans `Frontend/src/**/*.{js,jsx,ts,tsx}` AND `Backend/**/*.{js,jsx,ts,tsx,html,php}`
- This suggests potential backend rendering or shared components - verify before removing backend scanning

## UI/UX Patterns

### Visual Effects
- **Starfield Background**: `Starfield.jsx` uses canvas animation with 3D star field effect (fixed position, -z-10)
- **Consistent Dark Theme**: Primary background `#020617`, white text, opacity overlays for depth

### Movie Display
- Movies have properties: `title`, `genre`, `rating`, `image`, `type` (now/soon/special), `badge` (3D/2D/IMAX), `age` (P/C13/C18)
- Filtered by active tab state in `HomePage` component

## Areas Needing Implementation

### Critical Gaps
1. **AuthContext**: Currently a passthrough - needs auth state management (user, login, logout, token)
2. **PrivateRouter**: Empty file - should implement protected routes for authenticated users
3. **LoginController/Services**: Service layer is empty - needs API integration logic
4. **Validation**: Placeholder only - needs form validation implementation

### Role-Based Pages
- `pages/Admin/`, `pages/Staff/`, `pages/Manage/`, `pages/User/` directories exist but need full implementation
- Likely need integration with PrivateRouter for access control

## Best Practices for This Codebase

1. **Keep MainLayout Consistent**: All new routes should go under MainLayout unless it's a standalone page (like admin dashboard)
2. **Follow Tailwind-First Styling**: Avoid external CSS modules; use Tailwind utilities and extend theme if needed
3. **Respect Context Hierarchy**: New contexts should wrap in App.jsx in logical order
4. **Service Layer Pattern**: API calls should go through `services/Model/` controllers, not directly in components
5. **Component Composition**: Break down large pages into smaller components in `components/` directory

## Questions for Clarification

- What backend technology is used (Node.js, PHP, Java)?
- Is there a shared API specification or OpenAPI/Swagger docs?
- Should PrivateRouter use role-based routing (Admin/Staff/User)?
- Authentication strategy (JWT, sessions, OAuth)?
