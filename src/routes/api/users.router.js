const express = require('express');
const router = express.Router();
const { usersModel } = require('../../models/users.model');

// Rutas para manipulación de usuarios en la memoria
let users = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' },
    { id: 3, name: 'User 3', email: 'user3@example.com' }
];

// Rutas para manipulación de usuarios en la memoria
router.get('/', (req, res) => {
    res.json(users);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

router.post('/', (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = { id, name, email };
        res.status(204).end();
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(user => user.id !== id);
    res.status(204).end();
});

// Rutas para manipulación de usuarios en la base de datos
router.get('/db', async (req, res) => {
    const usersFromDB = await usersModel.find({});
    res.send({ status: 'success', users: usersFromDB });
});

router.post('/db', async (req, res) => {
    const { body } = req;
    try {
        const newUser = await usersModel.create(body);
        res.status(201).json({ status: 'success', user: newUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/db/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userFound = await usersModel.findOne({ _id: uid });
        if (userFound) {
            res.send({ status: 'success', user: userFound });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/db/:uid', async (req, res) => {
    const { uid } = req.params;
    const { body } = req;
    try {
        const updatedUser = await usersModel.findByIdAndUpdate(uid, body, { new: true });
        if (updatedUser) {
            res.send({ status: 'success', user: updatedUser });
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/db/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const deletedUser = await usersModel.findByIdAndDelete(uid);
        if (deletedUser) {
            res.status(204).end();
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
