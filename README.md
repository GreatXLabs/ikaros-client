# ikaros-client

Frontend React y gateway Spring Boot para el sistema Ikaros. Gestión de misiones espaciales, tripulación, eventos y cuentas con control de acceso por roles.

## Descripción

Ikaros es un sistema de relevo de información y gestión basada en roles para misiones espaciales. Este repositorio contiene los componentes del lado del cliente:

- **react-client/**: Interfaz web construida en React
- **ikaros-gateway/**: API Gateway que proxea las peticiones HTTP hacia ikaros-server, el cual se comunica mediante un protocolo TCP propio

El frontend se comunica con el gateway vía REST. El gateway, a su vez, se conecta con ikaros-server a través de sockets TCP para persistir y consultar datos.

## Arquitectura

```
React (Vite)  ──HTTP──>  Gateway (Spring Boot)  ──TCP──>  ikaros-server
    :5173                      :8080                          :9999
```

El gateway actúa como intermediario: recibe peticiones REST del frontend, las traduce al protocolo TCP que entiende ikaros-server, y devuelve las respuestas al cliente.

## Componentes

### React Client

Aplicación SPA desarrollada con las siguientes tecnologías:

- **React 19** con Vite como bundler
- **Chakra UI** para el diseño de componentes
- **React Router** para navegación entre páginas
- **i18next** para internacionalización (español e inglés)
- **Three.js** para visualizaciones 3D

**Páginas principales:**

- Login y Landing
- Misiones (listado, creación, edición, vista detallada)
- Tripulantes (listado, alta, edición, vista detallada)
- Eventos
- Cuentas de usuario
- Logs del sistema

**Scripts disponibles:**

```bash
pnpm dev       # Iniciar servidor de desarrollo
pnpm build     # Generar build de producción
pnpm lint      # Ejecutar linter (ESLint)
pnpm preview   # Vista previa del build
```

### Ikaros Gateway

API Gateway desarrollado con Spring Boot 4.0.6 y Java 17. Se encarga de:

- Autenticación y control de acceso por roles (RRHH, Coordinador, Asignador, Registrador, Jefe)
- Proxear peticiones REST hacia ikaros-server vía TCP
- Gestión de archivos subidos usando MinIO como almacenamiento de objetos
- Registro de logs del sistema

**Endpoints principales:**

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/login` | POST | Iniciar sesión |
| `/api/auth/check` | GET | Verificar sesión activa |
| `/api/misiones` | GET/POST | Listar y crear misiones |
| `/api/tripulantes` | GET/POST | Listar y crear tripulantes |
| `/api/eventos` | GET/POST | Listar y crear eventos |
| `/api/usuarios` | GET/POST | Gestionar cuentas de usuario |
| `/api/logs` | GET | Consultar logs del sistema |

## Requisitos previos

- Node.js 20 o superior
- Java 17 o superior
- Gradle 8.x
- ikaros-server ejecutándose en el puerto configurado (por defecto 9999)

## Instalación y ejecución

### Frontend

```bash
cd react-client
pnpm install
pnpm dev
```

El servidor de desarrollo se inicia en `http://localhost:5173`. Las peticiones API se redirigen al gateway en `http://localhost:8080` por defecto.

### Gateway

```bash
cd ikaros-gateway
./gradlew bootRun
```

El gateway se inicia en el puerto configurado vía `JAVA_APP_PORT` (por defecto 8080).

## Variables de entorno

### Gateway

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `JAVA_APP_PORT` | Puerto del gateway | `8080` |
| `IKAROS_SERVER_HOST` | Host de ikaros-server | `localhost` |
| `IKAROS_SERVER_PORT` | Puerto TCP de ikaros-server | `9999` |
| `IKAROS_CORS_ALLOWED_ORIGINS` | Orígenes permitidos (CORS) | Ver archivo de config |
| `MINIO_ENDPOINT` | Endpoint de MinIO | (requerido) |
| `MINIO_ACCESS_KEY` | Clave de acceso MinIO | (requerido) |
| `MINIO_SECRET_KEY` | Clave secreta MinIO | (requerido) |
| `MINIO_BUCKET` | Bucket de MinIO | (requerido) |

### Frontend

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base del gateway | `http://localhost:8080` |

## Despliegue

El proyecto incluye configuración para despliegue con Nixpacks (Railway, Render, etc.) y Docker.

**Nixpacks:** El archivo `nixpacks.toml` en la raíz configura el build automático del frontend y lo sirve con `serve`.

**Docker:** Tanto el frontend como el gateway incluyen Dockerfiles multi-etapa optimizados para producción.

## Licencia

Este proyecto está licenciado bajo la GNU General Public License v3.0. Ver el archivo [LICENSE](LICENSE) para más detalles.
