# Tournify

Plataforma para gestión de torneos deportivos y de eSports.

## Descripción

Tournify es una aplicación web construida con Angular que permite a los usuarios:
- Registrarse como jugadores, organizadores o árbitros
- Crear y gestionar torneos
- Unirse a torneos existentes
- Ver clasificaciones y resultados

## Tecnologías

- **Framework**: Angular 17
- **Estilos**: Tailwind CSS
- **Lenguaje**: TypeScript

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/               # Modelos y guards
│   ├── shared/             # Componentes compartidos (navbar, footer)
│   ├── modules/
│   │   ├── home/          # Landing page y dashboard
│   │   ├── auth/          # Login y registro
│   │   └── tournaments/   # Gestión de torneos
│   ├── app-routing.module.ts
│   └── app.module.ts
├── assets/                 # Recursos estáticos
└── styles/                 # Estilos globales
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## Comandos disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye el proyecto para producción
- `npm run watch` - Construye en modo desarrollo con watch

## Estado Actual

Este proyecto contiene la estructura base completa sin lógica funcional:
- ✅ Arquitectura modular configurada
- ✅ Sistema de rutas con lazy loading
- ✅ Componentes creados (sin funcionalidad)
- ✅ Modelos de datos definidos
- ⏳ Servicios pendientes
- ⏳ Conexión a base de datos pendiente
- ⏳ Lógica de negocio pendiente

## Próximos Pasos

1. Implementar servicios de autenticación
2. Conectar con backend/base de datos
3. Agregar lógica de gestión de torneos
4. Aplicar diseño visual definitivo
5. Implementar sistema de clasificación

---

**Tournify** © 2025
