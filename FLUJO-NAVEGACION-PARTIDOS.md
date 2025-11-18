# Flujo de Navegación - Sistema de Partidos

## 📍 Puntos de Entrada

### 1. Desde Dashboard / Lista de Torneos
```
Dashboard → Lista de Torneos (/tournaments/list)
```

### 2. Detalle de Torneo
```
Lista de Torneos → Detalle de Torneo (/tournaments/detail/:id)
```

---

## 🔄 Flujo Principal de Navegación

### RUTA 1: Ver Partidos desde Torneo
```
1. Dashboard
   ↓
2. Lista de Torneos (/tournaments/list)
   ↓ [Click en card de torneo]
3. Detalle del Torneo (/tournaments/detail/:id)
   ↓ [Click en botón "VER PARTIDOS"]
4. Lista de Partidos (/tournaments/:tournamentId/matches)
   ↓ [Click en card de partido]
5. Detalle del Partido (/tournaments/matches/:id)
   ↓ [Click en "Actualizar Resultado"] (solo organizador/árbitro)
6. Actualizar Resultado (/tournaments/matches/:id/update)
```

### RUTA 2: Actualización Rápida de Resultados
```
1. Lista de Partidos (/tournaments/:tournamentId/matches)
   ↓ [Click directo en "Actualizar Resultado"]
2. Actualizar Resultado (/tournaments/matches/:id/update)
   ↓ [Guardar cambios]
3. Detalle del Partido (/tournaments/matches/:id)
```

---

## 👤 Permisos y Acceso

### Usuarios Generales (Todos)
- ✅ Ver lista de partidos
- ✅ Ver detalle de partidos
- ❌ Actualizar resultados

### Organizador del Torneo
- ✅ Ver lista de partidos
- ✅ Ver detalle de partidos
- ✅ Actualizar resultados de cualquier partido del torneo

### Árbitro Asignado
- ✅ Ver lista de partidos
- ✅ Ver detalle de partidos
- ✅ Actualizar resultados SOLO de partidos asignados a él

### Administrador
- ✅ Ver lista de partidos
- ✅ Ver detalle de partidos
- ✅ Actualizar resultados de TODOS los partidos

---

## 📡 Endpoints del Backend Utilizados

### Match Endpoints (TOURNIFY-API)
```kotlin
GET    /matches/{id}              // Obtener partido por ID
PUT    /matches/{id}/result       // Actualizar resultado del partido
POST   /matches/{id}/start        // Iniciar partido (cambiar a "live")
POST   /matches/{id}/finish       // Finalizar partido (cambiar a "finished")
DELETE /matches/{id}              // Eliminar partido
```

### Tournament Endpoints
```kotlin
GET    /tournaments/{id}/matches  // Obtener todos los partidos de un torneo
```

---

## 🔍 Validaciones y Verificaciones

### Validaciones Frontend
1. **Lista de Partidos**
   - ✅ Verificar que tournamentId sea válido
   - ✅ Mostrar botón "Actualizar Resultado" solo si usuario tiene permisos
   - ✅ Filtrar por estado (scheduled, live, finished, postponed, cancelled)
   - ✅ Filtrar por ronda

2. **Detalle de Partido**
   - ✅ Verificar que matchId sea válido
   - ✅ Mostrar información completa del partido
   - ✅ Mostrar badge de ganador si el partido está finalizado
   - ✅ Botón "Actualizar Resultado" solo si usuario es organizador/árbitro/admin

3. **Actualizar Resultado**
   - ✅ Verificar permisos antes de cargar formulario (AuthGuard)
   - ✅ Validar que score1 y score2 sean números >= 0
   - ✅ Calcular ganador automáticamente si status = 'finished'
   - ✅ Mostrar botones "Iniciar Partido" y "Finalizar Partido" según el estado

### Validaciones Backend (Requeridas)
```kotlin
// MatchRoutes.kt debería tener:
- Verificar que el usuario sea organizador, árbitro asignado o admin
- Verificar que el partido existe
- Verificar que el torneo existe
- No permitir actualizar partidos "cancelled"
```

---

## 🎨 Componentes Creados

### 1. MatchesListComponent
**Archivo:** `tournaments/pages/matches/matches-list.component.ts`
**Ruta:** `/tournaments/:tournamentId/matches`
**Funcionalidad:**
- Listar todos los partidos de un torneo
- Filtrar por estado (scheduled, live, finished, postponed, cancelled)
- Filtrar por ronda
- Mostrar tarjetas con información de equipos, fecha, ubicación
- Botón "Actualizar Resultado" (condicional por permisos)
- Navegación a detalle de partido

### 2. MatchDetailComponent
**Archivo:** `tournaments/pages/matches/match-detail.component.ts`
**Ruta:** `/tournaments/matches/:id`
**Funcionalidad:**
- Mostrar información completa del partido
- Mostrar equipos con logos
- Mostrar marcador (si el partido está en vivo o finalizado)
- Mostrar ganador (si el partido está finalizado)
- Información de fecha programada, inicio real, finalización
- Información del árbitro
- Notas del partido
- Botón "Actualizar Resultado" (condicional por permisos)
- Botón "Volver al Torneo"

### 3. MatchUpdateResultComponent
**Archivo:** `tournaments/pages/matches/match-update-result.component.ts`
**Ruta:** `/tournaments/matches/:id/update`
**Funcionalidad:**
- Formulario reactivo para actualizar resultados
- Inputs numéricos para score1 y score2
- Select para cambiar estado del partido
- Textarea para notas/observaciones
- Botones rápidos: "Iniciar Partido", "Finalizar Partido"
- Preview del ganador (si score1 ≠ score2 y status = 'finished')
- Validaciones en tiempo real
- Cálculo automático del ganador

