# JS5 - alumnosDB

Proyecto listo para correr con Apache + MySQL.

## Que hace

- Crea y usa la base `alumnosDB`.
- Expone una API REST en PHP, pero todo entra por `POST`.
- Permite editar y eliminar un alumno por fila.
- Muestra los datos del CRUD en una página y el JSON en otra.

## Como correrlo aca

1. Copia `JS5` dentro de `C:\xampp\htdocs`.
2. Inicia Apache y MySQL.
3. Abre `http://localhost/JS5/`.
4. Abre `http://localhost/JS5/json.php` para ver el JSON aparte.

## Importar la base

Importa `database/alumnosDB.sql` desde phpMyAdmin para crear la base y la tabla.

## Endpoints

- `POST /api/alumnos.php` con `action=list`
- `POST /api/alumnos.php` con `action=create`
- `POST /api/alumnos.php` con `action:update`
- `POST /api/alumnos.php` con `action=delete`
## Si tu MySQL no usa root sin clave

Edita `api/db.php` y cambia:

- `ALUMNOS_DB_USER`
- `ALUMNOS_DB_PASS`
