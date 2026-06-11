# Beauty Manager Frontend

Frontend application for the **Beauty Manager** platform — a complete management system for beauty salons and aesthetic centers. This project follows a modular architecture based on **Clean Architecture** and **Feature-Sliced Design**, ensuring scalability, maintainability, and clear separation of concerns.

## 🚀 Tech Stack

| Category            | Technology                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| **Framework**       | React 19 + TypeScript 6                                                    |
| **Build Tool**      | Vite 8                                                                     |
| **Routing**         | React Router v7                                                            |
| **State Management**| Zustand 5                                                                  |
| **HTTP Client**     | Axios                                                                      |
| **Styling**         | Tailwind CSS v4 + Radix UI Primitive Components                            |
| **Forms & Validation** | React Hook Form + Zod 4                                                 |
| **UI Components**   | Radix UI (Accordion, Dialog, Dropdown, Tabs, etc.) + shadcn/ui            |
| **Charts**          | Recharts                                                                   |
| **Icons**           | Lucide React                                                               |
| **Toasts**          | Sonner                                                                     |
| **Typography**      | Inter Font (via @fontsource)                                               |
| **Linting**         | ESLint 10 + typescript-eslint + eslint-plugin-react-hooks                  |

## 📦 Installation and Setup

### Prerequisites

- **Node.js** >= 20
- **npm** or **yarn**

### Steps

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:ADSO-C-J/beauty-manager-frontend.git
    cd beautymanager-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**
    Create a `.env` file at the project root.
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

5.  **Build for production:**
    ```bash
    npm run build
    ```

6.  **Preview the production build:**
    ```bash
    npm run preview
    ```

### Available Scripts

| Script            | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start Vite development server               |
| `npm run build`   | Run TypeScript compiler + Vite production build |
| `npm run preview` | Preview the production build locally        |
| `npm run lint`    | Run ESLint across the project               |

## 🏗️ Project Architecture

The project is organized into **functional modules** by business domain rather than by file type (MVC). This approach keeps related code together and prevents cross-cutting concerns.

### Folder Structure

```text
src/
├── app/                 # Global app configuration (Providers, Router)
│   ├── providers/       # Global React providers (Query, Theme, Toast, etc.)
│   ├── router/          # Route definitions, AppRouter, RoleBasedRoute
│   │   ├── AppRouter.tsx
│   │   ├── RoleBasedRoute.tsx
│   │   └── routes.ts
│
├── modules/             # Business domain modules (auth, etc.)
│   └── auth/            # Example: Authentication module
│       ├── application/       # App layer: state management
│       │   └── state/         # Zustand stores
│       ├── domain/            # Domain layer: business logic
│       │   ├── models/        # Entities & value objects
│       │   ├── ports/         # Repository interfaces
│       │   └── use-cases/     # Pure business logic
│       └── infrastructure/    # Infrastructure layer: external implementations
│           ├── dtos/          # Data Transfer Objects
│           ├── mappers/       # DTO ↔ Domain model transformers
│           └── repository/    # Concrete repository implementations (Axios)
│
├── pages/               # Page-level components (views)
│   ├── login/           # Login page + presenter + use case instantiation
│   ├── register/        # Register page + presenter
│   └── dashboard/       # Dashboard pages
│       ├── Dashboard.tsx
│       ├── DashboardLayout.tsx
│       ├── appointments/   # Appointments management
│       ├── clients/        # Client management & detail
│       ├── services/       # Services management
│       ├── facial-analysis/ # Facial analysis
│       ├── reports/        # Reports & statistics
│       └── settings/       # System settings
│
├── shared/              # Shared cross-cutting code
│   └── http/            # HTTP client (Axios instance, interceptors)
│
├── ui/                  # Global reusable UI
│   ├── components/      # shadcn/ui components (button, card, dialog, etc.)
│   ├── errors/          # Error pages (404, etc.)
│   ├── landingPage/     # Landing page
│   └── ...              # Other UI elements
│
├── styles/              # Global styles
│   ├── index.css        # Tailwind imports + base styles
│   ├── tailwind.css     # Tailwind directives
│   └── theme.css        # CSS custom properties (light/dark theme)
│
├── utils/               # Utility functions
├── App.tsx              # Root component (renders RouterProvider)
└── main.tsx             # Entry point
```

### Internal Module Structure (Clean Architecture)

Each module inside `src/modules/*` follows **Clean Architecture** layers:

1.  **`domain/`** — Business core. Has zero external dependencies (no React, no Axios).
    - `models/`: Entities and interfaces (e.g. `User.ts`, `Auth.ts`)
    - `ports/`: Interface contracts for repositories (e.g. `AuthRepository.ts`)
    - `use-cases/`: Pure business logic (e.g. `Login.ts`, `Register.ts`)

2.  **`infrastructure/`** — Technical implementation of domain ports.
    - `repository/`: Concrete implementation using external libraries (e.g. `AuthApiRepository.ts` using Axios)
    - `dtos/`: Pure data structures for API request/response
    - `mappers/`: Functions to transform DTOs into Domain Models

3.  **`application/`** — Orchestration and state.
    - `state/`: Global state management for the module (e.g. Zustand `authStore.ts`)

### Path Aliases

The project uses the following path aliases (configured in both `vite.config.ts` and `tsconfig.app.json`):