---

## 🔧 Configuración de Rutas

### tournaments-routing.module.ts
```typescript
const routes: Routes = [
  // ... rutas existentes
  
  // Rutas de partidos
  { 
    path: ':tournamentId/matches', 
    component: MatchesListComponent 
  },
  { 
    path: 'matches/:id', 
    component: MatchDetailComponent 
  },
  {
    path: 'matches/:id/update',
    component: MatchUpdateResultComponent,
    canActivate: [AuthGuard]  // Protegida por autenticación
  }
];
```

---

## ✅ Factibilidad del Flujo

### ✅ Flujos Congruentes
1. **Navegación Lineal:** Dashboard → Torneos → Detalle → Partidos → Detalle Partido → Actualizar
2. **Navegación de Retorno:** Todos los componentes tienen botones "Volver" que respetan la jerarquía
3. **Permisos Consistentes:** AuthGuard protege rutas de actualización, checks adicionales en componentes

### ✅ Endpoints del Backend Confirmados
- ✅ `GET /matches/{id}` - Existe en MatchRoutes.kt
- ✅ `PUT /matches/{id}/result` - Existe en MatchRoutes.kt
- ✅ `DELETE /matches/{id}` - Existe en MatchRoutes.kt
- ⚠️ `GET /tournaments/{id}/matches` - **NECESITA VERIFICACIÓN**

### ⚠️ Endpoint a Verificar en Backend

**Endpoint:** `GET /tournaments/{id}/matches`

**Esperado en:** `TournamentRoutes.kt`

**Código esperado:**
```kotlin
get("/{id}/matches") {
    val tournamentId = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")
    val matches = GetTournamentMatchesUseCase().execute(tournamentId)
    call.respond(HttpStatusCode.OK, matches)
}
```

**Si NO existe**, crear:
```kotlin
// En GetTournamentMatchesUseCase.kt
class GetTournamentMatchesUseCase {
    fun execute(tournamentId: String): List<MatchWithDetails> {
        return MatchRepository.getByTournament(tournamentId)
    }
}
```

---

## 🧪 Casos de Prueba

### Caso 1: Usuario sin permisos
```
DADO un usuario regular autenticado
CUANDO accede a /tournaments/:tournamentId/matches
ENTONCES ve la lista de partidos PERO NO ve el botón "Actualizar Resultado"
Y CUANDO intenta acceder directamente a /tournaments/matches/:id/update
ENTONCES es redirigido por AuthGuard (si no está autenticado) O ve un error 403
```

### Caso 2: Organizador del torneo
```
DADO un usuario con rol "organizer" que creó el torneo
CUANDO accede a /tournaments/:tournamentId/matches
ENTONCES ve la lista de partidos Y ve el botón "Actualizar Resultado" en cada partido
Y CUANDO hace click en "Actualizar Resultado"
ENTONCES accede al formulario de actualización sin problemas
Y CUANDO guarda cambios válidos
ENTONCES el partido se actualiza y es redirigido a /tournaments/matches/:id
```

### Caso 3: Árbitro asignado
```
DADO un usuario con rol "referee" asignado a un partido específico
CUANDO accede a /tournaments/:tournamentId/matches
ENTONCES ve la lista de partidos Y ve el botón "Actualizar Resultado" SOLO en sus partidos asignados
Y CUANDO intenta actualizar un partido NO asignado a él
ENTONCES el backend devuelve 403 Forbidden
```

### Caso 4: Administrador
```
DADO un usuario con rol "admin"
CUANDO accede a cualquier ruta de partidos
ENTONCES tiene acceso completo a todas las funcionalidades
Y puede actualizar CUALQUIER partido de CUALQUIER torneo
```

---

## 📊 Resumen de Factibilidad

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Rutas Frontend** | ✅ Implementado | Todas las rutas configuradas en tournaments-routing.module.ts |
| **Componentes** | ✅ Implementado | 3 componentes completos (list, detail, update) |
| **Permisos** | ✅ Implementado | AuthGuard + checks en componentes |
| **Servicios** | ✅ Implementado | MatchService con todos los métodos necesarios |
| **Endpoints Backend** | ⚠️ Verificar | Falta confirmar GET /tournaments/{id}/matches |
| **Validaciones** | ✅ Implementado | Validaciones en formularios y lógica de negocio |
| **UX/UI** | ✅ Implementado | Diseño responsive, animaciones, estados de carga |

---

## 🚀 Próximos Pasos

1. **Verificar Endpoint Backend**
   - Revisar `TournamentRoutes.kt` para confirmar `GET /tournaments/{id}/matches`
   - Si no existe, implementarlo según el código de ejemplo arriba

2. **Probar Flujo Completo**
   - Iniciar backend API (TOURNIFY-API)
   - Iniciar frontend Angular (`ng serve`)
   - Autenticarse como organizador
   - Navegar: Dashboard → Torneos → Detalle → Ver Partidos → Detalle → Actualizar

3. **Validar Permisos Backend**
   - Asegurar que `PUT /matches/{id}/result` valida permisos
   - Probar con diferentes roles (organizer, referee, admin, player)

4. **Testing**
   - Crear partidos de prueba
   - Probar filtros (estado, ronda)
   - Probar actualización de resultados
   - Verificar que el ganador se calcula correctamente

---

## 📝 Conclusión

El flujo de navegación es **CONGRUENTE** y **FACTIBLE**. La implementación frontend está completa. Solo resta:

1. ✅ Verificar/implementar endpoint `GET /tournaments/{id}/matches` en backend
2. ✅ Validar permisos en backend para `PUT /matches/{id}/result`
3. ✅ Realizar testing end-to-end

El sistema está listo para probar una vez confirmado el backend.
