# Sistema de Grupos - Implementación Completa

## Resumen

He implementado un **sistema completo de gestión de grupos** para tu aplicación Tournify. Este sistema permite visualizar las tablas de posiciones de grupos en torneos con fase de grupos (tipo `league` o `hybrid`).

## Archivos Creados

### 1. Modelos de Datos
**Archivo:** [src/app/core/models/group.model.ts](src/app/core/models/group.model.ts)

Contiene todas las interfaces necesarias para trabajar con grupos:

- `TournamentGroup`: Representa un grupo del torneo (ej: Grupo A, Grupo B)
- `GroupStanding`: Estadísticas de un equipo en un grupo
- `GroupStandingWithDetails`: Estadísticas con información detallada del equipo
- `GroupWithStandings`: Grupo con su tabla de posiciones
- `TournamentGroupsData`: Datos completos de todos los grupos de un torneo
- `GenerateGroupsRequest`: Para crear grupos automáticamente
- `AssignTeamsToGroupsRequest`: Para asignar equipos a grupos
- `GenerateGroupMatchesRequest`: Para generar partidos de fase de grupos

### 2. Servicio de Grupos
**Archivo:** [src/app/core/services/group.service.ts](src/app/core/services/group.service.ts)

Servicio completo con métodos para:

#### Consultas
- `getGroupsByTournament(tournamentId)`: Obtiene todos los grupos con sus tablas
- `getGroupById(groupId)`: Obtiene un grupo específico
- `getGroupStandings(groupId)`: Obtiene la tabla de un grupo específico

#### Automatización (Casos de Uso del Backend)
- `generateGroups(request)`: Crea la estructura de grupos vacía
- `assignTeamsToGroups(request)`: Distribuye equipos entre grupos
- `generateGroupMatches(request)`: Genera calendario Round Robin
- `automateGroupPhase(...)`: Ejecuta todo el proceso en un solo paso

**Transformaciones**: El servicio transforma automáticamente los datos del backend al formato esperado por el frontend.

### 3. Componente de Visualización
**Archivos:**
- [src/app/modules/tournaments/pages/groups/groups.component.ts](src/app/modules/tournaments/pages/groups/groups.component.ts)
- [src/app/modules/tournaments/pages/groups/groups.component.html](src/app/modules/tournaments/pages/groups/groups.component.html)
- [src/app/modules/tournaments/pages/groups/groups.component.css](src/app/modules/tournaments/pages/groups/groups.component.css)

**Características del componente:**

#### Estados de la UI
- **Loading**: Spinner mientras carga los datos
- **Error**: Mensaje de error con botón de reintentar
- **Empty**: Estado vacío cuando no hay grupos configurados
- **Success**: Muestra las tablas de grupos

#### Diseño de Tablas
Cada grupo se muestra en una tarjeta con:
- **Header**: Nombre del grupo y cantidad de equipos
- **Tabla de posiciones** con columnas:
  - Posición (Pos)
  - Equipo (con logo o iniciales)
  - Partidos Jugados (PJ)
  - Ganados (G)
  - Empatados (E)
  - Perdidos (P)
  - Goles a Favor (GF)
  - Goles en Contra (GC)
  - Diferencia de Goles (DG)
  - Puntos (Pts)

#### Visualización Destacada
- **1er lugar**: Fondo amarillo dorado
- **Clasificados** (primeros 2): Borde verde a la izquierda
- **Diferencia positiva**: Verde
- **Diferencia negativa**: Rojo
- **Hover effects**: Animaciones suaves

#### Responsive
- Grid adaptable: 2 columnas en desktop, 1 en móvil
- Tabla con scroll horizontal en pantallas pequeñas

## Integración en el Sistema

### 4. Rutas Actualizadas
**Archivo:** [src/app/modules/tournaments/tournaments-routing.module.ts](src/app/modules/tournaments/tournaments-routing.module.ts)

Nueva ruta agregada:
```typescript
{ path: ':tournamentId/groups', component: GroupsComponent }
```

**URL de acceso:** `/tournaments/{tournamentId}/groups`

### 5. Módulo Actualizado
**Archivo:** [src/app/modules/tournaments/tournaments.module.ts](src/app/modules/tournaments/tournaments.module.ts)

