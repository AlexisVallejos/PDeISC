<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = alumnos_pdo();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'POST';

    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'message' => 'Metodo no permitido.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $payload = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        $payload = $_POST;
    }

    $action = (string) ($payload['action'] ?? 'list');

    switch ($action) {
        case 'list':
            $alumnos = alumnos_all($pdo);

            echo json_encode([
                'ok' => true,
                'total' => count($alumnos),
                'alumnos' => $alumnos,
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'create':
            $alumno = alumnos_insert($pdo, $payload);

            echo json_encode([
                'ok' => true,
                'message' => 'Alumno creado correctamente.',
                'alumno' => $alumno,
                'alumnos' => alumnos_all($pdo),
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'update':
            $alumno = alumnos_update($pdo, $payload);

            echo json_encode([
                'ok' => true,
                'message' => 'Alumno actualizado correctamente.',
                'alumno' => $alumno,
                'alumnos' => alumnos_all($pdo),
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'delete':
            alumnos_delete($pdo, $payload);

            echo json_encode([
                'ok' => true,
                'message' => 'Alumno eliminado correctamente.',
                'alumnos' => alumnos_all($pdo),
            ], JSON_UNESCAPED_UNICODE);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'message' => 'Accion no valida.',
            ], JSON_UNESCAPED_UNICODE);
    }
} catch (InvalidArgumentException $error) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => $error->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => $error->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
