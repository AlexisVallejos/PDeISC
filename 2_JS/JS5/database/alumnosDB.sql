CREATE DATABASE IF NOT EXISTS alumnosDB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE alumnosDB;

DROP TABLE IF EXISTS alumnos;

CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  edad INT NOT NULL
);

INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Ana', 'Gomez', 20);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Lucas', 'Perez', 22);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Sofia', 'Torres', 19);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Martin', 'Lopez', 21);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Valentina', 'Rios', 23);

