-- ------------------------------------------
-- Create database
-- ------------------------------------------

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS IntelliQ;
CREATE DATABASE IntelliQ CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE IntelliQ;

-- ------------------------------------------
-- Create tables
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS Questionnaire (
    QuestionnaireID VARCHAR(127) PRIMARY KEY,
    QuestionnaireTitle VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Question (
    QID VARCHAR(127) NOT NULL,
    QuestionnaireID VARCHAR(127) NOT NULL,
    Qtext VARCHAR(255) NOT NULL,
    Required VARCHAR(10) NOT NULL,
    Qtype VARCHAR(10) NOT NULL,
    PRIMARY KEY (QID, QuestionnaireID),
    FOREIGN KEY (QuestionnaireID)
    REFERENCES Questionnaire(QuestionnaireID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Qoption (
    OptID VARCHAR(127) NOT NULL,
    QID VARCHAR(127) NOT NULL,
    QuestionnaireID VARCHAR(127) NOT NULL,
    Opttxt VARCHAR(255) NOT NULL,
    NextQID VARCHAR(127) NOT NULL,
    PRIMARY KEY (OptID, QID, QuestionnaireID),
    FOREIGN KEY (QID,QuestionnaireID) REFERENCES Question(QID,QuestionnaireID)
    ON DELETE CASCADE,
    FOREIGN KEY (NextQID) REFERENCES Question(QID)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Questionnaire_Keywords (
	QuestionnaireID VARCHAR(127) NOT NULL,
    Keyword_text VARCHAR(255) NOT NULL,
    PRIMARY KEY (QuestionnaireID, Keyword_text),
    FOREIGN KEY (QuestionnaireID)
    REFERENCES Questionnaire(QuestionnaireID)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Answer (
	OptID VARCHAR(127) NOT NULL,
    QID VARCHAR(127) NOT NULL,
	QuestionnaireID VARCHAR(127) NOT NULL,
	Session_ID CHAR(4) NOT NULL,
	Answer_text VARCHAR(255) NULL,
	PRIMARY KEY (OptID, QID, QuestionnaireID, Session_ID),
    UNIQUE (QID, QuestionnaireID, Session_ID),
	FOREIGN KEY (OptID , QID, QuestionnaireID)
    REFERENCES Qoption (OptID , QID , QuestionnaireID)
    ON DELETE CASCADE
);