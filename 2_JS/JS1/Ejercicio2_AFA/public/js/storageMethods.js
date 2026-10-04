/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: Ejercicio2_River/public/js/storageMethods.js
 * Rol: maneja la interaccion del navegador: eventos, DOM, validaciones visuales y llamadas al servidor.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
// aca guardamos los socios en un array y lo sincronizamos con el localstorage
// usamos push o unshift segun lo que elija el usuario para cumplir la consigna

class InventoryStorage {
    constructor() {
        const stored = localStorage.getItem('socios_data');
        this.itemsArray = stored ? JSON.parse(stored) : [];
    }

    // guardamos el socio y actualizamos el localstorage
    saveItem(item, method = 'push') {
        if (method === 'unshift') {
            // con unshift lo mandamos al principio de todo
            this.itemsArray.unshift(item);
        } else {
            // con push lo mandamos al final
            this.itemsArray.push(item);
        }

        localStorage.setItem('socios_data', JSON.stringify(this.itemsArray));
        return this.itemsArray;
    }

    getAllItems() {
        return this.itemsArray;
    }
}

// lo mandamos a window para usarlo desde main.js
window.inventoryStorage = new InventoryStorage();
