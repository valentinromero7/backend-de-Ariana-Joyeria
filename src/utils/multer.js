const { Server } = require('socket.io');
const multer = require('multer');
const { dirname } = require('node:path');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, dirname(__dirname)+'/public/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);      
    }
});

const uploader = multer({ storage });

function initializeProductSocket(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        const products = readDataFromFile('productos.json');
        socket.emit('productos_actualizados', products);

        socket.on('agregar_producto', (producto) => {
            let products = readDataFromFile('productos.json');
            const newProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            const newProduct = { id: newProductId, ...producto };
            products.push(newProduct);
            writeDataToFile('productos.json', products);
            io.emit('productos_actualizados', products);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado del socket de productos');
        });
    });
}

module.exports = { uploader, initializeProductSocket };
