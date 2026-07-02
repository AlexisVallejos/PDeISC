CREATE TABLE alumnos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER NOT NULL CHECK (edad > 0)
);

-- Sample rows used by the interface when the user loads demo data.
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Ana', 'Gomez', 20);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Lucas', 'Perez', 22);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Sofia', 'Torres', 19);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Martin', 'Lopez', 21);
INSERT INTO alumnos (nombre, apellido, edad) VALUES ('Valentina', 'Rios', 23);
