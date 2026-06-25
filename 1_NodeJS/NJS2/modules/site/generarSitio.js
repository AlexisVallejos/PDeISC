// Genera todos los archivos HTML del proyecto dentro de /pages.
// Cada modulo aporta el contenido de su consigna y layout.js envuelve el resultado.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { escribirArchivo } from '../consigna2/archivos.js';
import { renderLayout } from '../shared/layout.js';
import { renderContenidoConsigna1 } from '../consigna1/consigna1.js';
import { renderContenidoArchivos, crearVista } from '../consigna2/consigna2.js';
import { renderContenidoConsigna3 } from '../consigna3/consigna3.js';
import { renderContenidoNPM } from '../consigna4/npm.js';
import { renderContenidoInicio } from '../consigna5/inicio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..', '..');

export async function generarSitio() {
  // Punto 5: inicio del sitio.
  escribirArchivo(path.join(BASE, 'pages', 'index.html'), renderLayout('Inicio', renderContenidoInicio(), '/'));

  // Punto 1: modulos propios.
  escribirArchivo(path.join(BASE, 'pages', 'consigna1', 'calculo.html'), renderLayout('Consigna 1', renderContenidoConsigna1(), '/calculo'));

  // Punto 2: HTTP + File System.
  escribirArchivo(path.join(BASE, 'pages', 'consigna2', 'archivos.html'), renderLayout('Consigna 2', renderContenidoArchivos(), '/archivos'));
  crearVista();

  // Punto 3: modulo URL.
  escribirArchivo(path.join(BASE, 'pages', 'consigna3', 'url.html'), renderLayout('Consigna 3', renderContenidoConsigna3(), '/url'));

  // Punto 4: paquete NPM.
  escribirArchivo(path.join(BASE, 'pages', 'consigna4', 'npm.html'), renderLayout('NPM', renderContenidoNPM(), '/npm'));

}
