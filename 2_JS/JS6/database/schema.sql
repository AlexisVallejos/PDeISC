-- ARCHIVO: database/schema.sql
-- QUÉ HACE: crea la base de datos y la tabla de puntajes. El servidor ya hace esto solo al arrancar
-- (modules/database.js), pero este script sirve para crearlas a mano y para mostrarlo en la defensa.

CREATE DATABASE IF NOT EXISTS Score -- Crea la base "Score" solo si todavía no existe.
  CHARACTER SET utf8mb4 -- Juego de caracteres completo: guarda tildes, ñ y emojis sin problemas.
  COLLATE utf8mb4_unicode_ci; -- Regla de comparación: ordena y compara texto sin distinguir mayúsculas.

USE Score; -- Selecciona la base para que los comandos siguientes se apliquen a ella.

CREATE TABLE IF NOT EXISTS score ( -- Tabla de puntajes; no falla si ya existe.
  id INT UNSIGNED NOT NULL AUTO_INCREMENT, -- Identificador numérico sin signo que MySQL incrementa solo.
  tiempo INT UNSIGNED NOT NULL, -- Segundos que tardó el jugador en ganar.
  puntos INT UNSIGNED NOT NULL, -- Puntos obtenidos (100 menos 10 por error, mínimo 10).
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora; si no se indica, MySQL pone el momento actual.
  nombre VARCHAR(40) NOT NULL, -- Nombre del jugador, hasta 40 caracteres.
  PRIMARY KEY (id), -- El id identifica de forma única cada fila.
  INDEX idx_score_puntos_tiempo (puntos DESC, tiempo ASC, fecha ASC) -- Índice con el mismo orden del ranking: acelera el ORDER BY.
);
