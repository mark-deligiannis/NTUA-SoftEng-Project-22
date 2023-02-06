import argparse
import requests
import os

# ======================== Globals ========================
host = "localhost"
port = 9103
base_url = f"http://{host}:{port}/intelliq_api"

# ======================== Callback functions ========================
def healthcheck (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    try:
        response = requests.get(base_url+"/admin/healthcheck"+format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return

    status_code = response.status_code
    if status_code == 200:
        print("Database is up (status code 200)")
    elif status_code == 500:
        print("Database is down (status code 500)")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def resetall (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    try:
        response = requests.post(base_url+"/admin/resetall"+format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return

    status_code = response.status_code
    if status_code == 200:
        print("Database reset successful (Status code 200)")
    elif status_code == 500:
        print("Database reset failed (Status code 200)")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def questionnaire_upd (**kwargs):
    file_path = kwargs["source"]
    file = {'file': ('file.json', file_path)}
    try:
        response = requests.post(url=base_url+"/admin/questionnaire_upd", files=file)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return

    status_code = response.status_code
    if status_code == 200:
        print("Questionnaire insertion successful (Status code 200)")
    elif status_code == 400:
        print("Invalid questionnaire format (Status code 400)")
    elif status_code == 500:
        print('Internal server Error (Status code 500)')
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def resetq (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    try:
        response = requests.post(url = base_url + "/admin/resetq/" + questionnaireID + format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return

    status_code = response.status_code  
    if status_code == 200:
        print("Deletion of answers was successful (Status code 200)")
    elif status_code == 500:
        print("Deletion of answers was unsuccessful (Status code 500)")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def fetchquestionnaires (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    keywords = kwargs.get("keywords")
    if (keywords):
        body = {"keywords": keywords}
    else:
        body = None

    try:
        response = requests.post(url = base_url + "/fetchquestionnaires/" + format_ext, data=body)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return
    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get questionnaires) successfull")
    elif(status_code == 400):
        print("Data format error")
    elif(status_code == 402):
        print("API call returned nothing")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def questionnaire (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    try:
        response = requests.get(url = base_url + "/questionnaire/" + questionnaireID + format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return
    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get questionnaire info) successfull")
    elif(status_code == 402):
        print("API call returned nothing")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return
    
def question (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    questionID = kwargs["question_id"]
    try:
        response = requests.get(url = base_url + f"/question/{questionnaireID}/{questionID}" + format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return
    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get question info) successfull")
    elif(status_code == 402):
        print("API call returned nothing")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def doanswer (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    questionID = kwargs["question_id"]
    sessionID = kwargs["session_id"]
    optionID = kwargs["option_id"]
    answertxt = kwargs.get("answer_txt")
    if not answertxt:
        answertxt = ""
    try:
        response = requests.post(url = base_url + f"/doanswer/{questionnaireID}/{questionID}/{sessionID}/{optionID}" + format_ext,
                            data = {"answer": answertxt}, headers = {'Content-Type': 'application/x-www-form-urlencoded'})
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return

    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get question info) successfull")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print(f"Resource unavailable {status_code}")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return
    
def getsessionanswers (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    session = kwargs["session_id"]
    try:
        response = requests.get(url = base_url + f"/getsessionanswers/{questionnaireID}/{session}" + format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return
    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get session answers) successfull")
    elif(status_code == 402):
        print("API call returned nothing")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return

def getquestionanswers (**kwargs):
    format_ext = f"?format={kwargs['format']}"
    questionnaireID = kwargs["questionnaire_id"]
    questionID = kwargs["question_id"]
    try:
        response = requests.get(url = base_url + f"/getquestionanswers/{questionnaireID}/{questionID}" + format_ext)
    except requests.exceptions.ConnectionError:
        print("API unreachable")
        return
    status_code = response.status_code
    if(status_code == 200):
        print(f"API call (get question answers) successfull")
    elif(status_code == 402):
        print("API call returned nothing")
    elif(status_code == 500):
        print("Internal Server Error")
    else:
        print("Resource unavailable")
    if response.text:
        print(f"Returned Message:\n{response.text}")
    else:
        print("No message provided")
    return


# ======================== Parser and Subparsers Configuration ========================
# Define parser
program_name = "se2216"

parser = argparse.ArgumentParser(prog=program_name, usage=f"{program_name} scope --param1 value1 [--param2 value2 ...] --format fff")
subparsers = parser.add_subparsers(title="scope", help="supported operations")

# Healthcheck
healthcheck_subpars = subparsers.add_parser("healthcheck", help="Check if database is up", usage=f"{program_name} healthcheck --format fff")
healthcheck_subpars.add_argument("--format", type=str, required=True, help="Format of output")
healthcheck_subpars.set_defaults(func=healthcheck)

# Resetall
resetall_subpars = subparsers.add_parser("resetall", help="Reset database", usage=f"{program_name} resetall --format fff")
resetall_subpars.add_argument("--format", type=str, required=True, help="Format of output")
resetall_subpars.set_defaults(func=resetall)

# questionnaire_upd
questionnaire_upd_subpars = subparsers.add_parser("questionnaire_upd", help="Add a new questionnaire", usage=f"{program_name} questionnaire_upd --source SOURCE --format fff")
questionnaire_upd_subpars.add_argument("--source", type=argparse.FileType("rb"), required=True, help="path to the file containing the json")
questionnaire_upd_subpars.add_argument("--format", type=str, required=True, help="Format of output")
questionnaire_upd_subpars.set_defaults(func=questionnaire_upd)

# Resetq
resetq_subpars = subparsers.add_parser("resetq", help="Delete all answers for a given questionnaire", usage=f"{program_name} resetq --questionnaire_id QUESTIONNAIRE_ID --format fff")
resetq_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
resetq_subpars.add_argument("--format", type=str, required=True, help="Format of output")
resetq_subpars.set_defaults(func=resetq)

# Fetchquestionnaires
fetchquestionnaires_subpars = subparsers.add_parser("fetchquestionnaires", help="Fetch questionnaires with or without keywords", usage=f"{program_name} fetchquestionnaires [--keywords KEYWORD1 [KEYWORD2 ...]] --format fff")
fetchquestionnaires_subpars.add_argument("--keywords", type=str, nargs='*', help="List of all keywords")
fetchquestionnaires_subpars.add_argument("--format", type=str, required=True, help="Format of output")
fetchquestionnaires_subpars.set_defaults(func=fetchquestionnaires)

# Questionnaire
questionnaire_subpars = subparsers.add_parser("questionnaire", help="Fetch questionnaire and questions", usage=f"{program_name} questionnaire --questionnaire_id QUESTIONNAIRE_ID --format fff")
questionnaire_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
questionnaire_subpars.add_argument("--format", type=str, required=True, help="Format of output")
questionnaire_subpars.set_defaults(func=questionnaire)

# Question
question_subpars = subparsers.add_parser("question", help="Fetch question and options", usage=f"{program_name} question --questionnaire_id QUESTIONNAIRE_ID --question_id QUESTION_ID --format fff")
question_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
question_subpars.add_argument("--question_id", type=str, required=True, help="ID of question")
question_subpars.add_argument("--format", type=str, required=True, help="Format of output")
question_subpars.set_defaults(func=question)

# Doanswer
doanswer_subpars = subparsers.add_parser("doanswer", help="Insert answer to question of questionnaire for a given session",
usage=f"{program_name} doanswer --questionnaire_id QUESTIONNAIRE_ID --question_id QUESTION_ID --session_id SESSION_ID --option_id OPTION_ID [--answer_txt ANSWER_TXT] --format fff")
doanswer_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
doanswer_subpars.add_argument("--question_id", type=str, required=True, help="ID of question")
doanswer_subpars.add_argument("--session_id", type=str, required=True, help="ID of session")
doanswer_subpars.add_argument("--option_id", type=str, required=True, help="ID of option")
doanswer_subpars.add_argument("--format", type=str, required=True, help="Format of output")
doanswer_subpars.add_argument("--answer_txt", type=str, help="Answer (only needed for open questions)")
doanswer_subpars.set_defaults(func=doanswer)

# Getsessionanswers
getsessionanswers_subpars = subparsers.add_parser("getsessionanswers", help="Fetch answers for a given session",
usage=f"{program_name} getsessionanswers --questionnaire_id QUESTIONNAIRE_ID --session_id SESSION_ID --format fff")
getsessionanswers_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
getsessionanswers_subpars.add_argument("--session_id", type=str, required=True, help="ID of session")
getsessionanswers_subpars.add_argument("--format", type=str, required=True, help="Format of output")
getsessionanswers_subpars.set_defaults(func=getsessionanswers)

# Getquestionanswers
getquestionanswers_subpars = subparsers.add_parser("getquestionanswers", help="Fetch answers for a given question",
usage=f"{program_name} getquestionanswers --questionnaire_id QUESTIONNAIRE_ID --question_id QUESTION_ID --format fff")
getquestionanswers_subpars.add_argument("--questionnaire_id", type=str, required=True, help="ID of questionnaire")
getquestionanswers_subpars.add_argument("--question_id", type=str, required=True, help="ID of question")
getquestionanswers_subpars.add_argument("--format", type=str, required=True, help="Format of output")
getquestionanswers_subpars.set_defaults(func=getquestionanswers)

# ======================== Parse Input ========================

known_args, unknown_args = parser.parse_known_args()

if unknown_args:
    print(f"Unknown argument(s): {unknown_args}")
    parser.print_help()
    parser.exit(1)

try:
    known_args.func(**vars(known_args))
except AttributeError:
    parser.print_help()
    parser.exit(1)