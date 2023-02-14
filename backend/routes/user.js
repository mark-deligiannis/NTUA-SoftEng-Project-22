const express = require('express');
const router = express.Router();
const BodyParser = require('body-parser');

router.use(BodyParser.urlencoded({extended: true}))

const user_question_handler = require("../controllers/user_question.js")
const user_questionnaire_handler = require("../controllers/user_questionnaire.js")
const user_getquestionanswers_handler = require("../controllers/user_getquestionanswers.js")
const user_getsessionanswers_handler = require("../controllers/user_getsessionanswers.js")
const user_doanswer_handler = require("../controllers/user_doanswer.js")
const user_fetchquestionnaires = require("../controllers/user_fetchquestionnaires.js")
const user_fetchkeywords = require("../controllers/user_fetchkeywords.js")
const user_questionnaireanscount = require("../controllers/user_questionnaireanscount.js")

router.get(`/questionnaire/:questionnaireID`, user_questionnaire_handler);
router.get(`/question/:questionnaireID/:questionID`, user_question_handler);
router.post(`/doanswer/:questionnaireID/:questionID/:session/:optionID`, user_doanswer_handler);
router.get(`/getsessionanswers/:questionnaireID/:session`, user_getsessionanswers_handler);
router.get(`/getquestionanswers/:questionnaireID/:questionID`, user_getquestionanswers_handler);
router.post(`/fetchquestionnaires`, user_fetchquestionnaires);
router.get(`/fetchkeywords`, user_fetchkeywords);
router.get(`/questionnaireanscount/:questionnaireID`, user_questionnaireanscount);

module.exports = router