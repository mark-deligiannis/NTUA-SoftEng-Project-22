import subprocess
from colorama import Fore,Style
import json

def test_command(cmd, isbad, iscsv, number):
    # First check: Return code
    try:
        print(f"#{number} return code check:", end=' ')
        result = subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        assert bool(result.returncode) == isbad
        print(Fore.GREEN + "Success!" + Style.RESET_ALL)
        if (isbad):
            return
    except subprocess.CalledProcessError as e:
        print(Fore.RED + "Fail! Program crashed." + Style.RESET_ALL)
        return
    except AssertionError as e:
        print(Fore.RED + "Fail! Wrong return code." + Style.RESET_ALL)
        return
    except Exception as e:
        print(Fore.RED + "Fail! Wrong return code." + Style.RESET_ALL)
        return

    # Second check: Output in correct format (csv/json)?
    is_json = True
    print(f"#{number} data format check:", end=' ')
    res_string = result.stdout.decode('ISO-8859-7').strip().replace('\r','')

    # Check for errors or lack of data
    if ("API call returned nothing" in res_string or "Internal server Error" in res_string or "Resource unavailable" in res_string or "No message provided" in res_string):
        print(Fore.GREEN + "Success!" + Style.RESET_ALL)
        return

    length = len(res_string)+1
    index_square = (res_string.find('[') + length) % length
    index_curly = (res_string.find('{') + length) % length
    index = min(index_square,index_curly)
    if index == length-1:
        is_json = False
    else:
        try:
            json.loads(res_string[index:])
        except ValueError:
            is_json = False
    
    if (is_json == iscsv):
        print(Fore.RED +  "Fail!" + Style.RESET_ALL)
    else:
        print(Fore.GREEN + "Success!" + Style.RESET_ALL)
    return

prefix = ['python', 'se2216.py']
path_to_main_dummy = '..\\backend\\test\\Route testing\\dummydata_main.json'

correct_commands = [['healthcheck'],
                    ['resetall'],
                    ['resetq', '--questionnaire_id', 'QQ001'],
                    ['questionnaire_upd', '--source', path_to_main_dummy],
                    ['fetchkeywords'],
                    ['questionnaire', '--questionnaire_id', 'QQ001'],
                    ['question', '--questionnaire_id', 'QQ001', '--question_id', 'Q01'],
                    ['doanswer', '--questionnaire_id', 'QQ001', '--question_id', 'Q01', '--session_id', '0000', '--option_id', 'Q01A1'],
                    ['getsessionanswers', '--questionnaire_id', 'QQ001', '--session_id', '0000'],
                    ['getquestionanswers', '--questionnaire_id', 'QQ001', '--question_id', 'Q01'],
                    ['questionnaireanscount', '--questionnaire_id', 'QQ001'],
                    ['fetchquestionnaires', '--keywords', 'ΕΜΠ']]

print("================== Valid Commands ==================")
no = 1
for cmd in correct_commands:
    for form in ['json','csv']:
        test_command(prefix + cmd + ['--format', form],False,form=='csv',no)
        no += 1

# Wrong parts in comments
incorrect_commands = [['healthcheck', 'totallyvalidflag'], # stray argument
                    ['resetsome'], # invalid command
                    ['resetq', '--questionnaire_notid', 'QQ69420'], # non existent flag
                    ['questionnaire_upd', '--source', '\\Users\\Mark\\definitely_homework\\'], # invalid path
                    ['getkeywords'], # invalid command
                    ['questionnaire', '--questionnaire_notid', 'QQ69420'], # non existent flag
                    ['question', '--questionnaire_id', 'QQ001'], # '--question_id' missing
                    ['doanswer', '--questionnaire_id', 'QQ001', '--question_id', 'Q01', '--session_id', '0000', 'Q01A1'], # argument without its flag
                    ['getsessionanswers', '--questionnaire_id', '--hey', '--session_id', '0000'], # missing '--questionnaire_id' parameter and stray argument
                    [], # missing everything
                    ['--questionnaire_id', 'QQ001'], # missing primary argument
                    ['fetchquestionnaires', '--keywords', '--questionnaire_id', 'QQ001', 'ΕΜΠ']] # questionnaire_id

print("================== Invalid Commands ==================")
for cmd in incorrect_commands:
    for form in ['json','csv']:
        test_command(prefix + cmd + ['--format', form],True,form=='csv',no)
        no += 1
test_command(prefix,True,True,no)
no += 1
test_command(prefix+['doanswer', '--questionnaire_id', 'QQ001', '--question_id', 'Q01', '--session_id', '0000', '--option_id', 'Q01A1'], True, False, no)
no += 1