| Alias          | Target Path                |
| -------------- | -------------------------- |
| `@app/*`       | `./src/app/*`              |
| `@modules/*`   | `./src/modules/*`          |
| `@pages/*`     | `./src/pages/*`            |
| `@components/*`| `./src/ui/components/*`    |
| `@ui/*`        | `./src/ui/*`               |
| `@shared/*`    | `./src/shared/*`           |
| `@utils/*`     | `./src/utils/*`            |
| `@assets/*`    | `./src/assets/*`           |
| `@styles/*`    | `./src/styles/*`           |

Example usage:
```ts
import { Button } from '@components/button';
import { ROUTES } from '@app/router/routes';
import { axiosClient } from '@shared/http/axiosClient';
```

## 🧭 Routes

All route paths are centralized in `src/app/router/routes.ts`:

| Route                          | Component         | Protected |
| ------------------------------ | ----------------- | --------- |
| `/`                            | LandingPage       | No        |
| `/login`                       | Login             | No        |
| `/register`                    | Register          | No        |
| `/dashboard`                   | Dashboard         | Yes       |
| `/dashboard/appointments`      | Appointments      | Yes       |
| `/dashboard/clients`           | Clients           | Yes       |
| `/dashboard/clients/:id`       | ClientDetail      | Yes       |
| `/dashboard/services`          | Services          | Yes       |
| `/dashboard/facial-analysis`   | FacialAnalysis    | Yes       |
| `/dashboard/reports`           | Reports           | Yes       |
| `/dashboard/settings`          | Settings          | Yes       |

Protected routes are wrapped in `<RoleBasedRoute>`, which checks authentication status and user permissions.

## 👥 Role-Based Access Control

The application defines four user roles with different permission levels:

| Role             | Permission Scope                                                     |
| ---------------- | -------------------------------------------------------------------- |
| **Administrador** | Full access: dashboard, appointments, clients, services, facial analysis, reports, settings |
| **Estilista**     | Dashboard, appointments, clients, services, facial analysis          |
| **Recepcionista** | Dashboard, appointments, clients, services                           |
| **Cliente**       | Dashboard, appointments, facial analysis                             |

Permissions are defined in `src/modules/auth/application/state/authStore.ts` via the `rolePermissions` map. The `hasPermission()` function checks if a given role can access a specific route path.

## 🌐 HTTP Client

The Axios client is configured in `src/shared/http/axiosClient.ts`:

- Base URL is read from `VITE_API_URL` environment variable (default: `http://localhost:3000/api`)
- Automatically attaches the JWT token from `localStorage` to every request via a request interceptor
- Content-Type is set to `application/json`

## 🧩 How to Create a New Module

To create a new module (e.g., `appointments` for managing appointments), follow these steps:

### Step 1: Create the base structure

```text
src/modules/appointments/
├── application/
│   └── state/             # Zustand store if global state is needed
├── domain/
│   ├── models/            # Interfaces: Appointment.ts, AppointmentStatus.ts...
│   ├── ports/             # Interfaces: AppointmentRepository.ts...
│   └── use-cases/         # Classes: CreateAppointment.ts, GetAppointments.ts...
├── infrastructure/
│   ├── dtos/              # CreateAppointmentDTO.ts, AppointmentResponseDTO.ts...
│   ├── mappers/           # Functions to map DTO → Domain Model
│   └── repository/        # AppointmentApiRepository (implements AppointmentRepository)
└── ui/                    # View components go in src/pages/ instead
```

### Step 2: Recommended implementation flow

1. **Domain:** Start by defining the **Model** (`models/Appointment.ts`) and the **Repository Port** (`ports/AppointmentRepository.ts`).
2. **Use Cases:** Write business logic in `use-cases/` using the port interface (e.g., `CreateAppointment` class that receives an `AppointmentRepository`).
3. **Infrastructure:** Implement the actual repository in `infrastructure/repository/` (e.g., `AppointmentApiRepository`) using the shared Axios client. Create **DTOs** and **Mappers** to transform API responses into Domain Models.
4. **Application (optional):** If the module needs to share complex state across multiple views, create a Zustand store in `application/state/`.
5. **UI:** Build view components in `src/pages/` (or within the module's `ui/` folder if preferred). Instantiate the use case by injecting the repository dependency. Use a Custom Hook ("Presenter") to manage local view state (loading, errors) and call the use case.
6. **Routing:** Export the page components and add them to `src/app/router/routes.ts` and `src/app/router/AppRouter.tsx`.

### Step 3: Example dependency injection

```ts
// pages/appointments/useAppointmentsPresenter.ts
import { useState } from 'react';
import { AppointmentApiRepository } from '@modules/appointments/infrastructure/repository/AppointmentApiRepository';
import { GetAppointments } from '@modules/appointments/domain/use-cases/GetAppointments';

const repository = new AppointmentApiRepository();
const getAppointments = new GetAppointments(repository);

export function useAppointmentsPresenter() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments.execute();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  return { appointments, loading, loadAppointments };
}
```

## ⚙️ Environment Variables

| Variable        | Required | Default                     | Description           |
| --------------- | -------- | --------------------------- | --------------------- |
| `VITE_API_URL`  | No       | `http://localhost:3000/api` | Backend API base URL  |

## 🔧 Configuration Files

| File                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `vite.config.ts`     | Vite build configuration + path aliases  |
| `tsconfig.json`      | Root TypeScript configuration            |
| `tsconfig.app.json`  | TypeScript config for the app source     |
| `tsconfig.node.json` | TypeScript config for Node tooling       |
| `eslint.config.js`   | ESLint flat config                       |
| `.gitignore`         | Git ignore rules                         |

## 📄 License

This project is part of the ADSO SENA training program.