El componente `GroupsComponent` ha sido declarado en el módulo.

### 6. Botón en Vista de Torneo
**Archivos Modificados:**
- [src/app/modules/tournaments/pages/detail/tournament-view.component.html](src/app/modules/tournaments/pages/detail/tournament-view.component.html)
- [src/app/modules/tournaments/pages/detail/tournament-view.component.ts](src/app/modules/tournaments/pages/detail/tournament-view.component.ts)
- [src/app/modules/tournaments/pages/detail/tournament-view.component.css](src/app/modules/tournaments/pages/detail/tournament-view.component.css)

**Funcionalidad agregada:**
- Botón **"VER GRUPOS"** (verde) junto a "VER PARTIDOS" y "VER BRACKET"
- El botón solo aparece si:
  - El torneo es tipo `hybrid` (grupos + eliminación)
  - El torneo es tipo `league` (todos contra todos)
  - El torneo tiene `groupConfig.numGroups > 0`
- Método `viewGroups()`: Navega a `/tournaments/{id}/groups`
- Método `hasGroups()`: Determina si mostrar el botón

## Flujo de Datos

### Del Backend al Frontend

El backend debe devolver datos en este formato (según tu ejemplo):

```json
[
    {
        "id": "263ea330-c80d-4444-ac0a-c74ae6b9d9a3",
        "groupId": "49e25655-322f-47ba-9866-7dea2cfe4c31",
        "teamId": "2ab3449d-6168-4ec6-8975-0510756e8dbd",
        "played": 1,
        "won": 1,
        "drawn": 0,
        "lost": 0,
        "goalsFor": 3,
        "goalsAgainst": 1,
        "goalDifference": 2,
        "points": 3,
        "position": 1,
        "updatedAt": "2025-12-01T04:31:42.607594Z"
    }
]
```

**Transformación Automática:**
El servicio `GroupService` transforma estos datos al formato `TournamentGroupsData` que espera el componente, incluyendo información de equipos y grupos.

## Endpoints del Backend Esperados

### Requeridos para Visualización
```
GET /tournaments/{tournamentId}/groups
```
Devuelve todos los grupos con sus tablas de posiciones.

**Respuesta esperada:**
```json
{
  "groups": [
    {
      "id": "group-uuid",
      "name": "Grupo A",
      "groupNumber": 1,
      "standings": [
        {
          "id": "standing-uuid",
          "groupId": "group-uuid",
          "teamId": "team-uuid",
          "team": {
            "id": "team-uuid",
            "name": "Equipo 1",
            "logoUrl": "url..."
          },
          "played": 1,
          "won": 1,
          "drawn": 0,
          "lost": 0,
          "goalsFor": 3,
          "goalsAgainst": 1,
          "goalDifference": 2,
          "points": 3,
          "position": 1
        }
      ]
    }
  ],
  "totalGroups": 4
}
```

### Opcionales para Automatización (Ya implementados en el servicio)

```
POST /tournaments/{tournamentId}/groups/generate
Body: { numberOfGroups: 4 }
```
**Caso de uso:** GenerateGroupsUseCase

```
POST /tournaments/{tournamentId}/groups/assign-teams
Body: { randomize: true }
```
**Caso de uso:** AssignTeamsToGroupsUseCase

```
POST /tournaments/{tournamentId}/groups/generate-matches
Body: { startDate: "2025-12-10T10:00:00Z" }
```
**Caso de uso:** GenerateGroupMatchesUseCase

```
POST /tournaments/{tournamentId}/groups/automate
Body: {
  numberOfGroups: 4,
  randomize: true,
  startDate: "2025-12-10T10:00:00Z"
}
```
**Ejecuta los 3 casos de uso en secuencia**

## Casos de Uso del Backend

Según tu descripción, estos son los casos de uso del backend que este sistema soporta:

### 1. GenerateGroupsUseCase (El Arquitecto)
- **Función**: Crea la estructura vacía de grupos
- **Input**: Número de grupos a crear
- **Output**: Registros en tabla `tournament_groups`
- **Frontend**: Método `generateGroups()` del servicio

