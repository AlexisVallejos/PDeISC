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
