const express = require('express');
const {createContactEntry} = require('../controllers/contactController');
const {contactLimiter} = require('../middlewares/rateLimiter');
const {validateContactInput} = require('../middlewares/validateContactInput');

const contactRouter = express.Router();

contactRouter.post('/save',contactLimiter, validateContactInput, createContactEntry);

module.exports = contactRouter;