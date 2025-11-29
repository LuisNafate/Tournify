# 🎯 CORE Module - Tournify

Módulo central de la aplicación que contiene todos los modelos, servicios, interceptors y guards sincronizados con el backend Ktor/PostgreSQL.

## 📦 Contenido

### Models (`/models`)
- **auth.models.ts**: Modelos de autenticación (LoginRequest, RegisterRequest, AuthResponse, TokenPayload)
- **user.model.ts**: Modelo de usuario y perfiles
- **sport.model.ts**: Modelo de deportes (tradicionales y eSports)
- **tournament.model.ts**: Modelos de torneos, equipos y standings
- **match.model.ts**: Modelos de partidos y eventos
- **legacy.types.ts**: Tipos de compatibilidad para migración gradual

### Services (`/services`)
- **auth.service.ts**: Autenticación, registro, logout, estado del usuario
- **tournament.service.ts**: CRUD de torneos, follow/unfollow, standings
- **sport.service.ts**: Catálogo de deportes
- **match.service.ts**: Gestión de partidos

### Interceptors (`/interceptors`)
- **jwt.interceptor.ts**: Intercepta peticiones HTTP y agrega token JWT automáticamente

### Guards (`/guards`)
- **auth.guard.ts**: Protege rutas que requieren autenticación
- **role.guard.ts**: Protege rutas basándose en roles de usuario

## 🚀 Uso Rápido

```typescript
import { AuthService, TournamentService, SportService } from './core/services';
import { User, Tournament, Sport } from './core/models';
import { AuthGuard, RoleGuard } from './core/guards';

// En tu componente
constructor(
  private authService: AuthService,
  private tournamentService: TournamentService
) {}

// Login
this.authService.login({ email, password }).subscribe(response => {
  console.log('Usuario:', response.user);
});

// Cargar torneos
this.tournamentService.getAll({ status: 'ongoing' }).subscribe(tournaments => {
  console.log('Torneos activos:', tournaments);
});

// Observar usuario actual
this.authService.user$.subscribe(user => {
  if (user) {
    console.log('Usuario autenticado:', user);
  }
});
```

## 📚 Documentación

- **[CORE_DOCUMENTATION.md](../../CORE_DOCUMENTATION.md)**: Documentación completa con ejemplos
- **[MIGRATION_GUIDE.md](../../MIGRATION_GUIDE.md)**: Guía de migración desde código antiguo

## 🔧 Configuración

El módulo requiere que configures las URLs del backend en:
- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  tokenKey: 'token',
  userKey: 'user'
};
```

## ✨ Características

- ✅ Sincronizado 1:1 con backend Ktor/PostgreSQL
- ✅ Autenticación JWT automática con interceptor
- ✅ Tipos TypeScript estrictos
- ✅ Observables reactivos (RxJS)
- ✅ Guards para protección de rutas
- ✅ Barrel exports para imports limpios
- ✅ Mapeo correcto de UUIDs y tipos JSONB
- ✅ Manejo de errores HTTP
- ✅ Estado reactivo del usuario con BehaviorSubject

## 🔐 Seguridad

- Token JWT guardado en localStorage
- Interceptor agrega token automáticamente a todas las peticiones
- Logout automático en respuestas 401
- Verificación de expiración de token
- Guards para proteger rutas sensibles

## 📊 Estructura de Datos

Todos los modelos están mapeados exactamente con el esquema PostgreSQL:
- UUIDs → `string`
- TIMESTAMP → `string` (ISO 8601)
- JSONB → interfaces TypeScript
- Enums → union types

Ver [CORE_DOCUMENTATION.md](../../CORE_DOCUMENTATION.md) para detalles completos de cada modelo.
