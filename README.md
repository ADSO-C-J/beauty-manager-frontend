# Beauty Manager Frontend

Frontend application for the Beauty Manager platform. This project follows a modular structure based on **Clean Architecture** and **Feature-Sliced Design** principles, ensuring scalability, maintainability, and clear separation of concerns.

## 🚀 Tecnologías

*   **React** + **TypeScript**
*   **Vite** (Build tool)
*   **Zustand** (State management)
*   **React Router v6** (Routing)
*   **Axios** (HTTP Client)
*   **Tailwind CSS** (Styling)

## 📦 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <repository-url>
    cd beautymanager-frontend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en las necesidades de la API.
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 🏗️ Arquitectura y Estructura de Carpetas

El proyecto está organizado en módulos funcionales, dividiendo el código por dominio de negocio (features) en lugar de por tipo de archivo tradicional (MVC).

```text
src/
├── app/               # Configuración global de la app (Providers, Router general, Guards)
├── modules/           # Módulos de la aplicación por dominio de negocio (ej. auth, users)
├── shared/            # Código compartido transversal (HTTP client, utilidades, tipos globales)
├── ui/                # Componentes UI globales y reutilizables (Páginas de error, layouts base)
├── App.tsx            # Componente raíz
└── main.tsx           # Punto de entrada de React
```

### 🧩 Estructura Interna de un Módulo (`src/modules/*`)

Cada módulo sigue los principios de Clean Architecture, dividido en capas para aislar la lógica de negocio de la infraestructura y la UI:

1.  **`domain/` (Dominio):** El núcleo del negocio. No depende de nada externo (ni React, ni Axios).
    *   `models/`: Entidades e interfaces principales (ej. `User.ts`, `Auth.ts`).
    *   `ports/`: Interfaces que definen los contratos para los repositorios (ej. `AuthRepository.ts`).
    *   `use-cases/`: La lógica de negocio pura (ej. `Login.ts`, `Register.ts`).
2.  **`infrastructure/` (Infraestructura):** Implementación técnica de los puertos del dominio.
    *   `repository/`: Implementación real usando librerías externas (ej. `AuthApiRepository.ts` usando Axios).
    *   `dtos/`: Estructuras de datos puras para peticiones/respuestas de la API.
    *   `mappers/`: Funciones para transformar DTOs de la API a Modelos de Dominio.
3.  **`application/` (Aplicación):** Orquestación y estado.
    *   `state/`: Manejo de estado global del módulo (ej. Zustand `authStore.ts`).
4.  **`ui/` (Presentación):** Componentes visuales y páginas específicas del módulo.
    *   `{feature}/`: Carpetas por vista/funcionalidad (ej. `login/`, `register/`).
        *   Dentro contienen sus propios hooks controladores (Presenters) y los archivos de componentes (ej. `LoginForm.tsx`, `loginUseCase.ts`).

## 🛠️ Cómo Crear un Nuevo Módulo

Si necesitas crear un nuevo módulo (por ejemplo, `appointments` para gestionar citas), sigue estos pasos y utiliza esta estructura como referencia.

### Paso 1: Crear la estructura base

Crea la carpeta del nuevo módulo dentro de `src/modules/` y sus subcarpetas:

```text
src/modules/appointments/
├── application/
│   └── state/             # Zustand store si necesita estado global
├── domain/
│   ├── models/            # Interfaces: Appointment.ts, AppointmentStatus.ts...
│   ├── ports/             # Interfaces: AppointmentRepository.ts...
│   └── use-cases/         # Clases: CreateAppointment.ts, GetAppointments.ts...
├── infrastructure/
│   ├── dtos/              # CreateAppointmentDTO.ts, AppointmentResponseDTO.ts...
│   ├── mappers/           # Funciones para mapear DTO -> Modelo de Dominio
│   └── repository/        # AppointmentApiRepository.ts que implementa AppointmentRepository
└── ui/
    ├── list/              # Funcionalidad o Vista: Lista de citas
    │   ├── AppointmentsList.tsx
    │   └── useAppointmentsPresenter.ts
    └── create/            # Funcionalidad o Vista: Crear citas
        ├── CreateAppointment.tsx
        ├── createAppointmentUseCase.ts  # Instanciación del caso de uso
        └── useCreateAppointmentPresenter.ts
```

### Paso 2: Flujo de implementación recomendado

1.  **Dominio:** Empieza definiendo el **Modelo** (`models/Appointment.ts`) y el **Puerto/Contrato** (`ports/AppointmentRepository.ts`).
2.  **Casos de Uso:** Escribe la lógica de negocio en `use-cases/` apoyándote en el puerto definido. (Ej. Una clase `CreateAppointment` que recibe un `AppointmentRepository`).
3.  **Infraestructura:** Implementa el repositorio real en `infrastructure/repository/` (Ej. `AppointmentApiRepository`) usando `axiosClient` de `src/shared/http/`. Crea los **DTOs** y **Mappers** necesarios para transformar lo que responde la API en lo que espera el Modelo de Dominio.
4.  **Aplicación (Opcional):** Si el módulo requiere compartir estado complejo entre varias vistas, crea un store de Zustand en `application/state/`.
5.  **UI:** Construye las interfaces en `ui/`. Crea un archivo para instanciar el caso de uso inyectando la infraestructura (ej. `const repository = new AppointmentApiRepository(); export const createAppointmentUseCase = new CreateAppointment(repository);`). Usa un Custom Hook ("Presenter") para manejar el estado local de la vista (cargando, errores) llamando a este caso de uso.
6.  **Enrutamiento:** Finalmente, exporta las páginas/componentes principales de UI y agrégalas a las rutas globales en `src/app/router/routes.ts` y `src/app/router/AppRouter.tsx`.
