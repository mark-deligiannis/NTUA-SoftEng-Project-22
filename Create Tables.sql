CREATE TABLE Questionnaire (
    QuestionnaireID VARCHAR(255) PRIMARY KEY,
    QuestionnaireTitle VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    FirstQID VARCHAR(255) NOT NULL,
);

CREATE TABLE Question (
    QID VARCHAR(255) NOT NULL,
    QuestionnaireID VARCHAR(255) NOT NULL,
    Qtext VARCHAR(255) NOT NULL,
    Required VARCHAR(10) NOT NULL,
    Type VARCHAR(10) NOT NULL,
    PRIMARY KEY (QID, QuestionnaireID),
    FOREIGN KEY (QuestionnaireID) REFERENCES Questionnaire(QuestionnaireID)
);

CREATE TABLE Option (
    OptID VARCHAR(255) NOT NULL,
    QID VARCHAR(255) NOT NULL,
    QuestionnaireID VARCHAR(255) NOT NULL,
    Opttxt VARCHAR(255) NOT NULL,
    QID2 VARCHAR(255), /* can be null */ 
    QuestionnaireID2 VARCHAR(255) NOT NULL,

    /* to be continued.... */
);