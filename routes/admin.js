const express = require('express');
const router = express.Router();

const questionnaire_upd = require('questionnaire_upd.js');
router.use("/questionnaire_upd", questionnaire_upd);

// Export router so that app.js can use it
module.exports = router;