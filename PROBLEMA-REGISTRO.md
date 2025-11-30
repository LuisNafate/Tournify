# 🚨 Problema Detectado: Endpoint de Registro

## ❌ Estado Actual

El endpoint `POST /auth/register` está retornando error 500:

```json
{
  "error": "Error interno del servidor",
  "type": "BadRequestException",
  "message": "Failed to convert request body to class com.torneos.infrastructure.adapters.input.dtos.RegisterRequest"
}
```

## ✅ Endpoints que SÍ Funcionan

- ✅ `GET /` - Health check funciona
- ✅ `GET /sports` - Lista deportes correctamente
- ✅ `POST /auth/login` - Login funciona (retorna 401 para credenciales incorrectas)

## 🔍 Diagnóstico

El problema está en el backend (Ktor). El servidor **no puede deserializar** el JSON del request body al DTO `RegisterRequest`.

### Posibles causas:

1. **Falta configuración de Jackson/Kotlinx Serialization** en el backend
2. **Nombres de campos incorrectos** en el DTO
3. **Tipos de datos incompatibles** (String vs Enum para `role`)
4. **Falta anotaciones de serialización** en el DTO

## 📋 Request que se envía desde Angular:

```json
{
  "username": "organizador_test",
  "email": "organizador@test.com",
  "password": "password123",
  "role": "organizer"
}
```

## 🔧 Soluciones Posibles

### Opción 1: Revisar el DTO en el Backend

Verifica que `RegisterRequest.kt` tenga esta estructura:

```kotlin
@Serializable
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val role: String  // O UserRole si es enum
)
```

### Opción 2: Verificar Content Negotiation en Ktor

Asegúrate de tener en `Application.kt`:

```kotlin
install(ContentNegotiation) {
    json(Json {
        prettyPrint = true
        isLenient = true
        ignoreUnknownKeys = true
    })
}
```

### Opción 3: Revisar el Route Handler

En `AuthRoutes.kt`, verifica:

```kotlin
post("/register") {
    val request = call.receive<RegisterRequest>() // Esta línea falla
    // ...
}
```

### Opción 4: Agregar Logging para Debug

Agrega logging antes de recibir el request:

```kotlin
post("/register") {
    println("Received body: ${call.receiveText()}")
    call.request.headers.forEach { key, values ->
        println("Header $key: $values")
    }
    val request = call.receive<RegisterRequest>()
    // ...
}
```

## 🧪 Cómo Probarlo

### Usando PowerShell:

```powershell
$body = @{
    username = "test_user"
    email = "test@tournify.com"
    password = "password123"
    role = "organizer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body `
    -UseBasicParsing
```

### Usando curl (Git Bash):

```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@tournify.com",
    "password": "password123",
    "role": "organizer"
  }'
```

## ✏️ Acción Requerida

**Necesitas revisar el código del backend de Ktor** para:

1. ✅ Confirmar la estructura del DTO `RegisterRequest`
2. ✅ Verificar que tiene la anotación `@Serializable`
3. ✅ Confirmar que `ContentNegotiation` está instalado correctamente
4. ✅ Agregar logging para ver qué está recibiendo el servidor
5. ✅ Verificar que el tipo de `role` coincida (String vs Enum)

## 📝 Mientras Tanto...

El código de Angular está correctamente implementado. Una vez que se arregle el backend:

1. ✅ El formulario de registro enviará los datos correctos
2. ✅ El AuthService manejará la respuesta
3. ✅ El token se guardará automáticamente
4. ✅ El usuario será redirigido al dashboard

---

## 🔗 Archivos Relacionados

- Frontend: `src/app/core/services/auth.service.ts`
- Frontend: `src/app/modules/auth/pages/register/register.component.ts`
- Backend: (Necesitas revisar) `AuthRoutes.kt` y `RegisterRequest.kt`
