@echo off
git add .
set /p mensaje=Mensaje del commit: 
git commit -m "%mensaje%"
git push
pause