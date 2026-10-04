// ARCHIVO: modules/routes.js
// QUÉ HACE: define los endpoints de la API REST. Cada ruta recibe la petición, llama a la lógica
// del juego o de los puntajes y responde JSON con { ok, ... }. Los errores de validación
// responden 400; un puntaje repetido responde 409; los fallos inesperados van al middleware de server.js.

import { Router } from "express"; // Router permite agrupar rutas en un "mini servidor" montable.
import { crearPartida, jugarLetra, listarCategorias, obtenerPartida, pedirPista, rendirse } from "./juego.js"; // Lógica de la partida.
import { enviarPdf } from "./pdf.js"; // Generador del PDF de posiciones.
import { guardarPuntaje, listarPuntajes } from "./puntajes.js"; // Acceso a los puntajes.
import { validarNombre } from "./validaciones.js"; // Validación del nombre del jugador.

// Conecto las rutas del juego y de los puntajes con sus módulos.
export function crearRouter(db) { // "db" es el almacén de puntajes (MySQL o archivo) que decidió server.js.
  const router = Router(); // Router nuevo y vacío.
  const puntajesGuardados = new Set(); // Ids de partidas cuyo puntaje ya se guardó: un Set no admite repetidos y consulta rápido.

  router.get("/health", (_req, res) => res.json({ ok: true })); // Ruta de salud: sirve para comprobar que la API responde.

  router.get("/categorias", (_req, res) => res.json({ ok: true, categorias: listarCategorias() })); // Lista de categorías para el selector del modo al azar.

  router.post("/partidas", (req, res) => { // Crea una partida nueva.
    const resultado = crearPartida(req.body); // req.body trae { modo, palabra } o { modo, categoria }.
    if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error }); // 400 = pedido inválido (palabra mal escrita).
    return res.status(201).json({ ok: true, partida: resultado }); // 201 = recurso creado; la vista no incluye la palabra secreta.
  });

  router.post("/partidas/:id/letras", (req, res) => { // Registra una letra probada; ":id" es un parámetro de la URL.
    const resultado = jugarLetra(req.params.id, req.body?.letra); // "?." evita un error si no llegó cuerpo.
    if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error }); // Letra inválida, repetida o partida terminada.
    return res.json({ ok: true, partida: resultado }); // Estado actualizado de la partida.
  });

  router.post("/partidas/:id/pista", (req, res) => { // Pide una pista: revela una letra y cuesta un intento.
    const resultado = pedirPista(req.params.id); // La regla de negocio vive en juego.js.
    if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error }); // Ej.: queda un solo intento.
    return res.json({ ok: true, partida: resultado }); // Incluye "letraPista" con la letra revelada.
  });

  router.post("/partidas/:id/rendirse", (req, res) => { // El jugador abandona la partida.
    const resultado = rendirse(req.params.id); // Marca la partida como perdida.
    if (resultado.error) return res.status(400).json({ ok: false, mensaje: resultado.error }); // Partida inexistente o ya terminada.
    return res.json({ ok: true, partida: resultado }); // Ahora la respuesta sí incluye la palabra.
  });

  router.post("/puntajes", async (req, res, next) => { // Guarda un puntaje; es async porque escribe en la base.
    try { // try/catch: si algo inesperado falla, lo mando al middleware de errores.
      const validacion = validarNombre(req.body?.nombre); // Valido y limpio el nombre.
      const partida = obtenerPartida(String(req.body?.partidaId || "")); // Busco la partida real en el servidor.
      if (validacion.error) return res.status(400).json({ ok: false, mensaje: validacion.error }); // Nombre inválido.
      if (!partida || partida.estado !== "ganada") { // Solo se guardan partidas ganadas y existentes.
        return res.status(400).json({ ok: false, mensaje: "Solo se puede guardar una partida ganada." });
      }
      if (puntajesGuardados.has(partida.id)) { // Evito guardar dos veces la misma victoria.
        return res.status(409).json({ ok: false, mensaje: "El puntaje de esta partida ya fue guardado." }); // 409 = conflicto.
      }
      const guardado = await guardarPuntaje(db, { // Los puntos y el tiempo salen del servidor: el cliente no puede inventarlos.
        nombre: validacion.nombre,
        puntos: partida.puntos,
        tiempo: partida.tiempo
      });
      puntajesGuardados.add(partida.id); // Recién ahora marco la partida como ya guardada (si el guardado falla, se puede reintentar).
      return res.status(201).json({ ok: true, puntaje: guardado }); // Devuelvo el puntaje con su id.
    } catch (error) {
      return next(error); // Delego en el middleware de errores de server.js (responde 500).
    }
  });

  router.get("/puntajes", async (_req, res, next) => { // Lista el ranking.
    try {
      return res.json({ ok: true, puntajes: await listarPuntajes(db) }); // Hasta 100 filas ordenadas por puntos y tiempo.
    } catch (error) {
      return next(error); // Error de base de datos → 500 genérico.
    }
  });

  router.get("/puntajes/pdf", async (_req, res, next) => { // Descarga el ranking en PDF.
    try {
      return enviarPdf(res, await listarPuntajes(db)); // pdf.js escribe el documento directamente en la respuesta.
    } catch (error) {
      return next(error);
    }
  });

  return router; // server.js lo monta bajo "/api".
}
