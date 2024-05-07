const { Router } = require('express');
const fs = require('fs');
const { uploader } = require('../utils/multer');

const router = Router();
const productsFilePath = 'ruta/al/json/de/productos.json';

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/products', (req, res) => {
    try {
        const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        res.render('products', { products: productsData });
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error.message);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.post('/upload-file', uploader.single('myfile'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No se proporcionó ningún archivo.');
    } else {
        res.render('successFile', { filename: req.file.filename });
    }
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/realtimeproducts', (req, res) => {
    try {
        const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        res.render('realTimeProducts', { products: productsData });
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error.message);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
