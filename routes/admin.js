const express = require('express');
const router = express.Router();

const questionnaire_upd = require('./questionnaire_upd.js');
router.use("/questionnaire_upd", questionnaire_upd);

const admin_healthcheck = require('./admin_healthcheck.js');
router.use("/admin_healthcheck", admin_healthcheck);

// Export router so that app.js can use it
module.exports = router;