const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');

const aiController = require('../controllers/aiController');
const newsController = require('../controllers/newsController');
const memeController = require('../controllers/memeController');
const cryptoController = require('../controllers/cryptoController');

// AI Route 
router.post('/ai', aiController.generateContent);

//New Routes
router.get('/news', newsController.fetchNews);

//Meme Route
router.get('/meme', memeController.fetchMeme);

//Crtypto Route
router.get('/crypto', cryptoController.fetchCryptoPrice);



// Create new UserData
router.post('/userdata', userDataController.createUserData);

// Get all UserData
router.get('/userdata', userDataController.getAllUserData);

// Get UserData by ID
router.get('/userdata/:id', userDataController.getUserDataById);

// Get UserData by Email
router.get('/userdata/email/:email', userDataController.getUserDataByEmail);

// Update UserData by ID
router.put('/userdata/:id', userDataController.updateUserData);

// Delete UserData by ID
router.delete('/userdata/:id', userDataController.deleteUserData);

module.exports = router;
