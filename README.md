# S-J Wedding

Web de boda desarrollada con Astro para Sergio y Judit.

Incluye secciones informativas del evento, formulario para registrar alergias o intolerancias del banquete, propuestas de canciones para la fiesta y acceso al álbum compartido de fotos.

---

## Características

- Página principal de la boda con diseño visual y navegación por secciones.
- Sección de detalles del evento con direcciones de ceremonia y banquete.
- Registro de alergias e intolerancias:
  - guardado en Local Storage
  - persistencia en MongoDB
  - listado público en `/alergias`
- Registro de canciones sugeridas:
  - guardado en Local Storage
  - persistencia en MongoDB
  - listado público en `/musica`
- Acceso rápido a playlist de Spotify.
- Acceso al álbum compartido de Google Fotos.
- Despliegue mediante Docker y Docker Compose.

---

## Stack técnico

- Astro 6
- Alpine.js
- Tailwind CSS 4
- MongoDB
- Node.js 22
- Docker

---

## Requisitos

Antes de empezar, asegúrate de tener instalado:

- Node.js 22 o superior
- npm
- Docker
- Docker Compose

---

## Instalación

```bash
npm install
```

---

## Desarrollo local

### 1. Levantar MongoDB

Puedes iniciar MongoDB con Docker:

```bash
docker run -d \
  --name s-j-wedding-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=sj_wedding \
  mongo:7
```

### 2. Configurar variables de entorno

Este proyecto usa estas variables:

```bash
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=sj_wedding
```

En el devcontainer ya quedan configuradas automáticamente.

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación quedará disponible normalmente en:

- `http://localhost:4321`
- o en otro puerto libre si ese ya está en uso

---

## Build de producción

```bash
npm run build
```

Para previsualizar el resultado:

```bash
npm run preview
```

---

## Uso con Docker Compose

El proyecto incluye una app web y un contenedor de MongoDB.

```bash
docker compose up --build -d
```

Si no existe la red externa usada por el proxy, créala antes:

```bash
docker network create cloudflare_default
```

Para detener los servicios:

```bash
docker compose down
```

Si además quieres borrar el volumen de datos de Mongo:

```bash
docker compose down -v
```

---

## Rutas disponibles

### Páginas

- `/` — página principal
- `/alergias` — listado de alergias e intolerancias
- `/musica` — listado de canciones sugeridas

### API

- `GET /api/allergies` — obtiene las alergias registradas
- `POST /api/allergies` — guarda una nueva alergia
- `GET /api/music` — obtiene las canciones sugeridas
- `POST /api/music` — guarda una nueva canción

---

## Estructura principal del proyecto

```text
src/
  components/
    MusicSection.astro
    PhotoAlbumSection.astro
    WeddingDetails.astro
  lib/
    mongodb.ts
  pages/
    index.astro
    alergias.astro
    musica.astro
    api/
      allergies.ts
      music.ts
```

---

## Personalización rápida

### Playlist de Spotify

Puedes cambiar el enlace de la playlist en:

- `src/components/MusicSection.astro`

### Álbum de Google Fotos

Puedes cambiar el enlace del álbum en:

- `src/components/PhotoAlbumSection.astro`

### Direcciones del evento

Puedes actualizar ceremonia y banquete en:

- `src/components/WeddingDetails.astro`

---

## Tareas pendientes

- [ ] Cambiar frame de "Nuestra historia"
- [ ] Añadir link definitivo del álbum de fotos

## Notas

- Las sugerencias de alergias y música se guardan tanto en el navegador como en MongoDB.
- Si MongoDB no está disponible, la parte local seguirá funcionando en el dispositivo del usuario.
- La web usa salida tipo servidor de Astro para soportar las rutas API.

---

## Autor

Desarrollado para Sergio y Judit.
