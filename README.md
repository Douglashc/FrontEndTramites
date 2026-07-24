# Frontend - Angular

Frontend SPA para interactuar con la API de trámites. Construido con Angular 18, Tailwind CSS 3, standalone components y lazy-loaded routes.

---

## Tecnologías del Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 18.2.x | Framework SPA con standalone components |
| Tailwind CSS | 3.4.x | Framework de utilidades CSS |
| TypeScript | 5.5.x | Tipado estático |
| SCSS | - | Preprocesador de estilos |
| RxJS | 7.8.x | Programación reactiva |
| Angular Router | 18.x | Enrutamiento con lazy loading |

---

## Requisitos Previos (Frontend)

| Requisito | Versión mínima | Verificar |
|-----------|---------------|-----------|
| Node.js | 18.x+ | `node --version` |
| npm | 9.x+ | `npm --version` |
| Angular CLI *(opcional)* | 18.x | `npx ng version` |

> **Nota:** El Backend debe estar corriendo en `http://localhost:5213` antes de usar el frontend.

---

## Estructura del Proyecto

```
FrontEndTramites/
├── src/
│   ├── app/
│   │   ├── core/                          # Lógica core (guards, interceptors, servicios)
│   │   │   ├── guards/auth.guard.ts       # Guard de autenticación
│   │   │   ├── interceptors/              # Interceptor JWT
│   │   │   ├── models/                    # Interfaces TypeScript
│   │   │   └── services/
│   │   │       ├── auth.service.ts         # Servicio de autenticación
│   │   │       └── tramite.service.ts      # Servicio de trámites
│   │   ├── features/                      # Módulos/features lazy-loaded
│   │   │   ├── auth/                      # Login
│   │   │   ├── dashboard/                 # Dashboard con estadísticas
│   │   │   └── tramites/                  # CRUD de trámites
│   │   ├── shared/                        # Componentes compartidos
│   │   ├── app.routes.ts                  # Rutas de la aplicación
│   │   └── app.config.ts                  # Configuración de providers
│   ├── environments/
│   │   ├── environment.ts                 # Dev: apiUrl → http://localhost:5213/api
│   │   └── environment.prod.ts            # Prod: apiUrl → /api
│   ├── styles.scss                        # Estilos globales (Tailwind)
│   └── index.html
├── tailwind.config.js                     # Configuración de Tailwind
├── angular.json                           # Configuración de Angular CLI
├── package.json
└── tsconfig.json
```

---

## Instalación y Ejecución (Frontend)

### Paso 1: Navegar a la carpeta del frontend

```bash
cd FrontEndTramites
```

Si el frontend está en un repositorio separado:
```bash
git clone <url-del-repositorio-frontend>
cd FrontEndTramites
```

### Paso 2: Instalar dependencias

```bash
npm install
```

> **Nota:** Si `npm install` falla con errores de compatibilidad de peer dependencies, usa:
> ```bash
> npm install --legacy-peer-deps
> ```

### Paso 3: Verificar configuración de Tailwind

Tailwind está configurado en `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: [],
}
```

Los estilos base de Tailwind están en `src/styles.scss`:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Paso 4: Verificar conexión con el Backend

Asegúrate de que la URL del API sea correcta en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5213/api',
};
```

Si tu Backend corre en otro puerto, modifica `apiUrl`.

### Paso 5: Ejecutar en modo desarrollo

```bash
ng serve
```

O usando npm:

```bash
npm start
```

El frontend arrancará en: **http://localhost:4200**

> **Importante:** El Backend **debe** estar corriendo en `http://localhost:5213` para que el frontend funcione correctamente. CORS ya está configurado para permitir solicitudes desde `http://localhost:4200`.

### Paso 6: Build de producción (opcional)

```bash
ng build --configuration production
```

Los archivos se generarán en `dist/front-end-tramites/`.

---

## Rutas Disponibles

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/login` | LoginComponent | Formulario de login |
| `/dashboard` | DashboardComponent | Estadísticas generales |
| `/tramites` | TramiteListComponent | Listado con filtros y paginación |
| `/tramites/crear` | TramiteFormComponent | Formulario de creación |
| `/tramites/:id/editar` | TramiteFormComponent | Formulario de edición |
| `/tramites/:id` | TramiteDetailComponent | Detalle del trámite |

> Todas las rutasexcepto `/login` requieren autenticación. El `authGuard` redirige a `/login` si no hay token.

---

## Funcionalidades del Frontend

### Login
- Formulario con usuario y contraseña
- Token JWT almacenado en `localStorage`
- Redirección automática al dashboard tras login

### Dashboard
- Tarjetas de resumen (total trámites, activos, inactivos)
- Barras de progreso por estado, prioridad y tipo de trámite
- Colores diferenciados por estado

### Listado de Trámites
- Tabla paginada con todos los trámites
- Filtros: nombre del ciudadano, tipo, estado, prioridad
- Botones de acción: ver detalle, editar, eliminar
- Indicador visual de estado con colores

### Formulario de Trámite (Crear/Editar)
- Campos: nombre del ciudadano, tipo, descripción, prioridad
- En modo edición: cambio de estado con validación de transiciones
- Campo de observaciones
- Validación de formulario con mensajes de error

### Detalle del Trámite
- Vista completa con todos los campos
- Historial de observaciones
- Botón para volver al listado

---

## Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `Admin@123` | Administrador |
| `operador` | `Operador@123` | Operador |

---

## Solución de Problemas (Frontend)

### `ng serve` no inicia / error de compilación
```bash
# Limpiar cache y reinstalar
rm -rf node_modules .angular
npm install
ng serve
```

### Error de CORS en el navegador
Verifica que el Backend esté corriendo y que CORS esté configurado para `http://localhost:4200` en el `Program.cs` del Backend.

### Error "Cannot find module" o peer dependencies
```bash
npm install --legacy-peer-deps
```

### Tailwind no aplica estilos
Verifica que `tailwind.config.js` tenga la propiedad `content` configurada correctamente y que `src/styles.scss` incluya las directivas `@tailwind`.

### El frontend no conecta con el Backend
1. Verifica que el Backend esté corriendo en `http://localhost:5213`
2. Revisa `src/environments/environment.ts` para confirmar la URL del API
3. Abre las DevTools del navegador (F12) y revisa la pestaña **Network** para ver los errores de las peticiones

### Build de producción muy grande
El budget de Angular está configurado a 500kB warning / 1MB error. Si excedes estos límites, revisa `angular.json` → `architect.build.configurations.production.budgets`.

---

## Flujo Completo de Ejecución

```
1. Abrir terminal 1 → Backend
   cd BackendTramites
   dotnet run --project src/BackendTramites.Api
   ✅ API corriendo en http://localhost:5213

2. Abrir terminal 2 → Frontend
   cd FrontEndTramites
   npm install
   ng serve
   ✅ Frontend corriendo en http://localhost:4200

3. Abrir navegador
   http://localhost:4200
   → Login con admin / Admin@123
   → Dashboard con estadísticas
   → CRUD de trámites completo
```
