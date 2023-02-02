const express = require('express');
const router = express.Router();

const user_question_handler = require("./controllers/user_question.js")
const user_questionnaire_handler = require("./controllers/user_questionnaire.js")
const user_questionnaire_dump_handler = require("./controllers/user_questionnaire_dump.js")
const user_getquestionanswers_handler = require("./controllers/user_getquestionanswers.js")
const user_getsessionanswers_handler = require("./controllers/user_getsessionanswers.js")
const user_doanswer_handler = require("./controllers/user_doanswer.js")

router.get(`/questionnaire/:questionnaireID`, user_questionnaire_handler);
router.get(`/questionnairedump/:questionnaireID`, user_questionnaire_dump_handler);
router.get(`/question/:questionnaireID/:questionID`, user_question_handler);
router.post(`/doanswer/:questionnaireID/:questionID/:session/:optionID`, user_doanswer_handler);
router.get(`/getsessionanswers/:questionnaireID/:session`, user_getsessionanswers_handler);
router.get(`/getquestionanswers/:questionnaireID/:questionID`, user_getquestionanswers_handler);

module.exports = router