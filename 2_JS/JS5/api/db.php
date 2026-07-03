<?php
declare(strict_types=1);

const ALUMNOS_DB_HOST = '127.0.0.1';
const ALUMNOS_DB_NAME = 'alumnosDB';
const ALUMNOS_DB_USER = 'root';
const ALUMNOS_DB_PASS = '';
const ALUMNOS_DB_CHARSET = 'utf8mb4';

function alumnos_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $baseDsn = sprintf('mysql:host=%s;charset=%s', ALUMNOS_DB_HOST, ALUMNOS_DB_CHARSET);

    try {
        $bootstrap = new PDO($baseDsn, ALUMNOS_DB_USER, ALUMNOS_DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $bootstrap->exec(
            'CREATE DATABASE IF NOT EXISTS `' . ALUMNOS_DB_NAME . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci'
        );
    } catch (Throwable $error) {
        throw new RuntimeException('No se pudo conectar a MySQL. Verifica que XAMPP y MySQL esten activos.');
    }

    $pdo = new PDO(
        sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            ALUMNOS_DB_HOST,
            ALUMNOS_DB_NAME,
            ALUMNOS_DB_CHARSET
        ),
        ALUMNOS_DB_USER,
        ALUMNOS_DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS alumnos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            edad INT NOT NULL
        )'
    );

    return $pdo;
}

function alumnos_validate(array $input): string
{
    $nombre = trim((string) ($input['nombre'] ?? ''));
    $apellido = trim((string) ($input['apellido'] ?? ''));
    $edad = filter_var($input['edad'] ?? null, FILTER_VALIDATE_INT);

    if ($nombre === '') {
        return 'El nombre es obligatorio.';
    }

    if ($apellido === '') {
        return 'El apellido es obligatorio.';
    }

    if ($edad === false || $edad < 1) {
        return 'La edad debe ser un entero mayor a 0.';
    }

    return '';
}

function alumnos_all(PDO $pdo): array
{
    return $pdo->query('SELECT id, nombre, apellido, edad FROM alumnos ORDER BY id ASC')->fetchAll();
}

function alumnos_insert(PDO $pdo, array $input): array
{
    $error = alumnos_validate($input);
    if ($error !== '') {
        throw new InvalidArgumentException($error);
    }

    $nombre = trim((string) $input['nombre']);
    $apellido = trim((string) $input['apellido']);
    $edad = (int) $input['edad'];

    $stmt = $pdo->prepare('INSERT INTO alumnos (nombre, apellido, edad) VALUES (:nombre, :apellido, :edad)');
    $stmt->execute([
        ':nombre' => $nombre,
        ':apellido' => $apellido,
        ':edad' => $edad,
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'nombre' => $nombre,
        'apellido' => $apellido,
        'edad' => $edad,
    ];
}

function alumnos_update(PDO $pdo, array $input): array
{
    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        throw new InvalidArgumentException('El id del alumno es obligatorio.');
    }

    $error = alumnos_validate($input);
    if ($error !== '') {
        throw new InvalidArgumentException($error);
    }

    $nombre = trim((string) $input['nombre']);
    $apellido = trim((string) $input['apellido']);
    $edad = (int) $input['edad'];

    $stmt = $pdo->prepare(
        'UPDATE alumnos
         SET nombre = :nombre, apellido = :apellido, edad = :edad
         WHERE id = :id'
    );
    $stmt->execute([
        ':id' => $id,
        ':nombre' => $nombre,
        ':apellido' => $apellido,
        ':edad' => $edad,
    ]);

    if ($stmt->rowCount() === 0) {
        throw new RuntimeException('No se encontro el alumno para editar.');
    }

    return [
        'id' => $id,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'edad' => $edad,
    ];
}

function alumnos_delete(PDO $pdo, array $input): int
{
    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id < 1) {
        throw new InvalidArgumentException('El id del alumno es obligatorio.');
    }

    $stmt = $pdo->prepare('DELETE FROM alumnos WHERE id = :id');
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        throw new RuntimeException('No se encontro el alumno para eliminar.');
    }

    return (int) $stmt->rowCount();
}
