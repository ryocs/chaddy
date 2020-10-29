@echo off

REM Path to Chrome exe
set CHROME_EXE=c:\Program Files (x86)\Google\Chrome\Application\chrome.exe

set CHROME_SETTINGS=
REM Path to the index.html file
set CHROME_SETTINGS=%CHROME_SETTINGS% --app=C:\PERS\ChaddyGit\chaddy\client\index.html
start "" "%CHROME_EXE%" %CHROME_SETTINGS%