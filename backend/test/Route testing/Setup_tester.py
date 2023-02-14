import os
import shutil
import sys

postman_def_dir = os.path.expanduser('~') + "\\Postman\\files"
files = ['dummydata_main.json','dummydata2.json','dummydata3.json','dummydata4.json']

def do_copy(target):
    print("Attempting to copy files...")
    try: 
        for f in files:
            shutil.copy2(f,target)
        input("Done! Press enter to exit.")
    except FileNotFoundError as e:
        print("Error: File not found -", e)
    except PermissionError as e:
        print("Error: Permission denied -", e)
    except shutil.SameFileError as e:
        print("Error: Source and destination are the same -", e)
    except Exception as e:
        print("An error occurred while copying the file -", e)
    finally:
        sys.exit(0)

print(
f"""This script automates the testing process by moving the test data to the working directory of Postman.
Postman needs to already be installed in the system.

Searching for directory {postman_def_dir}..."""
)


if (os.path.isdir(postman_def_dir)):
    while(True):
        ans = input("Found it! Do you wish that the data be moved there? (y/n) ")
        if (ans in ['y','n']):
            break
    if (ans == 'y'):
        do_copy(postman_def_dir)
else:
    print("Not found! Make sure you have downloaded Postman.")

while(True):
    ans = input("Input a custom Postman\\files path or just press enter to exit. ")
    if (ans == ''):
        sys.exit(0)
    if (os.path.isdir(ans)):
        do_copy(ans)
