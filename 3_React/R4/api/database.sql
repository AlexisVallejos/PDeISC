-- Base de datos del portfolio (XAMPP / phpMyAdmin).
-- Solo crea la base: al arrancar, server.js crea las tablas portfolio_* y
-- carga el contenido de semilla.json si están vacías.
-- Para cambiar textos después, editá las filas desde phpMyAdmin (o el panel de MySQL de Easypanel).

CREATE DATABASE IF NOT EXISTS portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio;

-- Ejemplos de edición:
-- UPDATE portfolio_perfil SET titular = 'Nuevo titular', email = 'yo@ejemplo.com' WHERE id = 1;
-- INSERT INTO portfolio_proyectos (titulo, descripcion, tecnologias, repo, demo, orden)
--   VALUES ('Nuevo proyecto', 'Qué hace', 'React,Node.js', 'https://github.com/...', '', 10);
-- SELECT * FROM portfolio_mensajes ORDER BY creado_en DESC;
