const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const admin_questionnaire_upd = require('../controllers/admin_questionnaire_upd');
router.post("/questionnaire_upd", upload.single('file'), admin_questionnaire_upd);

const admin_healthcheck = require('../controllers/admin_healthcheck');
router.get('/healthcheck', admin_healthcheck);

const admin_resetall = require('../controllers/admin_resetall');
router.post('/resetall', admin_resetall);

// Export router so that app.js can use it
module.exports = router;