-- Base de datos para el acceso de usuarios DAMAC (MySQL / MariaDB de XAMPP).
-- Importar desde phpMyAdmin (pestaña "Importar") o con:
--   C:\xampp\mysql\bin\mysql.exe -u root < database.sql

CREATE DATABASE IF NOT EXISTS damac_acceso
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE damac_acceso;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  usuario       VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(120) NOT NULL,
  rol           VARCHAR(40)  NOT NULL DEFAULT 'Operador',
  clave         CHAR(64)     NOT NULL COMMENT 'SHA-256 de la contraseña',
  ultimo_acceso DATETIME     NULL,
  creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- Las contraseñas se guardan hasheadas, nunca en texto plano.
INSERT INTO usuarios (nombre, usuario, email, rol, clave) VALUES
  ('Administrador DAMAC', 'admin',  'admin@damac.com',  'Administrador', SHA2('1234', 256)),
  ('Alexis Vallejos',     'alexis', 'alexis@damac.com', 'Supervisor',    SHA2('damac2026', 256)),
  ('María López',         'maria',  'maria@damac.com',  'Operador',      SHA2('maria123', 256));