### 2. AssignTeamsToGroupsUseCase (El Distribuidor)
- **Función**: Distribuye equipos entre grupos
- **Input**: ID del torneo, opción de aleatorizar
- **Output**: Actualiza `team_registrations` con `group_id`
- **Frontend**: Método `assignTeamsToGroups()` del servicio

### 3. GenerateGroupMatchesUseCase (El Organizador de Agenda)
- **Función**: Crea calendario Round Robin
- **Input**: ID del torneo, fecha de inicio opcional
- **Output**: Inserta partidos en tabla `matches`
- **Frontend**: Método `generateGroupMatches()` del servicio

### Sistema Completo de Automatización
**Frontend**: Método `automateGroupPhase()` ejecuta todo en un solo paso

## Cómo Usar el Sistema

### Para Usuarios (Vista)

1. Ir a la página de detalle de un torneo
2. Hacer clic en el botón verde **"VER GRUPOS"**
3. Ver las tablas de posiciones de todos los grupos
4. Los equipos clasificados están resaltados con borde verde
5. El primer lugar tiene fondo amarillo

### Para Organizadores (Automatización)

Puedes crear un componente de administración que use el servicio:

```typescript
// Ejemplo: Automatizar fase de grupos
this.groupService.automateGroupPhase(
  tournamentId,
  4, // 4 grupos
  true, // Aleatorizar equipos
  '2025-12-10T10:00:00Z' // Fecha de inicio
).subscribe({
  next: (result) => {
    console.log('Fase de grupos configurada');
    // Navegar a ver grupos
    this.router.navigate(['/tournaments', tournamentId, 'groups']);
  },
  error: (err) => {
    console.error('Error:', err);
  }
});
```

## Testing

Para probar el sistema:

1. **Verificar que el backend devuelve datos de grupos:**
   ```bash
   curl http://34.235.8.163/tournaments/{tournamentId}/groups
   ```

2. **Compilar el frontend:**
   ```bash
   npm run build
   ```

3. **Navegar a un torneo con grupos:**
   - Ir a `/tournaments/detail/{tournamentId}`
   - Si el torneo tiene grupos, verás el botón "VER GRUPOS"
   - Hacer clic para ver las tablas

## Personalización

### Cambiar colores del diseño
Editar [groups.component.css](src/app/modules/tournaments/pages/groups/groups.component.css):

```css
/* Cambiar color del header de grupo */
.group-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

/* Cambiar color de clasificados */
.qualified {
  border-left: 4px solid #10b981;
}

/* Cambiar color del primer lugar */
.first-place {
  background: #fef3c7;
}
```

### Cambiar criterios de clasificación
Editar el HTML para mostrar más o menos equipos clasificados:

```html
[class.qualified]="standing.position <= 2"  <!-- Cambiar 2 por el número deseado -->
```

## Compatibilidad

✅ Compatible con Angular 15+
✅ Responsive (móvil, tablet, desktop)
✅ Sin dependencias externas adicionales
✅ Usa servicios HTTP de Angular
✅ Manejo de errores incluido
✅ Estados de carga implementados

## Próximos Pasos Sugeridos

1. **Crear componente de administración** para organizadores:
   - Botón "Generar Grupos" en la página del torneo
   - Formulario para configurar número de grupos
   - Asignación manual o automática de equipos

2. **Agregar filtros**:
   - Filtrar por grupo específico
   - Ordenar equipos por diferentes criterios

3. **Agregar partidos del grupo**:
   - Mostrar calendario de partidos por grupo
   - Link desde la tabla a los partidos del equipo

4. **Notificaciones**:
   - Actualización en tiempo real de las tablas
   - WebSocket para cambios automáticos

## Soporte y Documentación

- **Modelos**: Ver [group.model.ts](src/app/core/models/group.model.ts) para tipos completos
- **Servicio**: Ver [group.service.ts](src/app/core/services/group.service.ts) para métodos disponibles
- **Componente**: Ver [groups.component.ts](src/app/modules/tournaments/pages/groups/groups.component.ts) para lógica

---

**Implementado con ❤️ para Tournify**
**Fecha:** 2025-12-01
