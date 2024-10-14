const express = require('express');
const metroController = require('../controllers/metroDataController');

const router = express.Router();

router
  .route('/metrodata')
  .get(metroController.getMetroData);

module.exports = router;